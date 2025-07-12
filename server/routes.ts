import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertFundingRequestSchema, 
  insertSavingsGoalSchema, 
  insertInvestmentOfferSchema,
  insertContractSchema
} from "@shared/schema";
import { generatePDF } from "./pdf-generator";
import { sendEmail } from "./email-service";
import { telegramService } from "./telegram-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Funding requests routes
  app.post('/api/funding-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertFundingRequestSchema.parse({ ...req.body, userId });
      
      const fundingRequest = await storage.createFundingRequest(data);
      
      // Create contract
      const contract = await storage.createContract({
        userId,
        type: "funding",
        referenceId: fundingRequest.id,
        contractData: {
          amount: data.amount,
          purpose: data.purpose,
          monthlyIncome: data.monthlyIncome,
          userName: `${req.user.claims.first_name || ''} ${req.user.claims.last_name || ''}`.trim(),
          userEmail: req.user.claims.email,
          date: new Date().toISOString(),
        }
      });
      
      // Send Telegram notification
      const user = await storage.getUser(userId);
      if (user) {
        await telegramService.sendNewServiceAlert({
          fullName: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.email || '',
          phone: user.phone || '',
          nationalId: user.nationalId || '',
          job: user.job || '',
          address: user.address || '',
          serviceType: 'طلب تمويل',
          amount: data.amount,
          timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })
        });
      }
      
      res.json({ fundingRequest, contract });
    } catch (error) {
      console.error("Error creating funding request:", error);
      res.status(500).json({ message: "Failed to create funding request" });
    }
  });

  app.get('/api/funding-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getFundingRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching funding requests:", error);
      res.status(500).json({ message: "Failed to fetch funding requests" });
    }
  });

  // Savings goals routes
  app.post('/api/savings-goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertSavingsGoalSchema.parse({ ...req.body, userId });
      
      const savingsGoal = await storage.createSavingsGoal(data);
      
      // Send Telegram notification
      const user = await storage.getUser(userId);
      if (user) {
        await telegramService.sendNewServiceAlert({
          fullName: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.email || '',
          phone: user.phone || '',
          nationalId: user.nationalId || '',
          job: user.job || '',
          address: user.address || '',
          serviceType: `هدف ادخار - ${data.goalName}`,
          amount: data.targetAmount,
          timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })
        });
      }
      
      res.json(savingsGoal);
    } catch (error) {
      console.error("Error creating savings goal:", error);
      res.status(500).json({ message: "Failed to create savings goal" });
    }
  });

  app.get('/api/savings-goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getSavingsGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching savings goals:", error);
      res.status(500).json({ message: "Failed to fetch savings goals" });
    }
  });

  // Investment offers routes
  app.post('/api/investment-offers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertInvestmentOfferSchema.parse({ ...req.body, userId });
      
      const investmentOffer = await storage.createInvestmentOffer(data);
      
      // Create contract
      const contract = await storage.createContract({
        userId,
        type: "investment",
        referenceId: investmentOffer.id,
        contractData: {
          planName: data.planName,
          investmentAmount: data.investmentAmount,
          expectedReturn: data.expectedReturn,
          duration: data.duration,
          userName: `${req.user.claims.first_name || ''} ${req.user.claims.last_name || ''}`.trim(),
          userEmail: req.user.claims.email,
          date: new Date().toISOString(),
        }
      });
      
      // Send Telegram notification
      const user = await storage.getUser(userId);
      if (user) {
        await telegramService.sendNewServiceAlert({
          fullName: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.email || '',
          phone: user.phone || '',
          nationalId: user.nationalId || '',
          job: user.job || '',
          address: user.address || '',
          serviceType: `استثمار - ${data.planName}`,
          amount: data.investmentAmount,
          timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })
        });
      }
      
      res.json({ investmentOffer, contract });
    } catch (error) {
      console.error("Error creating investment offer:", error);
      res.status(500).json({ message: "Failed to create investment offer" });
    }
  });

  app.get('/api/investment-offers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const offers = await storage.getInvestmentOffers(userId);
      res.json(offers);
    } catch (error) {
      console.error("Error fetching investment offers:", error);
      res.status(500).json({ message: "Failed to fetch investment offers" });
    }
  });

  // Referrals routes
  app.get('/api/referrals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const referrals = await storage.getReferrals(userId);
      res.json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ message: "Failed to fetch referrals" });
    }
  });

  app.get('/api/referrals/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getReferralStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ message: "Failed to fetch referral stats" });
    }
  });

  // Contracts routes
  app.get('/api/contracts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contracts = await storage.getContracts(userId);
      res.json(contracts);
    } catch (error) {
      console.error("Error fetching contracts:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.post('/api/contracts/:id/sign', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const { signatureData } = req.body;
      const userId = req.user.claims.sub;
      
      const contract = await storage.getContract(contractId);
      if (!contract || contract.userId !== userId) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      // Generate PDF
      const pdfBuffer = await generatePDF(contract, signatureData);
      const pdfUrl = `/api/contracts/${contractId}/pdf`;
      
      // Update contract with signature
      const updatedContract = await storage.updateContractSignature(contractId, signatureData, pdfUrl);
      
      // Send email with contract
      try {
        await sendEmail({
          to: req.user.claims.email,
          subject: "عقد Flous Cash - تم التوقيع بنجاح",
          html: `
            <div dir="rtl" style="font-family: Arial, sans-serif;">
              <h2>مبروك! تم توقيع عقدك بنجاح</h2>
              <p>عزيزي ${req.user.claims.first_name || 'العميل'},</p>
              <p>احنا بنهنيك على توقيع عقدك مع Flous Cash. العقد مرفق مع هذا الإيميل.</p>
              <p>شكراً لثقتك فينا!</p>
              <p>فريق Flous Cash</p>
            </div>
          `,
          attachments: [
            {
              filename: 'contract.pdf',
              content: pdfBuffer,
              contentType: 'application/pdf'
            }
          ]
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the request if email fails
      }
      
      res.json(updatedContract);
    } catch (error) {
      console.error("Error signing contract:", error);
      res.status(500).json({ message: "Failed to sign contract" });
    }
  });

  app.get('/api/contracts/:id/pdf', isAuthenticated, async (req: any, res) => {
    try {
      const contractId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const contract = await storage.getContract(contractId);
      if (!contract || contract.userId !== userId) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      const pdfBuffer = await generatePDF(contract, contract.signatureData || undefined);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contract-${contractId}.pdf"`
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const [fundingRequests, savingsGoals, investmentOffers, referralStats] = await Promise.all([
        storage.getFundingRequests(userId),
        storage.getSavingsGoals(userId),
        storage.getInvestmentOffers(userId),
        storage.getReferralStats(userId),
      ]);
      
      const totalFunded = fundingRequests
        .filter(req => req.status === 'approved')
        .reduce((sum, req) => sum + parseFloat(req.amount), 0);
      
      const totalSavings = savingsGoals
        .reduce((sum, goal) => sum + parseFloat(goal.currentAmount || '0'), 0);
      
      const totalInvestments = investmentOffers
        .filter(offer => offer.status === 'active')
        .reduce((sum, offer) => sum + parseFloat(offer.investmentAmount), 0);
      
      res.json({
        totalFunded,
        totalSavings,
        totalInvestments,
        referralCount: referralStats.count,
        referralEarnings: referralStats.totalEarnings,
        savingsProgress: savingsGoals.map(goal => ({
          id: goal.id,
          name: goal.goalName,
          progress: parseFloat(goal.currentAmount || '0') / parseFloat(goal.targetAmount) * 100
        }))
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Handle referral signup
  app.post('/api/referral/signup', async (req, res) => {
    try {
      const { referralCode } = req.body;
      
      if (referralCode) {
        // Find the referrer
        const referrer = await storage.getUser(referralCode);
        if (referrer) {
          // This will be handled when the user actually signs up through Replit Auth
          res.json({ valid: true, referrerId: referrer.id });
        } else {
          res.json({ valid: false });
        }
      } else {
        res.json({ valid: false });
      }
    } catch (error) {
      console.error("Error validating referral:", error);
      res.status(500).json({ message: "Failed to validate referral" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

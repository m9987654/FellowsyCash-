import {
  users,
  fundingRequests,
  savingsGoals,
  investmentOffers,
  referrals,
  contracts,
  type User,
  type UpsertUser,
  type FundingRequest,
  type InsertFundingRequest,
  type SavingsGoal,
  type InsertSavingsGoal,
  type InvestmentOffer,
  type InsertInvestmentOffer,
  type Contract,
  type InsertContract,
  type Referral,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Funding requests
  createFundingRequest(request: InsertFundingRequest): Promise<FundingRequest>;
  getFundingRequests(userId: string): Promise<FundingRequest[]>;
  getFundingRequest(id: number): Promise<FundingRequest | undefined>;
  updateFundingRequestStatus(id: number, status: string, contractUrl?: string): Promise<FundingRequest>;
  
  // Savings goals
  createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal>;
  getSavingsGoals(userId: string): Promise<SavingsGoal[]>;
  getSavingsGoal(id: number): Promise<SavingsGoal | undefined>;
  updateSavingsGoalAmount(id: number, amount: string): Promise<SavingsGoal>;
  
  // Investment offers
  createInvestmentOffer(offer: InsertInvestmentOffer): Promise<InvestmentOffer>;
  getInvestmentOffers(userId: string): Promise<InvestmentOffer[]>;
  getInvestmentOffer(id: number): Promise<InvestmentOffer | undefined>;
  updateInvestmentOfferStatus(id: number, status: string, contractUrl?: string): Promise<InvestmentOffer>;
  
  // Referrals
  createReferral(referrerId: string, referredUserId: string): Promise<Referral>;
  getReferrals(userId: string): Promise<Referral[]>;
  getReferralStats(userId: string): Promise<{ count: number; totalEarnings: string }>;
  
  // Contracts
  createContract(contract: InsertContract): Promise<Contract>;
  getContracts(userId: string): Promise<Contract[]>;
  getContract(id: number): Promise<Contract | undefined>;
  updateContractSignature(id: number, signatureData: string, pdfUrl?: string): Promise<Contract>;
  
  // Generate referral code
  generateReferralCode(): string;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Generate referral code if not provided
    if (!userData.referralCode) {
      userData.referralCode = this.generateReferralCode();
    }
    
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Funding requests
  async createFundingRequest(request: InsertFundingRequest): Promise<FundingRequest> {
    const [fundingRequest] = await db
      .insert(fundingRequests)
      .values(request)
      .returning();
    return fundingRequest;
  }

  async getFundingRequests(userId: string): Promise<FundingRequest[]> {
    return await db
      .select()
      .from(fundingRequests)
      .where(eq(fundingRequests.userId, userId))
      .orderBy(desc(fundingRequests.createdAt));
  }

  async getFundingRequest(id: number): Promise<FundingRequest | undefined> {
    const [request] = await db
      .select()
      .from(fundingRequests)
      .where(eq(fundingRequests.id, id));
    return request;
  }

  async updateFundingRequestStatus(id: number, status: "pending" | "approved" | "rejected", contractUrl?: string): Promise<FundingRequest> {
    const [request] = await db
      .update(fundingRequests)
      .set({ status, contractUrl, updatedAt: new Date() })
      .where(eq(fundingRequests.id, id))
      .returning();
    return request;
  }

  // Savings goals
  async createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal> {
    const [savingsGoal] = await db
      .insert(savingsGoals)
      .values(goal)
      .returning();
    return savingsGoal;
  }

  async getSavingsGoals(userId: string): Promise<SavingsGoal[]> {
    return await db
      .select()
      .from(savingsGoals)
      .where(eq(savingsGoals.userId, userId))
      .orderBy(desc(savingsGoals.createdAt));
  }

  async getSavingsGoal(id: number): Promise<SavingsGoal | undefined> {
    const [goal] = await db
      .select()
      .from(savingsGoals)
      .where(eq(savingsGoals.id, id));
    return goal;
  }

  async updateSavingsGoalAmount(id: number, amount: string): Promise<SavingsGoal> {
    const [goal] = await db
      .update(savingsGoals)
      .set({ currentAmount: amount, updatedAt: new Date() })
      .where(eq(savingsGoals.id, id))
      .returning();
    return goal;
  }

  // Investment offers
  async createInvestmentOffer(offer: InsertInvestmentOffer): Promise<InvestmentOffer> {
    const [investmentOffer] = await db
      .insert(investmentOffers)
      .values(offer)
      .returning();
    return investmentOffer;
  }

  async getInvestmentOffers(userId: string): Promise<InvestmentOffer[]> {
    return await db
      .select()
      .from(investmentOffers)
      .where(eq(investmentOffers.userId, userId))
      .orderBy(desc(investmentOffers.createdAt));
  }

  async getInvestmentOffer(id: number): Promise<InvestmentOffer | undefined> {
    const [offer] = await db
      .select()
      .from(investmentOffers)
      .where(eq(investmentOffers.id, id));
    return offer;
  }

  async updateInvestmentOfferStatus(id: number, status: "pending" | "active" | "completed" | "cancelled", contractUrl?: string): Promise<InvestmentOffer> {
    const [offer] = await db
      .update(investmentOffers)
      .set({ status, contractUrl, updatedAt: new Date() })
      .where(eq(investmentOffers.id, id))
      .returning();
    return offer;
  }

  // Referrals
  async createReferral(referrerId: string, referredUserId: string): Promise<Referral> {
    const [referral] = await db
      .insert(referrals)
      .values({ referrerId, referredUserId })
      .returning();
    return referral;
  }

  async getReferrals(userId: string): Promise<Referral[]> {
    return await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));
  }

  async getReferralStats(userId: string): Promise<{ count: number; totalEarnings: string }> {
    const userReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId));
    
    const count = userReferrals.length;
    const totalEarnings = userReferrals
      .reduce((sum, ref) => sum + parseFloat(ref.reward || "0"), 0)
      .toFixed(2);
    
    return { count, totalEarnings };
  }

  // Contracts
  async createContract(contract: InsertContract): Promise<Contract> {
    const [newContract] = await db
      .insert(contracts)
      .values(contract)
      .returning();
    return newContract;
  }

  async getContracts(userId: string): Promise<Contract[]> {
    return await db
      .select()
      .from(contracts)
      .where(eq(contracts.userId, userId))
      .orderBy(desc(contracts.createdAt));
  }

  async getContract(id: number): Promise<Contract | undefined> {
    const [contract] = await db
      .select()
      .from(contracts)
      .where(eq(contracts.id, id));
    return contract;
  }

  async updateContractSignature(id: number, signatureData: string, pdfUrl?: string): Promise<Contract> {
    const [contract] = await db
      .update(contracts)
      .set({ 
        signatureData, 
        pdfUrl, 
        status: "signed",
        updatedAt: new Date() 
      })
      .where(eq(contracts.id, id))
      .returning();
    return contract;
  }

  // Generate referral code
  generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

export const storage = new DatabaseStorage();

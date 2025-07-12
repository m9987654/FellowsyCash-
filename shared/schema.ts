import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  fullName: varchar("full_name"),
  phone: varchar("phone"),
  nationalId: varchar("national_id"),
  address: text("address"),
  job: varchar("job"),
  profileImageUrl: varchar("profile_image_url"),
  referralCode: varchar("referral_code").unique(),
  referredBy: varchar("referred_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Funding requests table
export const fundingRequests = pgTable("funding_requests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  purpose: text("purpose").notNull(),
  monthlyIncome: decimal("monthly_income", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { enum: ["pending", "approved", "rejected"] }).default("pending"),
  contractUrl: varchar("contract_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Savings goals table
export const savingsGoals = pgTable("savings_goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  goalName: varchar("goal_name").notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  monthlyContribution: decimal("monthly_contribution", { precision: 10, scale: 2 }).notNull(),
  targetDate: timestamp("target_date"),
  status: varchar("status", { enum: ["active", "completed", "paused"] }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Investment offers table
export const investmentOffers = pgTable("investment_offers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  planName: varchar("plan_name").notNull(),
  investmentAmount: decimal("investment_amount", { precision: 10, scale: 2 }).notNull(),
  expectedReturn: decimal("expected_return", { precision: 5, scale: 2 }).notNull(),
  duration: integer("duration").notNull().default(10), // in days
  status: varchar("status", { enum: ["pending", "active", "completed", "cancelled"] }).default("pending"),
  contractUrl: varchar("contract_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Referrals table
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: varchar("referrer_id").notNull(),
  referredUserId: varchar("referred_user_id").notNull(),
  reward: decimal("reward", { precision: 10, scale: 2 }).default("100.00"),
  status: varchar("status", { enum: ["pending", "paid"] }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contracts table
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  type: varchar("type", { enum: ["funding", "investment", "savings"] }).notNull(),
  referenceId: integer("reference_id").notNull(),
  contractData: jsonb("contract_data").notNull(),
  signatureData: text("signature_data"),
  pdfUrl: varchar("pdf_url"),
  status: varchar("status", { enum: ["draft", "signed", "completed"] }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  fundingRequests: many(fundingRequests),
  savingsGoals: many(savingsGoals),
  investmentOffers: many(investmentOffers),
  referrals: many(referrals),
  contracts: many(contracts),
}));

export const fundingRequestsRelations = relations(fundingRequests, ({ one }) => ({
  user: one(users, {
    fields: [fundingRequests.userId],
    references: [users.id],
  }),
}));

export const savingsGoalsRelations = relations(savingsGoals, ({ one }) => ({
  user: one(users, {
    fields: [savingsGoals.userId],
    references: [users.id],
  }),
}));

export const investmentOffersRelations = relations(investmentOffers, ({ one }) => ({
  user: one(users, {
    fields: [investmentOffers.userId],
    references: [users.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
  }),
  referredUser: one(users, {
    fields: [referrals.referredUserId],
    references: [users.id],
  }),
}));

export const contractsRelations = relations(contracts, ({ one }) => ({
  user: one(users, {
    fields: [contracts.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertFundingRequestSchema = createInsertSchema(fundingRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSavingsGoalSchema = createInsertSchema(savingsGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvestmentOfferSchema = createInsertSchema(investmentOffers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type FundingRequest = typeof fundingRequests.$inferSelect;
export type InsertFundingRequest = z.infer<typeof insertFundingRequestSchema>;
export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>;
export type InvestmentOffer = typeof investmentOffers.$inferSelect;
export type InsertInvestmentOffer = z.infer<typeof insertInvestmentOfferSchema>;
export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;
export type Referral = typeof referrals.$inferSelect;

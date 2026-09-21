import { relations } from 'drizzle-orm';
import { user, session, account } from './core';
import { leader, broker, candidate, generatedCV, quickRegistration, invoice } from './agency';
import { charityCampaign, charityDonation, charityVolunteer } from './charity';

// ==========================================
// CORE RELATIONS
// ==========================================
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  // Agency domain links
  candidates: many(candidate),
  quickRegistrations: many(quickRegistration),
  // Charity domain links
  createdCampaigns: many(charityCampaign),
  donations: many(charityDonation),
  volunteers: many(charityVolunteer),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// ==========================================
// AGENCY RELATIONS
// ==========================================
export const leaderRelations = relations(leader, ({ many }) => ({
  brokers: many(broker),
}));

export const brokerRelations = relations(broker, ({ one, many }) => ({
  leader: one(leader, {
    fields: [broker.leaderId],
    references: [leader.id],
  }),
  candidates: many(candidate),
  quickRegistrations: many(quickRegistration),
}));

export const candidateRelations = relations(candidate, ({ one, many }) => ({
  broker: one(broker, {
    fields: [candidate.brokerId],
    references: [broker.id],
  }),
  registeredBy: one(user, {
    fields: [candidate.registeredById],
    references: [user.id],
  }),
  generatedCVs: many(generatedCV),
  invoices: many(invoice),
}));

export const generatedCVRelations = relations(generatedCV, ({ one }) => ({
  candidate: one(candidate, {
    fields: [generatedCV.candidateId],
    references: [candidate.id],
  }),
}));

export const quickRegistrationRelations = relations(quickRegistration, ({ one }) => ({
  broker: one(broker, {
    fields: [quickRegistration.brokerId],
    references: [broker.id],
  }),
  registeredBy: one(user, {
    fields: [quickRegistration.registeredById],
    references: [user.id],
  }),
}));

export const invoiceRelations = relations(invoice, ({ one }) => ({
  candidate: one(candidate, {
    fields: [invoice.candidateId],
    references: [candidate.id],
  }),
}));

// ==========================================
// CHARITY RELATIONS
// ==========================================
export const charityCampaignRelations = relations(charityCampaign, ({ one, many }) => ({
  createdBy: one(user, {
    fields: [charityCampaign.createdById],
    references: [user.id],
  }),
  donations: many(charityDonation),
}));

export const charityDonationRelations = relations(charityDonation, ({ one }) => ({
  campaign: one(charityCampaign, {
    fields: [charityDonation.campaignId],
    references: [charityCampaign.id],
  }),
  user: one(user, {
    fields: [charityDonation.userId],
    references: [user.id],
  }),
}));

export const charityVolunteerRelations = relations(charityVolunteer, ({ one }) => ({
  user: one(user, {
    fields: [charityVolunteer.userId],
    references: [user.id],
  }),
}));

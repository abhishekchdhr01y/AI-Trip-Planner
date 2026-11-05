import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tripUsage: defineTable({
    userId: v.string(),
    createdAt: v.number(),
  }).index("by_user_createdAt", ["userId", "createdAt"]),

  trips: defineTable({
    userId: v.string(),
    destination: v.string(),
    tripData: v.any(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

const FREE_LIMIT = 200;                    
const PRO_LIMIT = 10;                    
const WINDOW_MS = 24 * 60 * 60 * 1000;   

const planArg = v.union(v.literal("free"), v.literal("pro"));

function checkSecret(secret: string) {
  if (secret !== process.env.CONVEX_API_SECRET) {
    throw new Error("Unauthorized");
  }
}

async function getUsage(ctx: QueryCtx, userId: string, plan: "free" | "pro") {
  const limit = plan === "pro" ? PRO_LIMIT : FREE_LIMIT;
  const since = Date.now() - WINDOW_MS;

  const db = ctx.db as any;
  const recent = await db
    .query("tripUsage")
    .withIndex("by_user_createdAt", (q: any) =>
      q.eq("userId", userId).gte("createdAt", since)
    )
    .collect();

  const used = recent.length;
  const oldest = recent.length
    ? Math.min(...recent.map((r: any) => r.createdAt))
    : null;

  return {
    plan,
    allowed: used < limit,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    resetAt: oldest ? oldest + WINDOW_MS : null,
  };
}

export const getQuota = query({
  args: { userId: v.string(), secret: v.string(), plan: planArg },
  handler: async (ctx, { userId, secret, plan }) => {
    checkSecret(secret);
    return getUsage(ctx, userId, plan);
  },
});

export const consumeTrip = mutation({
  args: { userId: v.string(), secret: v.string(), plan: planArg },
  handler: async (ctx, { userId, secret, plan }) => {
    checkSecret(secret);
    const usage = await getUsage(ctx, userId, plan);
    if (!usage.allowed) return usage;

    const db = ctx.db as any;
    await db.insert("tripUsage", { userId, createdAt: Date.now() });
    return {
      ...usage,
      allowed: true,
      used: usage.used + 1,
      remaining: usage.remaining - 1,
    };
  },
});

export const saveTrip = mutation({
  args: {
    userId: v.string(),
    destination: v.string(),
    tripData: v.any(),
  },
  handler: async (ctx, { userId, destination, tripData }) => {
    const db = ctx.db as any;
    return await db.insert("trips", {
      userId,
      destination,
      tripData,
      createdAt: Date.now(),
    });
  },
});

export const getUserTrips = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    if (!userId) return [];

    const db = ctx.db as any;
    return await db
      .query("trips")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});


export const getTripById = query({
  args: { tripId: v.id("trips" as any) },
  handler: async (ctx, { tripId }) => {
    const db = ctx.db as any;
    return await db.get(tripId);
  },
});
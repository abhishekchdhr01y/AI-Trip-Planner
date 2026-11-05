import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const secret = process.env.CONVEX_API_SECRET!;

const PROMPT = `You are an AI Trip Planner Agent. Help the user plan a trip by asking ONE trip-related question at a time.

Ask in this order and wait for each answer:
1. Starting location (source)
2. Destination city or country
3. Group size (Solo, Couple, Family, Friends)
4. Budget (Low, Medium, High)
5. Trip duration (number of days)
6. Travel interests (adventure, sightseeing, cultural, food, nightlife, relaxation)
7. Special requirements or preferences (the user may say "no")

Rules:
- Never ask multiple questions at once or irrelevant questions.
- If an answer is unclear, politely ask the user to clarify.
- Keep replies short, friendly and conversational (max 2 sentences).
- NEVER write a trip summary or itinerary yourself.

EVERY reply must be strict JSON only, no extra text:
{
  "resp": "Text to show the user",
  "ui": "groupSize | budget | TripDuration | interests | Final | none"
}

Set "ui" based on the question you are asking RIGHT NOW:
- "groupSize" when asking group size
- "budget" when asking budget
- "TripDuration" when asking trip duration
- "interests" when asking travel interests
- "none" for source, destination and special requirements
- "Final" as soon as the user has answered question 7 (even with "no"). Then "resp" must be a short line like "Great, I have everything I need! Tap below to build your trip." Do not ask anything else.`;

export async function POST(req: NextRequest) {
  try {
   
    const { userId, has } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

   
    const plan = has({ plan: "pro" }) ? "pro" : "free";

   
    
    const quota = await fetchQuery(api.trips.getQuota, { userId, secret, plan });
    if (!quota.allowed) {
      return NextResponse.json(
        { error: "LIMIT_REACHED", resetAt: quota.resetAt },
        { status: 429 }
      );
    }

    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      response_format: { type: "json_object" },
      max_tokens: 1000,
      messages: [{ role: "system", content: PROMPT }, ...messages],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Empty response from model" }, { status: 502 });
    }

    return NextResponse.json(JSON.parse(content));
  } catch (e: any) {
    console.error("aimodel error:", e);
    return NextResponse.json({ error: e?.message ?? "Something went wrong" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "AI Trip Planner",
  },
});

const secret = process.env.CONVEX_API_SECRET!;

const TRIP_PROMPT = `You are an AI Trip Planner. Using the whole conversation, create the final trip plan.

Return ONLY valid JSON (no markdown, no backticks, no extra text) in exactly this shape:
{
  "title": "string",
  "origin": "string",
  "destination": "string",
  "duration": "string",
  "budget": "string",
  "groupSize": "string",
  "hotels": [{ "name": "string", "priceRange": "string", "area": "string" }],
  "days": [
    {
      "day": 1,
      "title": "string",
      "activities": [
        { "time": "string", "title": "string", "description": "string", "place": "string" }
      ]
    }
  ]
}

Rules:
- Include exactly one entry in "days" for every day of the trip.
- Give 3 activities per day (morning, afternoon, evening).
- Keep each description to ONE short sentence.
- Give 3 hotels that match the budget.
- Match the user's group size, budget and interests.`;

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

    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid payload: 'messages' array is required." },
        { status: 400 }
      );
    }

    const formattedMessages = messages
      .filter((msg: any) => msg.role && msg.content)
      .map(({ role, content }: any) => ({ role, content }));

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      max_tokens: 3000,
      messages: [{ role: "system", content: TRIP_PROMPT }, ...formattedMessages],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error("generate-trip: Empty response from model", completion);
      return NextResponse.json({ error: "Empty response from AI model" }, { status: 502 });
    }

    const clean = content.replace(/```json|```/g, "").trim();

    let parsedJSON;
    try {
      parsedJSON = JSON.parse(clean);
    } catch (parseError) {
      console.error("generate-trip: Invalid JSON from model:", clean);
      return NextResponse.json({ error: "Model returned invalid JSON format" }, { status: 502 });
    }

    
    const used = await fetchMutation(api.trips.consumeTrip, { userId, secret, plan });
    if (!used.allowed) {
      return NextResponse.json(
        { error: "LIMIT_REACHED", resetAt: used.resetAt },
        { status: 429 }
      );
    }

    return NextResponse.json(parsedJSON);
  } catch (e: any) {
    console.error("generate-trip API error:", e?.status, e?.message || e);
    return NextResponse.json(
      { error: e?.message ?? "Something went wrong" },
      { status: e?.status ?? 500 }
    );
  }
}
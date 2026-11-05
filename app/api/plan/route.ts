import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, has } = await auth();
  if (!userId) {
    return NextResponse.json({ plan: "free", signedIn: false });
  }
  return NextResponse.json({
    plan: has({ plan: "pro" }) ? "pro" : "free",
    signedIn: true,
  });
}
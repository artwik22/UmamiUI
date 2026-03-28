import { getWebsites } from "@/lib/umami";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const websites = await getWebsites();
    return NextResponse.json(websites);
  } catch (error) {
    console.error('Failed to fetch websites:', error);
    return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 });
  }
}

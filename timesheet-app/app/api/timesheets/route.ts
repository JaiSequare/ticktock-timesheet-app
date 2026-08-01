import { NextResponse } from "next/server";
import { mockTimesheets } from "@/app/lib/mockData";

export async function GET() {
  return NextResponse.json(mockTimesheets, { status: 200 });
}
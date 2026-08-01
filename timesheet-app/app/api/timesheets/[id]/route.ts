import { NextRequest, NextResponse } from "next/server";
import { mockTimesheetDetails } from "@/app/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const detail =
    mockTimesheetDetails[id] ?? mockTimesheetDetails["ts-1"];

  return NextResponse.json(detail);
}
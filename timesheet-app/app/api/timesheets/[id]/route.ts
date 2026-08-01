import { NextResponse } from "next/server";
import { mockTimesheetDetails } from "@/app/lib/mockData";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const detail = mockTimesheetDetails[params.id] || mockTimesheetDetails["ts-1"];
  return NextResponse.json(detail, { status: 200 });
};
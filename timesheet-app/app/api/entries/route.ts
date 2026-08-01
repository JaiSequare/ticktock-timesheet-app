import { NextResponse } from "next/server";
import { mockEntries } from "@/app/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weekId = searchParams.get("weekId");

  if (weekId) {
    const filteredEntries = mockEntries.filter((e) => e.timesheetId === weekId);
    return NextResponse.json(filteredEntries, { status: 200 });
  }

  return NextResponse.json(mockEntries, { status: 200 });
};
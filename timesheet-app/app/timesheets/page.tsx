import Header from "../components/Header";
import Footer from "../components/Footer";
import TimesheetTable from "../components/TimesheetTable";
import { Timesheet } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!;

const getTimesheets = async (): Promise<Timesheet[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/timesheets`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch timesheets");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

const TimesheetsPage = async () => {
  const timesheets = await getTimesheets();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <TimesheetTable initialTimesheets={timesheets} />
        <Footer />
      </main>
    </div>
  );
};

export default TimesheetsPage;
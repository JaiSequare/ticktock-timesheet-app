import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import TimesheetDetailView from "@/app/components/TimesheetDetailView";
import { TimesheetDetail } from "@/app/types";

const getTimesheetDetail = async (id: string): Promise<TimesheetDetail> => {
  try {
    const res = await fetch(`http://localhost:3000/api/timesheets/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch detail");
    return res.json();
  } catch (error) {
    console.error(error);
    return {
      id,
      dateRange: "21 - 26 January, 2024",
      days: [],
    };
  }
};

const DetailPage = async ({ params }: { params: { id: string } }) => {
  const data = await getTimesheetDetail(params.id);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <TimesheetDetailView initialData={data} />
        <Footer />
      </main>
    </div>
  );
};

export default DetailPage;
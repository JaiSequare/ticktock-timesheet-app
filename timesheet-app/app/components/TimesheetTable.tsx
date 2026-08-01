"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowDown, ChevronDown } from "lucide-react";
import { Timesheet, SortField, SortOrder, getTimesheetStatus, TaskEntry } from "../types";
import TaskModal from "./TaskModal";
import { pageCount, pageNumber } from "../lib/mockData";

interface Props {
  initialTimesheets: Timesheet[];
}

const TimesheetTable = ({ initialTimesheets }: Props) => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>(initialTimesheets);

  // filter & sort states
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("weekNumber");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // modal state for direct table creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimesheetId, setSelectedTimesheetId] = useState<string | null>(null);

  // sort handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // timesheet table filtration/sorting
  const processedTimesheets = useMemo(() => {
    return timesheets
      .filter((item) => {
        const calculatedStatus = getTimesheetStatus(item.totalHours);

        if (statusFilter !== "ALL" && calculatedStatus !== statusFilter) {
          return false;
        }

        if (dateRangeFilter === "JAN_2024") {
          return item.startDate.startsWith("2024-01");
        } else if (dateRangeFilter === "FEB_2024") {
          return item.startDate.startsWith("2024-02");
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField as keyof Timesheet];
        let valB: any = b[sortField as keyof Timesheet];

        if (sortField === "status") {
          valA = getTimesheetStatus(a.totalHours);
          valB = getTimesheetStatus(b.totalHours);
        }

        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [timesheets, statusFilter, dateRangeFilter, sortField, sortOrder]);

  // pagination handling
  const totalPages = Math.ceil(processedTimesheets.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedTimesheets.slice(start, start + itemsPerPage);
  }, [processedTimesheets, currentPage, itemsPerPage]);

  // handle opening modal from table "create" action
  const handleOpenCreateModal = (id: string) => {
    setSelectedTimesheetId(id);
    setIsModalOpen(true);
  };

  // saving task handler (from table view)
  const handleSaveTaskFromTable = (taskData: Omit<TaskEntry, "id">) => {
    if (!selectedTimesheetId) return;

    setTimesheets((prev) =>
      prev.map((ts) => {
        if (ts.id === selectedTimesheetId) {
          const updatedHours = ts.totalHours + taskData.hours;
          return {
            ...ts,
            totalHours: updatedHours,
          };
        }
        return ts;
      })
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Timesheets</h1>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <select
            value={dateRangeFilter}
            onChange={(e) => {
              setDateRangeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Date Range</option>
            <option value="JAN_2024">January 2024</option>
            <option value="FEB_2024">February 2024</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="ALL">Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="INCOMPLETE">Incomplete</option>
            <option value="MISSING">Missing</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-3 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th
                onClick={() => handleSort("weekNumber")}
                className="py-3.5 px-4 cursor-pointer hover:text-gray-900 select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>WEEK #</span>
                  <ArrowDown size={12} className={sortField === "weekNumber" && sortOrder === "desc" ? "rotate-180" : ""} />
                </div>
              </th>

              <th
                onClick={() => handleSort("startDate")}
                className="py-3.5 px-4 cursor-pointer hover:text-gray-900 select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>DATE</span>
                  <ArrowDown size={12} className={sortField === "startDate" && sortOrder === "desc" ? "rotate-180" : ""} />
                </div>
              </th>

              <th
                onClick={() => handleSort("status")}
                className="py-3.5 px-4 cursor-pointer hover:text-gray-900 select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>STATUS</span>
                  <ArrowDown size={12} className={sortField === "status" && sortOrder === "desc" ? "rotate-180" : ""} />
                </div>
              </th>

              <th className="py-3.5 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No timesheets found matching the selected filters.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => {
                const status = getTimesheetStatus(item.totalHours);

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      {item.weekNumber}
                    </td>

                    <td className="py-4 px-4 text-gray-600 font-normal">
                      {item.dateRangeLabel}
                    </td>

                    <td className="py-4 px-4">
                      {status === "COMPLETED" && (
                        <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md bg-[#e6f7ed] text-[#12b76a]">
                          COMPLETED
                        </span>
                      )}
                      {status === "INCOMPLETE" && (
                        <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md bg-[#fef6e7] text-[#d97706]">
                          INCOMPLETE
                        </span>
                      )}
                      {status === "MISSING" && (
                        <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wide rounded-md bg-[#fde8ef] text-[#e11d48]">
                          MISSING
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-right font-medium">
                      {status === "COMPLETED" && (
                        <Link href={`/timesheets/${item.id}`} className="text-blue-600 hover:underline">
                          View
                        </Link>
                      )}
                      {status === "INCOMPLETE" && (
                        <Link href={`/timesheets/${item.id}`} className="text-blue-600 hover:underline">
                          Update
                        </Link>
                      )}
                      {status === "MISSING" && (
                        <button
                          onClick={() => handleOpenCreateModal(item.id)}
                          className="text-blue-600 hover:underline focus:outline-none"
                        >
                          Create
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* page selector */}
        <div className="relative">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {pageCount.map((pg) => (
              <option key={pg.value} value={pg.value}>{pg.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-2 text-gray-500 pointer-events-none" />
        </div>

        {/* page numbers */}
        <div className="flex items-center gap-1 text-xs border border-gray-200 rounded-lg overflow-hidden bg-white">
          <button
            onClick={() => setCurrentPage((prv) => Math.max(prv - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed border-r border-gray-200"
          >
            Previous
          </button>

          {pageNumber.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1.5 font-medium transition-colors border-r border-gray-200 ${currentPage === page
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {page}
            </button>
          ))}

          <span className="px-2 py-1.5 text-gray-400">...</span>

          <button
            onClick={() => setCurrentPage(99)}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 border-r border-gray-200"
          >
            99
          </button>

          <button
            onClick={() => setCurrentPage((nxt) => Math.min(nxt + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* modal integration */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTaskFromTable}
        initialData={null}
      />
    </div>
  );
};

export default TimesheetTable;
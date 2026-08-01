"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { TimesheetDetail, TaskEntry } from "../types";
import TaskModal from "./TaskModal";

interface Props {
  initialData: TimesheetDetail;
};

const TimesheetDetailView = ({ initialData }: Props) => {
  const [data, setData] = useState<TimesheetDetail>(initialData);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [editingTask, setEditingTask] = useState<TaskEntry | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // total logged hour
  const totalLoggedHours = useMemo(() => {
    return data.days.reduce((acc, day) => {
      return acc + day.tasks.reduce((tAcc, task) => tAcc + task.hours, 0);
    }, 0);
  }, [data]);

  // hour perncentage
  const percentage = Math.min(Math.round((totalLoggedHours / 40) * 100), 100);

  // add modal
  const handleOpenAddModal = (date: string) => {
    setSelectedDate(date);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // edit Modal
  const handleOpenEditModal = (task: TaskEntry) => {
    setEditingTask(task);
    setSelectedDate(task.date);
    setOpenMenuId(null);
    setIsModalOpen(true);
  };

  // save task handler (for both Add & Edit)
  const handleSaveTask = (taskData: Omit<TaskEntry, "id"> & { id?: string }) => {
    setData((prev) => {
      const newDays = prev.days.map((day) => {
        if (day.date === (taskData.date || selectedDate)) {
          if (taskData.id) {
            // Update Existing Task
            return {
              ...day,
              tasks: day.tasks.map((t) =>
                t.id === taskData.id ? { ...t, ...taskData } : t
              ),
            };
          } else {
            // Create New Task
            const newTask: TaskEntry = {
              id: `task-${Date.now()}`,
              title: taskData.title,
              hours: taskData.hours,
              projectName: taskData.projectName,
              date: day.date,
            };
            return { ...day, tasks: [...day.tasks, newTask] };
          }
        }
        return day;
      });

      return { ...prev, days: newDays };
    });
  };

  // delete handler
  const handleDeleteTask = (dayIndex: number, taskId: string) => {
    setData((prev) => {
      const newDays = [...prev.days];
      newDays[dayIndex] = {
        ...newDays[dayIndex],
        tasks: newDays[dayIndex].tasks.filter((t) => t.id !== taskId),
      };
      return { ...prev, days: newDays };
    });
    setOpenMenuId(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            This week's timesheet
          </h1>
          <p className="text-sm text-gray-400 mt-1">{data.dateRange}</p>
        </div>

        <div className="flex flex-col items-end gap-1.5 min-w-[200px]">
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
            <span>{totalLoggedHours}/40 hrs</span>
            <span className="text-gray-400 font-normal">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#f97316] h-full rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {data.days.map((day, dayIdx) => (
          <div key={day.date} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-2 pt-2">
              <span className="text-sm font-bold text-gray-900">{day.displayDate}</span>
            </div>

            <div className="md:col-span-10 space-y-2.5">
              {day.tasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative flex items-center justify-between bg-white border border-gray-200/80 rounded-lg px-4 py-3 hover:border-gray-300 transition-all shadow-2xs"
                >
                  <span className="text-sm font-medium text-gray-800">{task.title}</span>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 font-normal">{task.hours} hrs</span>
                    <span className="px-2.5 py-0.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-md">
                      {task.projectName}
                    </span>

                    <div className="relative" ref={openMenuId === task.id ? menuRef : null}>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === task.id ? null : task.id)
                        }
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>

                      {openMenuId === task.id && (
                        <div className="absolute right-0 top-7 w-28 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30">
                          <button
                            onClick={() => handleOpenEditModal(task)}
                            className="w-full text-left px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(dayIdx, task.id)}
                            className="w-full text-left px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleOpenAddModal(day.date)}
                className="w-full border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-lg py-2.5 px-4 text-xs font-medium text-gray-500 hover:bg-gray-50/50 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add new task</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* task modal (add & update) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default TimesheetDetailView;
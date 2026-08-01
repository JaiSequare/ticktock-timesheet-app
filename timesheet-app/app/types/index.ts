
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface FormErrors {
  email?: string;
  password?: string;
}

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<TaskEntry, "id"> & { id?: string }) => void;
  initialData?: TaskEntry | null;
  selectedDate?: string;
}

export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  dateRangeLabel: string;
  totalHours: number;
}

export type SortField = "weekNumber" | "startDate" | "status";
export type SortOrder = "asc" | "desc";

export interface TaskEntry {
  id: string;
  title: string;
  hours: number;
  projectName: string;
  date: string;
}

export interface DayGroup {
  date: string;
  displayDate: string;
  tasks: TaskEntry[];
}

export interface TaskFormValues {
  project: string;
  workType: string;
  description: string;
  hours: number;
}

export interface FormErrors {
  project?: string;
  workType?: string;
  description?: string;
  hours?: string;
}

export interface TimesheetDetail {
  id: string;
  dateRange: string;
  days: DayGroup[];
}

export interface User {
  id: string,
  name: string,
  email: string,
  role: string,
}

export interface TimesheetEntry {
  id: string,
  timesheetId: string,
  date: string,
  project: string,
  task: string,
  hours: number,
}

// Helper function to dynamically calculate status based on total hours
export function getTimesheetStatus(totalHours: number): TimesheetStatus {
  if (totalHours >= 40) return "COMPLETED";
  if (totalHours > 0 && totalHours < 40) return "INCOMPLETE";
  return "MISSING";
}
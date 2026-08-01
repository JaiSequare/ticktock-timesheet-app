import { TimesheetEntry, TaskFormValues, LoginFormValues, TimesheetDetail, Timesheet } from "@/app/types";

export const mockEntries: TimesheetEntry[] = [
  {
    id: "e1",
    timesheetId: "ts-w1",
    date: "2026-07-06",
    project: "Project Alpha",
    task: "API Development",
    hours: 8,
  },
  {
    id: "e2",
    timesheetId: "ts-w1",
    date: "2026-07-07",
    project: "Project Alpha",
    task: "Frontend Setup",
    hours: 8,
  },
];

export const PROJECT_OPTIONS = [
  "Project Alpha",
  "Project Name",
  "E-Commerce Redesign",
  "Mobile App Development",
  "Internal Dashboard",
];

export const WORK_TYPE_OPTIONS = [
  "Bug fixes",
  "Development",
  "Testing & QA",
  "Deployment",
  "DevOps & Infrastructure",
  "UI/UX Design",
  "Code Review",
];

export const INITIAL_FORM_STATE: TaskFormValues = {
  project: "",
  workType: "",
  description: "",
  hours: 12,
};

export const INITIAL_LOGIN_FORM_STATE: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

// using static data for UI only
export const mockTimesheetDetails: Record<string, TimesheetDetail> = {
  "ts-1": {
    id: "ts-1",
    dateRange: "21 - 26 January, 2024",
    days: [
      {
        date: "2024-01-21",
        displayDate: "Jan 21",
        tasks: [
          { id: "t1", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-21" },
          { id: "t2", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-21" },
        ],
      },
      {
        date: "2024-01-22",
        displayDate: "Jan 22",
        tasks: [
          { id: "t3", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-22" },
          { id: "t4", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-22" },
          { id: "t5", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-22" },
        ],
      },
      {
        date: "2024-01-23",
        displayDate: "Jan 23",
        tasks: [
          { id: "t6", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-23" },
          { id: "t7", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-23" },
          { id: "t8", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-23" },
        ],
      },
      {
        date: "2024-01-24",
        displayDate: "Jan 24",
        tasks: [
          { id: "t9", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-24" },
          { id: "t10", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-24" },
          { id: "t11", title: "Homepage Development", hours: 4, projectName: "Project Name", date: "2024-01-24" },
        ],
      },
      {
        date: "2024-01-25",
        displayDate: "Jan 25",
        tasks: [], // Empty day here
      },
    ],
  },
};

export const mockTimesheets: Timesheet[] = [
  {
    id: "ts-1",
    weekNumber: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    dateRangeLabel: "1 - 5 January, 2024",
    totalHours: 40,
  },
  {
    id: "ts-2",
    weekNumber: 2,
    startDate: "2024-01-08",
    endDate: "2024-01-12",
    dateRangeLabel: "8 - 12 January, 2024",
    totalHours: 40,
  },
  {
    id: "ts-3",
    weekNumber: 3,
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    dateRangeLabel: "15 - 19 January, 2024",
    totalHours: 24,
  },
  {
    id: "ts-4",
    weekNumber: 4,
    startDate: "2024-01-22",
    endDate: "2024-01-26",
    dateRangeLabel: "22 - 26 January, 2024",
    totalHours: 40,
  },
  {
    id: "ts-5",
    weekNumber: 5,
    startDate: "2024-01-28",
    endDate: "2024-02-01",
    dateRangeLabel: "28 January - 1 February, 2024",
    totalHours: 0,
  },
  {
    id: "ts-6",
    weekNumber: 6,
    startDate: "2024-02-05",
    endDate: "2024-02-09",
    dateRangeLabel: "5 - 9 February, 2024",
    totalHours: 40,
  },
  {
    id: "ts-7",
    weekNumber: 7,
    startDate: "2024-02-12",
    endDate: "2024-02-16",
    dateRangeLabel: "12 - 16 February, 2024",
    totalHours: 16,
  },
];

// for pagination
export const pageNumber = [1, 2, 3, 4, 5, 6, 7, 8];
export const pageCount = [
  { name: '5 per page', value: 5 },
  { name: '10 per page', value: 10 },
  { name: '25 per page', value: 25 },
];
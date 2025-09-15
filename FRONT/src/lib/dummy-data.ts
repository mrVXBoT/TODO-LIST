
import type { Task, NoteTopic } from "./types";

export const DUMMY_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Finalize Q3 report",
    description: "Compile all team reports and create the final presentation slides for the quarterly review meeting.",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: "high",
    isCompleted: false,
  },
  {
    id: "task-2",
    title: "Design new landing page",
    description: "Create mockups and wireframes for the new marketing campaign's landing page.",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    priority: "high",
    isCompleted: false,
  },
  {
    id: "task-3",
    title: "Schedule team offsite",
    description: "Coordinate with vendors and team members to finalize a date and location for the annual team offsite.",
    priority: "medium",
    isCompleted: false,
  },
  {
    id: "task-4",
    title: "Update project documentation",
    description: "Review and update the project wiki with the latest changes and API documentation.",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    priority: "low",
    isCompleted: true,
  },
  {
    id: "task-5",
    title: "Book dentist appointment",
    description: "Annual check-up.",
    priority: "low",
    isCompleted: false,
  },
  {
    id: "task-6",
    title: "Pay electricity bill",
    description: "Due by the end of the week.",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    priority: "medium",
    isCompleted: false,
  },
];

export const DUMMY_NOTES: NoteTopic[] = [
  {
    id: 'note-topic-1',
    topic: 'Q3 Marketing Ideas',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    entries: [
      {
        id: 'entry-1-1',
        content: 'Collaborate with influencers for the new product launch.',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
      },
      {
        id: 'entry-1-2',
        content: 'Run a social media contest with giveaways to boost engagement.',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
      {
        id: 'entry-1-3',
        content: 'Start a weekly newsletter with product tips and industry news.',
        createdAt: new Date(),
      },
    ],
  },
  {
    id: 'note-topic-2',
    topic: 'App Development Roadmap',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 14)),
    entries: [
      {
        id: 'entry-2-1',
        content: 'Feature: Implement dark mode. Users have been asking for it.',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
      },
      {
        id: 'entry-2-2',
        content: 'Refactor the authentication flow to improve security and user experience.',
        createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
      },
    ],
  },
  {
    id: 'note-topic-3',
    topic: 'Personal Goals',
    createdAt: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    entries: [
      {
        id: 'entry-3-1',
        content: 'Read 12 books this year. Currently on book #7.',
        createdAt: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    ],
  },
];

    
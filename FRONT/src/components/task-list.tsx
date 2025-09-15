"use client";

import * as React from "react";
import type { Task } from "@/lib/types";
import { TaskItem } from "./task-item";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask, onToggleComplete }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
          onToggleComplete={(isCompleted) => onToggleComplete(task.id, isCompleted)}
        />
      ))}
    </div>
  );
};

export default TaskList;

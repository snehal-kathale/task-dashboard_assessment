import React, { memo } from "react";
import { Task, TaskStatus } from "../types/task";
import TaskStatusSelect from "./TaskStatusSelect";
import styles from "./TaskCard.module.css";

type Props = {
  task: Task;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onStatusUpdate: (taskId: string, newStatus: TaskStatus) => void;
  searchTerm: string;
};

// Utility: wrap matched text in a <mark> for highlighting
const highlight = (text: string, term: string): React.ReactNode => {
  if (!term.trim()) return text;
  const regex = new RegExp(
    `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className={styles.highlight}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

// Wrapped component with React.memo to prevent unnecessary re-renders
// Now TaskCard only re-renders when its props actually change
const TaskCard = ({
  task,
  isSelected,
  onSelect,
  onStatusUpdate,
  searchTerm,
}: Props) => {
  const priorityClass = styles[`priority_${task.priority}`];
  const statusClass = styles[`status_${task.status.replace("-", "_")}`];

  return (
    <li
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={() => onSelect(task.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(task.id);
      }}
      aria-expanded={isSelected}
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={`${styles.priorityBadge} ${priorityClass}`}>
            {task.priority}
          </span>
          <span className={`${styles.statusBadge} ${statusClass}`}>
            {task.status}
          </span>
        </div>

        <span
          className={styles.assignee}
          title={`Assigned to ${task.assignee}`}
        >
          {task.assignee[0].toUpperCase()}
        </span>
      </div>

      <h3 className={styles.cardTitle}>{highlight(task.title, searchTerm)}</h3>

      {isSelected && (
        <div className={styles.expanded}>
          <p className={styles.description}>
            {highlight(task.description, searchTerm)}
          </p>

          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            <TaskStatusSelect
              taskId={task.id}
              currentStatus={task.status}
              onStatusUpdate={onStatusUpdate}
            />
          </div>

          <time className={styles.date} dateTime={task.createdAt}>
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </time>
        </div>
      )}
    </li>
  );
};

// Exporting memoized component to avoid re-rendering all items on every parent update
export default memo(TaskCard);

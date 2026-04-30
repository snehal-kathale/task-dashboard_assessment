import { useMemo } from "react";
import { Task, TaskStatus } from "../types/task";
import styles from "./TaskStats.module.css";

type Props = {
  tasks: Task[];
  statusFilter: TaskStatus | "all";
  onStatusFilterChange: (status: TaskStatus | "all") => void;
};

// Converted class component to functional component for modern React usage
const TaskStats = ({ tasks, statusFilter, onStatusFilterChange }: Props) => {
  // Fixed performance issue:
  // Previously, counts were recalculated on every render.
  // Now using useMemo so calculation runs only when tasks change.
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      "in-progress": tasks.filter((t) => t.status === "in-progress").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  }, [tasks]);

  // Static filter configuration kept outside of render logic for clarity
  const filters: Array<{ value: TaskStatus | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className={styles.stats}>
      {filters.map((f) => (
        <button
          key={f.value}
          className={`${styles.statCard} ${statusFilter === f.value ? styles.active : ""}`}
          onClick={() => onStatusFilterChange(f.value)}
          aria-pressed={statusFilter === f.value}
        >
          {/* Uses memoized counts instead of recalculating */}
          <span className={styles.statCount}>{counts[f.value]}</span>
          <span className={styles.statLabel}>{f.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TaskStats;

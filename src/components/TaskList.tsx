import { useMemo, useState, useEffect } from "react";
import { Task, TaskStatus } from "../types/task";
import TaskCard from "./TaskCard";
import styles from "./TaskList.module.css";
import Pagination from "./Pagination";

type Props = {
  tasks: Task[];
  selectedTaskId: string | null;
  onSelectTask: (id: string) => void;
  onStatusUpdate: (taskId: string, newStatus: TaskStatus) => void;
  searchTerm: string;
};

const PAGE_SIZE = 25;

const TaskList = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  onStatusUpdate,
  searchTerm,
}: Props) => {
  // Added pagination state to avoid rendering all tasks at once
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when tasks change (e.g. filter/search applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [tasks]);

  // Compute only the tasks needed for the current page
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return tasks.slice(start, start + PAGE_SIZE);
  }, [tasks, currentPage]);

  // Total pages calculation for navigation
  const totalPages = Math.ceil(tasks.length / PAGE_SIZE);

  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No tasks match your current filters.</p>
      </div>
    );
  }

  return (
    <>
      <ul className={styles.list} role="list">
        {/* Only rendering a subset of tasks instead of all 500 */}
        {paginatedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isSelected={selectedTaskId === task.id}
            onSelect={onSelectTask}
            onStatusUpdate={onStatusUpdate}
            searchTerm={searchTerm}
          />
        ))}
      </ul>

      {/* Added pagination controls for navigation */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      />
    </>
  );
};

export default TaskList;

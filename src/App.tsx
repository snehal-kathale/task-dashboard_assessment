import { useEffect, useMemo, useState, useCallback } from "react";
import { fetchTasks, updateTaskStatus } from "./api/tasks";
import { Task, TaskStatus } from "./types/task";
import TaskList from "./components/TaskList";
import TaskStats from "./components/TaskStats";
import AddTaskForm from "./components/AddTaskForm";
import styles from "./App.module.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // FIX: proper async handling + cleanup
  useEffect(() => {
    let isMounted = true;

    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTasks();
        if (isMounted) {
          setTasks(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load tasks");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      isMounted = false; // prevents memory leak
    };
  }, []);

  // FIX: remove duplicated state + useMemo
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, statusFilter]);

  //  FIX: stable callbacks (important for performance)
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    [],
  );

  const handleStatusFilterChange = useCallback((status: TaskStatus | "all") => {
    setStatusFilter(status);
  }, []);

  //  BONUS: Optimistic update + error handling
  const handleStatusUpdate = useCallback(
    async (taskId: string, newStatus: TaskStatus) => {
      const previousTasks = [...tasks];

      // optimistic update
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      );

      try {
        await updateTaskStatus(taskId, newStatus);
      } catch {
        // rollback
        setTasks(previousTasks);
        alert("Failed to update task status");
      }
    },
    [tasks],
  );

  const handleTaskAdded = useCallback((task: Task) => {
    setTasks((prev) => [task, ...prev]);
    setShowAddForm(false);
  }, []);

  const handleSelectTask = useCallback((id: string) => {
    setSelectedTaskId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>Task Dashboard</h1>
        <button
          className={styles.addButton}
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? "Cancel" : "+ Add Task"}{" "}
        </button>
      </header>
      <main className={styles.main}>
        <TaskStats
          tasks={tasks}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
        />

        {showAddForm && <AddTaskForm onTaskAdded={handleTaskAdded} />}

        <div className={styles.toolbar}>
          <input
            type="search"
            placeholder="Search tasks by title or description…"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            aria-label="Search tasks"
          />
          <span className={styles.resultCount}>
            {filteredTasks.length} of {tasks.length} tasks
          </span>
        </div>

        {loading && <div className={styles.loading}>Loading tasks…</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <TaskList
            tasks={filteredTasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={handleSelectTask}
            onStatusUpdate={handleStatusUpdate}
            searchTerm={searchTerm}
          />
        )}
      </main>
    </div>
  );
}

export default App;

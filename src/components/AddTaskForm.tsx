import { useState } from "react";
import { createTask } from "../api/tasks";
import { Task, TaskPriority, TaskStatus } from "../types/task";
import styles from "./AddTaskForm.module.css";

type Props = {
  onTaskAdded: (task: Task) => void;
};

const ASSIGNEES = ["Alice", "Bob", "Carol", "David", "Eve"];

const AddTaskForm = ({ onTaskAdded }: Props) => {
  // Using a single state object instead of multiple useState calls
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    assignee: ASSIGNEES[0],
  });

  // Added loading and error state for better async handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic handler to update form state
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions while request is in progress
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const newTask = await createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: "todo" as TaskStatus,
        assignee: formData.assignee,
      });

      onTaskAdded(newTask);

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        assignee: ASSIGNEES[0],
      });
    } catch {
      // Show error if API fails
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>New Task</h2>

      {/* Display error message if present */}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.field}>
        <label htmlFor="task-title" className={styles.label}>
          Title *
        </label>
        <input
          id="task-title"
          type="text"
          className={styles.input}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
          minLength={3}
          placeholder="What needs to be done?"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="task-description" className={styles.label}>
          Description
        </label>
        <textarea
          id="task-description"
          className={styles.textarea}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          placeholder="Add more detail…"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="task-priority" className={styles.label}>
            Priority
          </label>
          <select
            id="task-priority"
            className={styles.select}
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="task-assignee" className={styles.label}>
            Assignee
          </label>
          <select
            id="task-assignee"
            className={styles.select}
            value={formData.assignee}
            onChange={(e) => handleChange("assignee", e.target.value)}
          >
            {ASSIGNEES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        {/* Button disabled during loading to prevent double submit */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;

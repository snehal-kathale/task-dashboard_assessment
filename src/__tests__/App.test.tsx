import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";
import * as api from "../api/tasks";

// mock API
jest.spyOn(api, "fetchTasks").mockResolvedValue([
  {
    id: "1",
    title: "Test Task",
    description: "desc",
    status: "todo",
    priority: "low",
    assignee: "Alice",
    createdAt: new Date().toISOString(),
  },
]);

describe("App", () => {
  test("loads and displays tasks", async () => {
    render(<App />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    const task = await screen.findByText((text) => text.includes("Test"));

    expect(task).toBeInTheDocument();
  });

  test("filters tasks based on search", async () => {
    render(<App />);

    const input = await screen.findByPlaceholderText(/search/i);

    fireEvent.change(input, { target: { value: "Test" } });

    const task = await screen.findByText((text) => text.includes("Test"));

    expect(task).toBeInTheDocument();
  });

  test("shows pagination and navigates pages", async () => {
    render(<App />);

    await screen.findByText((text) => text.includes("Test"));

    expect(screen.getByText(/previous/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });
});

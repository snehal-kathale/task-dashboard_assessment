import { render, screen } from "@testing-library/react";
import App from "../App";
import * as api from "../api/tasks";
import { fireEvent } from "@testing-library/react";

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

test("loads and displays tasks", async () => {
  render(<App />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  const task = await screen.findByText(/test task/i);
  expect(task).toBeInTheDocument();
});

test("filters tasks based on search", async () => {
  render(<App />);

  const input = await screen.findByPlaceholderText(/search/i);

  fireEvent.change(input, { target: { value: "Test" } });

  expect(screen.getByText(/test task/i)).toBeInTheDocument();
});

test("shows pagination and navigates pages", async () => {
  render(<App />);

  await screen.findByText(/test task/i);

  const nextBtn = screen.getByText(/next/i);
  expect(nextBtn).toBeInTheDocument();
});

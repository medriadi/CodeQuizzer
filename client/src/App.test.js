import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./components/Home";
import QuizList from "./components/QuizList";
import QuizPage from "./components/QuizPage";
import axiosInstance from "./axiosInstance";
import { AuthContext } from "./context/AuthContext";

jest.mock("./axiosInstance", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
  requestMessage: (_error, fallback) => fallback,
}));
beforeEach(() => jest.clearAllMocks());
const renderPage = (page) => render(<MemoryRouter>{page}</MemoryRouter>);

test("home practice question gives feedback and allows another attempt", () => {
  renderPage(<Home />);
  expect(
    screen.getByRole("heading", { name: /Good code starts/i }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "A [1, 3]" }));
  expect(screen.getByText(/Almost! Even numbers/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "B [2, 4]" }));
  expect(screen.getByText(/Nailed it!/)).toBeInTheDocument();
});

test("library combines search, topic and level filters and resets an empty search", async () => {
  axiosInstance.get.mockResolvedValue({
    data: [
      {
        _id: "js",
        title: "JavaScript Basics",
        category: "JavaScript",
        difficulty: "Easy",
        questionCount: 10,
      },
      {
        _id: "py",
        title: "Python Classes",
        category: "Python",
        difficulty: "Medium",
        questionCount: 8,
      },
    ],
  });
  renderPage(<QuizList />);
  await screen.findByRole("heading", { name: "JavaScript Basics" });
  fireEvent.click(screen.getByRole("button", { name: "Python" }));
  expect(
    screen.queryByRole("heading", { name: "JavaScript Basics" }),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Difficulty"), {
    target: { value: "Easy" },
  });
  expect(screen.getByText("No matches just yet.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "Classes" },
  });
  expect(
    screen.getByRole("heading", { name: "Python Classes" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "JavaScript Basics" }),
  ).not.toBeInTheDocument();
});

test("quiz returns to unanswered questions and submits exactly one answer per question", async () => {
  axiosInstance.get.mockResolvedValue({
    data: {
      title: "Arrays",
      questions: [
        { _id: "q1", questionText: "First question", options: ["One", "Two"] },
        {
          _id: "q2",
          questionText: "Second question",
          options: ["Three", "Four"],
        },
      ],
    },
  });
  axiosInstance.post.mockResolvedValue({
    data: { score: 2, total: 2, results: [] },
  });
  window.scrollTo = jest.fn();
  renderPage(<QuizPage />);
  await screen.findByText("First question");
  fireEvent.click(screen.getByRole("button", { name: "Next question →" }));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Three"));
  fireEvent.click(screen.getByRole("button", { name: "Finish challenge ✓" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "A question needs your attention",
  );
  expect(axiosInstance.post).not.toHaveBeenCalled();
  fireEvent.click(screen.getByLabelText("One"));
  fireEvent.click(screen.getByRole("button", { name: "Next question →" }));
  expect(screen.getByLabelText("Three")).toBeChecked();
  fireEvent.click(screen.getByRole("button", { name: "Finish challenge ✓" }));
  await screen.findByText("100%");
  expect(axiosInstance.post).toHaveBeenCalledWith(
    expect.stringContaining("/submit"),
    {
      submissionId: expect.any(String),
      answers: [
        { questionId: "q1", selectedOption: "One" },
        { questionId: "q2", selectedOption: "Three" },
      ],
    },
  );
});

test("choosing Java does not include JavaScript challenges", async () => {
  axiosInstance.get.mockResolvedValue({
    data: [
      {
        _id: "java",
        title: "Java Fundamentals",
        category: "Java",
        difficulty: "Beginner",
        questionCount: 10,
      },
      {
        _id: "js",
        title: "JavaScript Basics",
        category: "JavaScript",
        difficulty: "Beginner",
        questionCount: 10,
      },
    ],
  });
  renderPage(<QuizList />);
  await screen.findByRole("heading", { name: "Java Fundamentals" });
  fireEvent.click(screen.getByRole("button", { name: "Java", exact: true }));
  expect(
    screen.getByRole("heading", { name: "Java Fundamentals" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "JavaScript Basics" }),
  ).not.toBeInTheDocument();
});

test("a quiz draft restores answers and question position after a refresh", async () => {
  sessionStorage.clear();
  axiosInstance.get.mockResolvedValue({
    data: {
      title: "Draft challenge",
      questions: [
        {
          _id: "q1",
          questionText: "Saved first question",
          options: ["One", "Two"],
        },
        {
          _id: "q2",
          questionText: "Saved second question",
          options: ["Three", "Four"],
        },
      ],
    },
  });
  const content = (
    <AuthContext.Provider value={{ auth: { user: { _id: "draft-user" } } }}>
      <QuizPage />
    </AuthContext.Provider>
  );
  const first = renderPage(content);
  await screen.findByText("Saved first question");
  fireEvent.click(screen.getByLabelText("One"));
  fireEvent.click(screen.getByRole("button", { name: "Next question →" }));
  first.unmount();
  renderPage(content);
  await screen.findByText("Saved second question");
  fireEvent.click(screen.getByRole("button", { name: "← Previous" }));
  expect(screen.getByLabelText("One")).toBeChecked();
  sessionStorage.clear();
});

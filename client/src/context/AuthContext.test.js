import React, { useContext } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import AuthProvider, { AuthContext } from "./AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import axiosInstance, { setAuthToken } from "../axiosInstance";

jest.mock("../axiosInstance", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
  setAuthToken: jest.fn(),
  requestMessage: (_error, fallback) => fallback,
}));
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
function LoginProbe() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <button
      onClick={() =>
        login("tester@example.com", "test-password").then(() =>
          navigate("/quizzes"),
        )
      }
    >
      Log in
    </button>
  );
}
const mount = () =>
  render(
    <MemoryRouter initialEntries={["/quizzes"]}>
      <AuthProvider>
        <LoginProbe />
        <Routes>
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <p>Protected content</p>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<p>Sign-in page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );

test("a temporary backend failure preserves the session and allows retry", async () => {
  localStorage.setItem("token", "existing-session");
  axiosInstance.get
    .mockRejectedValueOnce({ response: { status: 503 } })
    .mockResolvedValueOnce({ data: { _id: "user", username: "Tester" } });
  mount();
  await screen.findByRole("button", { name: "Try again" });
  expect(localStorage.getItem("token")).toBe("existing-session");
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  await screen.findByText("Protected content");
  expect(axiosInstance.get).toHaveBeenCalledTimes(2);
});

test("an invalid session is removed instead of retaining a broken token", async () => {
  localStorage.setItem("token", "expired-session");
  axiosInstance.get.mockRejectedValueOnce({ response: { status: 401 } });
  mount();
  await waitFor(() => expect(localStorage.getItem("token")).toBeNull());
  expect(setAuthToken).toHaveBeenLastCalledWith(null);
  expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
});

test("sign in loads the account once and then unlocks protected content", async () => {
  axiosInstance.post.mockResolvedValueOnce({ data: { token: "new-session" } });
  axiosInstance.get.mockResolvedValueOnce({
    data: { _id: "user", username: "Tester" },
  });
  mount();
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  await screen.findByText("Protected content");
  expect(axiosInstance.get).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem("token")).toBe("new-session");
});

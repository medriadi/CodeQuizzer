import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosInstance, { requestMessage, setAuthToken } from "../axiosInstance";

export const AuthContext = createContext(null);
const signedOut = {
  token: null,
  isAuthenticated: false,
  loading: false,
  user: null,
  error: "",
};
const readToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};
const storeToken = (token) => {
  try {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  } catch {
    /* The current session still works when browser storage is unavailable. */
  }
};

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = readToken();
    setAuthToken(token);
    return { ...signedOut, token, loading: Boolean(token) };
  });
  const [retry, setRetry] = useState(0);
  const logout = useCallback(() => {
    storeToken(null);
    setAuthToken(null);
    setAuth(signedOut);
  }, []);
  const startSession = useCallback((token) => {
    storeToken(token);
    setAuthToken(token);
    setAuth({ ...signedOut, token, loading: true });
  }, []);
  const retrySession = useCallback(() => setRetry((value) => value + 1), []);
  useEffect(() => {
    window.addEventListener("codequizzer:unauthorized", logout);
    const syncSession = (event) => {
      if (event.key === "token") {
        if (event.newValue) startSession(event.newValue);
        else logout();
      }
    };
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("codequizzer:unauthorized", logout);
      window.removeEventListener("storage", syncSession);
    };
  }, [logout, startSession]);
  useEffect(() => {
    if (!auth.token || auth.user) return;
    let active = true;
    setAuth((previous) => ({ ...previous, loading: true, error: "" }));
    axiosInstance
      .get("/api/auth/user")
      .then(({ data }) => {
        if (active)
          setAuth((previous) => ({
            ...previous,
            user: data,
            isAuthenticated: true,
            loading: false,
            error: "",
          }));
      })
      .catch((error) => {
        if (!active) return;
        if ([401, 404].includes(error.response?.status)) logout();
        else
          setAuth((previous) => ({
            ...previous,
            loading: false,
            error: requestMessage(
              error,
              "We couldn’t check your session. Please try again.",
            ),
          }));
      });
    return () => {
      active = false;
    };
  }, [auth.token, auth.user, retry, logout]);
  const login = useCallback(
    async (email, password) => {
      const { data } = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });
      startSession(data.token);
    },
    [startSession],
  );
  const value = useMemo(
    () => ({ auth, login, logout, startSession, retrySession, setAuth }),
    [auth, login, logout, startSession, retrySession],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

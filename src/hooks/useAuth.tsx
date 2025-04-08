import axios from "axios";
import { useContext, useEffect, useState, createContext } from "react";

interface User {
  email: string;
  id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  setTokens: (newAccessToken: string, newRefreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, _setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          refreshToken &&
          originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            const response = await axios.post(
              "http://localhost:3000/auth/refresh",
              { refreshToken },
              { withCredentials: true }
            );
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = response.data;

            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.log("Token refresh failed:", refreshError);
            await logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        const storedUser = localStorage.getItem("user");

        if (storedAccessToken && storedRefreshToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);

          const response = await axios.get(
            "http://localhost:3000/auth/status",
            {
              headers: {
                Authorization: `Bearer ${storedAccessToken}`,
              },
            }
          );

          console.log("Initial auth check response:", response.data);

          if (response.data.isAuthenticated) {
            console.log("Setting initial user state with:", response.data.user);
            setUser(response.data.user);
          } else {
            console.log("Initial auth check: user not authenticated");
            setAccessToken(null);
            setRefreshToken(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
          }
        } else if (storedUser) {
          // If we have user data stored directly
          try {
            const userData = JSON.parse(storedUser);
            console.log("Found user data in localStorage:", userData);
            setUser(userData);
          } catch (e) {
            console.error("Failed to parse stored user data", e);
            localStorage.removeItem("user");
          }
        } else {
          console.log(
            "No stored tokens or user data found during initial auth check"
          );
        }
      } catch (error) {
        console.log("Auth check failed", error);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);
  const logout = async (): Promise<void> => {
    try {
      if (refreshToken) {
        await axios.post(
          "http://localhost:3000/auth/logout",
          { refreshToken },
          { withCredentials: true }
        );
      }
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    }
  };

  const getAccessToken = (): string | null => {
    return accessToken;
  };

  const setTokens = async (newAccessToken: string, newRefreshToken: string) => {
    console.log("Setting tokens in auth context");
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    // Fetch user data after setting tokens
    try {
      console.log("Fetching user data with access token");
      const response = await axios.get("http://localhost:3000/auth/status", {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      console.log("Auth status response:", response.data);

      if (response.data.isAuthenticated) {
        console.log("Setting user state with:", response.data.user);
        setUser(response.data.user);
      } else {
        console.log("User not authenticated according to status endpoint");
      }
    } catch (error) {
      console.error("Failed to fetch user data after setting tokens", error);
    }
  };

  const setUser = (userData: User | null) => {
    _setUser(userData);
    // Dispatch a custom event when user state changes
    window.dispatchEvent(
      new CustomEvent("auth-state-changed", {
        detail: { user: userData },
      })
    );
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, getAccessToken, setTokens }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

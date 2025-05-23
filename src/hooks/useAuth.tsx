import axios from "axios";
import { useContext, useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  id: string;
  role: "user" | "seller" | "admin";
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const response = await axios.post(
              "http://localhost:3000/api/auth/refresh-token",
              {},
              { withCredentials: true }
            );

            if (response.status === 200) {
              await checkAuthStatus();
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            await logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const refreshToken = async () => {
    try{
      const response = await axios.post('http://localhost:3000/api/auth/refresh-token', {} , {withCredentials: true})
      console.log("Tokens refreshed", response.data)
      if(response.status === 200){
        await checkAuthStatus()
      }
    } catch (error){
      console.log('Token refresh error',error)
      await logout()
    }
  }

  useEffect( ()=> {
    let interval = null;

    if (user){
      interval = setInterval (() => {
       refreshToken() 
      }, 55 * 60 * 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [user])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/status",
        {
          withCredentials: true,
        }
      );

      if (response.data.isAuthenticated) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const refreshAuthStatus = async () => {
    await checkAuthStatus();
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", null, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshAuthStatus }}>
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

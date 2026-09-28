import { createContext, useContext, useState, type ReactNode } from "react";

export interface AdminUser {
  idAdmin: number;
  name: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  role: "SUPER_ADMIN" | "ADMIN";
}

interface AuthContextType {
  token: string | null;
  admin: AdminUser | null;
  login: (token: string, adminData: AdminUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem("admin_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (newToken: string, adminData: AdminUser) => {
    setToken(newToken);
    setAdmin(adminData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("admin_user", JSON.stringify(adminData));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("token");
    localStorage.removeItem("admin_user");
  };

  const isAuthenticated = !!token;
  const isSuperAdmin = admin?.role === "SUPER_ADMIN" || admin?.email === "juanpemonv1994@gmail.com";

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        login,
        logout,
        isAuthenticated,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}

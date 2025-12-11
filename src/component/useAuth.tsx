"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication on client side only
    if (typeof window === "undefined") {
      return;
    }

    const checkAuth = () => {
      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        // Redirect to login page
        router.replace("/admin-login");
        return;
      }

      // Token exists - user is authenticated
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/admin-login");
  };

  return { isAuthenticated, isLoading, logout };
}


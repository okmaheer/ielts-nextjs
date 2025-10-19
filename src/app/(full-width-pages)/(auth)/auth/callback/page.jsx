"use client";
import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const hasProcessed = useRef(false); // ← Prevent multiple calls

  useEffect(() => {
    // Only run once
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      console.error("Authentication error:", error);
      router.push("/signin?error=" + error);
      return;
    }

    if (token && userParam) {
      try {
        const userData = JSON.parse(userParam);
        
        // Use the login function from AuthContext
        login(token, userData);
        
        // Redirect to dashboard
        router.push("/");
      } catch (err) {
        console.error("Error parsing user data:", err);
        router.push("/signin?error=invalid_data");
      }
    } else {
      router.push("/signin");
    }
  }, []); // ← Empty dependency array (run once)

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
}
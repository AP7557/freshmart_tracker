"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export function withAuth(Component, allowedRoles = []) {
  return function AuthenticatedComponent(props) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }

      if (
        !loading &&
        user &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
      ) {
        router.push("/addTransactions");
      }
    }, [user, loading, router]);

    if (loading || !user)
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      );
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return null;
    }

    return <Component {...props} user={user} />;
  };
}

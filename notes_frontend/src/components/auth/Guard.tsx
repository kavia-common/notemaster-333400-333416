"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

/**
 * PUBLIC_INTERFACE
 * Guard redirects to /login when not authenticated.
 */
export function Guard({
  children,
  redirectTo = "/login",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    if (!t) router.replace(redirectTo);
  }, [router, redirectTo]);

  return <>{children}</>;
}

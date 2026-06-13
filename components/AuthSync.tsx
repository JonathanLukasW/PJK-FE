"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/stores/app-store";

export function AuthSync() {
  const { data: session } = useSession();
  const setAuthUser = useAppStore((s) => s.setAuthUser);

  useEffect(() => {
    if (session?.user) {
      setAuthUser({
        name: session.user.name ?? null,
        email: session.user.email ?? null,
        image: session.user.image ?? null,
      });
    } else {
      setAuthUser(null);
    }
  }, [session, setAuthUser]);

  return null;
}

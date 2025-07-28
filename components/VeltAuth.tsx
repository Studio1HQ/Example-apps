"use client";

import { useVeltClient } from "@veltdev/react";
import { useEffect } from "react";
import { useUserStore } from "@/helper/userdb";

export default function VeltAuth({ children }: { children: React.ReactNode }) {
  const { client } = useVeltClient();
  const { user } = useUserStore();

  useEffect(() => {
    if (!client || !user) return;

    // Identify the user with Velt
    const veltUser = {
      userId: user.uid,
      name: user.displayName,
      email: user.email,
      photoUrl: user.photoUrl,
      organizationId: "inventory-org-001", // Single organization for this app
    };

    // Authenticate the user with Velt
    client.identify(veltUser);
  }, [client, user]);

  return <>{children}</>;
}

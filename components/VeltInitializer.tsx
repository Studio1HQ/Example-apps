"use client";

import { useEffect } from 'react';
import { useVeltClient } from '@veltdev/react';
import { useUserStore } from "@/helper/userdb";

export default function VeltInitializer() {
    const { client } = useVeltClient();
    const { user } = useUserStore();

    useEffect(() => {
        if (client && user) {
            // Initialize Velt with the current user
            const initVelt = async () => {
                // Identify user
                await client.identify({
                    userId: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoUrl: user.photoUrl,
                    organizationId: 'inventory-dashboard-org'
                });

                // Set document ID for collaboration context
                client.setDocumentId('inventory-dashboard');
            };

            initVelt();
        }
    }, [client, user]);

    return null; // This component doesn't render anything
}
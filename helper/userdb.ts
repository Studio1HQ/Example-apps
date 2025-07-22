import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  photoUrl?: string;
};

export interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const userIds = ["user001", "user002"];
export const names = ["Steve", "Elli"];

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: {
        uid: "user002",
        displayName: "Elli",
        email: "elli@inventory.com",
        photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elli"
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
    }
  )
);

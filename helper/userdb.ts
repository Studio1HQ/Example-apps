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
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ParentProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  country?: string;
  city?: string;
  relationship?: string;
  religion?: string;
  gender?: string;
  language?: string;
  dateOfBirth?: string;
}

interface ParentState {
  token: string;
  profile: ParentProfile;
  setToken: (token: string) => void;
  setProfile: (profile: Partial<ParentProfile>) => void;
  resetParentState: () => void;
}

export const useParentStore = create<ParentState>()(
  persist(
    (set) => ({
      token: "",
      profile: {},
      setToken: (token) => set({ token }),
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      resetParentState: () =>
        set({
          token: "",
          profile: {},
        }),
    }),
    {
      name: "parent-store",
    }
  )
);

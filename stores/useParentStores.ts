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
  avatar?: string | null; 
  banner?: string | null; 
}

interface ParentState {
  token: string;
  profile: ParentProfile;
  setToken: (token: string) => void;
  setProfile: (profile: Partial<ParentProfile>) => void;
  resetParentState: () => void;
  isProfileCompleted: () => boolean;
}

export const useParentStore = create<ParentState>()(
  persist(
    (set, get) => ({
      token: "",
      profile: {
        avatar: null,
        banner: null,
      },
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
      isProfileCompleted: () => {
        const { profile } = get();
        return (
          !!profile.firstName &&
          !!profile.lastName &&
          !!profile.email &&
          !!profile.country &&
          !!profile.city &&
          !!profile.dateOfBirth &&
          !!profile.relationship &&
          !!profile.religion
        );
      },
    }),
    {
      name: "parent-store",
    }
  )
);

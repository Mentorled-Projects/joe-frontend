import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ParentProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
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
  verificationDocumentType?: string | null;
  
}

interface ChildProfile {
  firstName?: string;
  lastName?: string;
  gender?: string;
  dob?: string;
  schoolName?: string;
  schoolClass?: string;
  interests?: string;
  sports?: string;
  middleName?: string;
  favoriteSubjects?: string;
}

interface ParentState {
  token: string;
  profile: ParentProfile;
  childProfile: ChildProfile;
  setToken: (token: string) => void;
  setProfile: (profile: Partial<ParentProfile>) => void;
  setChildProfile: (profile: Partial<ChildProfile>) => void;
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
        verificationDocumentType: null,
      },
      childProfile: {},
      setToken: (token) => set({ token }),
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      setChildProfile: (childProfile) =>
        set((state) => ({
          childProfile: { ...state.childProfile, ...childProfile },
        })),
      resetParentState: () =>
        set({
          token: "",
          profile: {},
          childProfile: {},
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

// stores/useChildStores.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ---------- Types ---------- */

export interface Milestone {
  title: string;
  date: string;
  file?: string | null; 
}
export interface Education {
  schoolName: string;
  certificate: string;
  startDate: string;
  endDate: string;
  logo?: string | null; 
  description: string;  
}

export interface ChildProfile {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  dateOfBirth?: string;
  schoolName?: string;
  Class?: string;
  favoriteSubjects?: string | null;
  interests?: string[];
  sports?: string | null;
  image?: string | null;
  city?: string;
  country?: string;
  headline?: string;
  about?: string;
  milestones: Milestone[]; 
  education?: Education[];
}

interface ChildStoreState {
  childProfile: ChildProfile;
}

interface ChildStoreActions {
  setChildProfile: (data: Partial<ChildProfile>) => void;
  resetChildProfile: () => void;
  // setToken?: (token: string) => void; // uncomment if you need it
}

type ChildStore = ChildStoreState & ChildStoreActions;

/* ---------- Helpers ---------- */

// initial empty profile
const emptyProfile: ChildProfile = {
  firstName: "",
  lastName: "",
  middleName: "",
  gender: "",
  dateOfBirth: "",
  schoolName: "",
  Class: "",
  favoriteSubjects: null,
  interests: [],
  sports: null,
  image: null,
  city: "",
  country: "",
  headline: "",
  about: "",
  milestones: [], 
  education: [],
};



export const useChildStore = create<ChildStore>()(
  persist(
    (set) => ({
      childProfile: emptyProfile,

      setChildProfile: (data) =>
        set((state) => ({
          childProfile: { ...state.childProfile, ...data },
        })),

      resetChildProfile: () => set({ childProfile: emptyProfile }),
    }),
    {
      name: "child-profile-storage", // localStorage key
    }
  )
);

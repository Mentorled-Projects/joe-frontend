import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChildData {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  Class: string;
  image?: string;
}

interface ParentData {
  _id: string;
  phoneNumber: string;
  isVerified: boolean;
  emailVerified: boolean;
  role: string;
  child: ChildData[];
  files: File[];
  createdAt: string;
  __v: number;
  city?: string;
  dateOfBirth?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  language?: string;
  lastName?: string;
  relationship?: string;
  religion?: string;
  emailVerificationExpires?: string | null;
  emailVerificationOtp?: string | null;
}

interface ParentProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string; 
  country?: string;
  city?: string;
  relationship?: string;
  religion?: string;
  data?: ParentData;
  gender?: string;
  language?: string;
  dateOfBirth?: string;
  avatar?: string | null;
  banner?: string | null;
  verificationDocumentType?: string | null;
  phoneNumber?: string; 
  childId?: string; 
  _id?: string; 
  favoriteTutorIds?: string[];
  isAccountVerified?: boolean;
  isProfileCompleted?: boolean; 
  children?: ChildData[]; 
}

interface ParentState {
  token: string;
  profile: ParentProfile;
  _hasHydrated: boolean; 
}

interface ParentStoreActions {
  setToken: (token: string) => void;
  setProfile: (profile: Partial<ParentProfile>) => void;
  resetParentState: () => void;
  isProfileCompleted: () => boolean;
  setHasHydrated: (hasHydrated: boolean) => void; 
}

type ParentStore = ParentState & ParentStoreActions;

export const useParentStore = create<ParentStore>()(
  persist(
    (set, get) => ({
      token: "",
      profile: {
        avatar: null,
        banner: null,
        verificationDocumentType: null,
        phoneNumber: undefined,
        childId: undefined,
        _id: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        
        country: undefined,
        city: undefined,
        relationship: undefined,
        religion: undefined,
        gender: undefined,
        language: undefined,
        dateOfBirth: undefined,
        favoriteTutorIds: [],
        isAccountVerified: false,
        children: [], // Initialize children as an empty array
      },
      _hasHydrated: false,

      setToken: (token) => set({ token }),
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      resetParentState: () =>
        set({
          token: "",
          profile: {
            avatar: null,
            banner: null,
            verificationDocumentType: null,
            phoneNumber: undefined,
            childId: undefined,
            _id: undefined,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            country: undefined,
            city: undefined,
            relationship: undefined,
            religion: undefined,
            gender: undefined,
            language: undefined,
            dateOfBirth: undefined,
            isAccountVerified: false,
            children: [], // Reset children to empty array
          },
          _hasHydrated: false,
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
      setHasHydrated: (hasHydated) => {
        set({ _hasHydrated: hasHydated });
      },
    }),
    {
      name: "parent-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

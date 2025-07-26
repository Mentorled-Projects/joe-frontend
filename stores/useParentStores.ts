import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the ChildData interface here, as it's used in ParentProfile
interface ChildData {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  Class: string;
  image?: string;
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
  isProfileCompleted?: boolean; // Ensure this is present if used
  children?: ChildData[]; // <--- ADD THIS LINE: To store children directly in the parent's profile
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

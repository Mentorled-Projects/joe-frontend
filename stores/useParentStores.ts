import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Import createJSONStorage

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
  childId?: string; // Added childId property
}

interface ParentState {
  token: string;
  profile: ParentProfile;
  _hasHydrated: boolean; // Added hydration flag
}

interface ParentStoreActions {
  setToken: (token: string) => void;
  setProfile: (profile: Partial<ParentProfile>) => void;
  resetParentState: () => void;
  isProfileCompleted: () => boolean;
  setHasHydrated: (hasHydrated: boolean) => void; // Setter for hydration flag
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
        phoneNumber: undefined, // Initialize phoneNumber
        childId: undefined, // Initialize childId
      },
      _hasHydrated: false, // Initialize hydration flag to false

      setToken: (token) => set({ token }),
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      resetParentState: () =>
        set({
          token: "",
          profile: {}, // Reset profile to an empty object
          _hasHydrated: false, // Reset hydration flag on store clear
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
      storage: createJSONStorage(() => localStorage), // Specify localStorage as storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true); // Set the flag to true after rehydration
        }
      },
    }
  )
);

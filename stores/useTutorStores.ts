import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the TutorProfile interface
interface TutorProfile {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string; // This will be the profile picture URL
  phoneNumber?: string;
  location?: string;
  hourlyRate?: {
    min: number;
    max: number;
  };
  rating?: number;
  reviewsCount?: number;
  subjects?: { name: string; level: string }[];
  certifications?: string[];
  about?: string;
  availability?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  // Add any other profile fields a tutor might have
}

// Define the state for the tutor store
interface TutorState {
  token: string;
  profile: TutorProfile;
  _hasHydrated: boolean; // Flag to indicate if the store has rehydrated from localStorage
}

// Define the actions for the tutor store
interface TutorStoreActions {
  setToken: (token: string) => void;
  setProfile: (profile: Partial<TutorProfile>) => void;
  resetTutorState: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

// Combine state and actions into a single type
type TutorStore = TutorState & TutorStoreActions;

export const useTutorStore = create<TutorStore>()(
  persist(
    (set) => ({ 
      // Initial state
      token: "",
      profile: {
        _id: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        image: undefined, // Default profile image
        phoneNumber: undefined,
        location: undefined,
        hourlyRate: undefined,
        rating: undefined,
        reviewsCount: undefined,
        subjects: undefined,
        certifications: undefined,
        about: undefined,
        availability: undefined,
      },
      _hasHydrated: false, // Initially false, set to true after rehydration

      // Actions
      setToken: (token) => set({ token }),
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      resetTutorState: () =>
        set({
          token: "",
          profile: { // Reset profile to its initial undefined state
            _id: undefined,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            image: undefined,
            phoneNumber: undefined,
            location: undefined,
            hourlyRate: undefined,
            rating: undefined,
            reviewsCount: undefined,
            subjects: undefined,
            certifications: undefined,
            about: undefined,
            availability: undefined,
          },
          _hasHydrated: false,
        }),
      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated });
      },
    }),
    {
      name: "tutor-store", // Name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true); // Mark as hydrated after rehydration
        }
      },
    }
  )
);

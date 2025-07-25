import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TutorProfile {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  phoneNumber?: string;
  language?: string;
  gender?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  hourlyRate?: {
    min: number;
    max: number;
  };
  rating?: number;
  reviewsCount?: number;
  subjects?: { name: string; level: string }[];
  certifications?: string[];
  about?: string;
  experience?: string;
  availability?: string;
  location?: string;
  isProfileCompleted?: boolean;
  isAccountVerified?: boolean;
}

interface TutorState {
  token: string;
  profile: TutorProfile;
  _hasHydrated: boolean;
}

interface TutorStoreActions {
  setToken: (token: string) => void;
  setProfile: (profile: Partial<TutorProfile>) => void;
  resetTutorState: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

type TutorStore = TutorState & TutorStoreActions;

export const useTutorStore = create<TutorStore>()(
  persist(
    (set) => ({
      token: "",
      profile: {
        _id: undefined,
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        image: undefined,
        phoneNumber: undefined,
        language: undefined,
        gender: undefined,
        city: undefined, 
        country: undefined,
        dateOfBirth: undefined, 
        hourlyRate: undefined,
        rating: undefined,
        reviewsCount: undefined,
        subjects: undefined,
        certifications: undefined,
        about: undefined,
        experience: undefined,
        availability: undefined,
        isProfileCompleted: false,
        isAccountVerified: false,
        location: undefined, 
      },
      _hasHydrated: false,

      setToken: (token) => set({ token }),
      setProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),
      resetTutorState: () =>
        set({
          token: "",
          profile: {
            _id: undefined,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            image: undefined,
            phoneNumber: undefined,
            language: undefined,
            gender: undefined,
            city: undefined,
            country: undefined,
            dateOfBirth: undefined,
            hourlyRate: undefined,
            rating: undefined,
            reviewsCount: undefined,
            subjects: undefined,
            certifications: undefined,
            about: undefined,
            experience: undefined,
            availability: undefined,
            isProfileCompleted: false,
            isAccountVerified: false,
          },
          _hasHydrated: false,
        }),
      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated });
      },
    }),
    {
      name: "tutor-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

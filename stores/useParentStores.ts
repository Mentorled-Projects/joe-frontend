import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ParentProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string; // Assuming 'image' might be used for avatar URL if not 'avatar'
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
  phoneNumber?: string; // Ensured phoneNumber is here
  childId?: string; // Ensured childId is here
  _id?: string; // Ensured _id is here and correctly typed
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
        _id: undefined, // Initialize _id
        firstName: undefined, // Initialize firstName
        lastName: undefined, // Initialize lastName
        email: undefined, // Initialize email
        // Add other fields from login response if needed for initial state
        country: undefined,
        city: undefined,
        relationship: undefined,
        religion: undefined,
        gender: undefined,
        language: undefined,
        dateOfBirth: undefined,
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

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; 

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
   favoriteTutorIds?: string[];

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
        favoriteTutorIds: [],
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
            favoriteTutorIds: [], 
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
      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated });
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

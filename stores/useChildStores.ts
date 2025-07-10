import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of the ChildProfile
interface ChildProfile {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  dateOfBirth?: string; 
  schoolName?: string;
  Class?: string; 
  favoriteSubjects?: string | null;
  interests?: string | null;
  sports?: string | null;
  image?: string | null;
  city?: string;
  country?: string;
  headline?: string;
}

// Define the shape of the ChildStore's state
interface ChildStoreState {
  childProfile: ChildProfile;
}

// Define the actions for updating and resetting the profile
interface ChildStoreActions {
  setChildProfile: (profileData: Partial<ChildProfile>) => void;
  resetChildProfile: () => void;
  setToken?: (token: string) => void; // Optional: not used in this snippet
}

// Combine state and actions
type ChildStore = ChildStoreState & ChildStoreActions;

// Create Zustand store with persistence
export const useChildStore = create<ChildStore>()(
  persist(
    (set) => ({
      childProfile: {
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        dateOfBirth: '', 
        schoolName: '',
        Class: '', 
        favoriteSubjects: null,
        interests: null,
        sports: null,
        image: null,
        city: '',
        country: '',
        headline: '',
      },
      setChildProfile: (profileData) =>
        set((state) => ({
          childProfile: { ...state.childProfile, ...profileData },
        })),
      resetChildProfile: () =>
        set({
          childProfile: {
            firstName: '',
            lastName: '',
            middleName: '',
            gender: '',
            dateOfBirth: '', 
            schoolName: '',
            Class: '', 
            favoriteSubjects: null,
            interests: null,
            sports: null,
            image: null,
            city: '',
            country: '',
            headline: '',
          },
        }),
    }),
    {
      name: 'child-profile-storage', // key in localStorage
    }
  )
);

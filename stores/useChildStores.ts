import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of the ChildProfile
interface ChildProfile {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  dateOfBirth?: string; // Consistent with API
  schoolName?: string;
  Class?: string; // Changed to 'Class' to match API
  favoriteSubjects?: string[]; // Changed to string[]
  interests?: string[]; // Changed to string[]
  sports?: string[]; // Changed to string[]
  image?: string | null;
  banner?: string | null; // Added banner property
  city?: string;
  country?: string;
  age?: number; // Added age property
}

// Define the shape of the ChildStore's state
interface ChildStoreState {
  childProfile: ChildProfile;
}


interface ChildStoreActions {
  setChildProfile: (profileData: Partial<ChildProfile>) => void;
  resetChildProfile: () => void;
  setToken?: (token: string) => void;
}


type ChildStore = ChildStoreState & ChildStoreActions;


export const useChildStore = create<ChildStore>()(
  persist(
    (set) => ({
      // Initial state for the 'childProfile' object
      childProfile: {
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        dateOfBirth: '', // Consistent with interface and API
        schoolName: '',
        Class: '', // Consistent with interface and API
        favoriteSubjects: [], // Initialized as empty array
        interests: [], // Initialized as empty array
        sports: [], // Initialized as empty array
        image: null,
        banner: null, // Initialize banner
        city: '',
        country: '',
        age: undefined, // Initialize age
      },
      // Action to update the child profile
      setChildProfile: (profileData) => set((state) => ({
        childProfile: { ...state.childProfile, ...profileData }
      })),
      // Action to reset child profile
      resetChildProfile: () => set({
        childProfile: {
          firstName: '',
          lastName: '',
          middleName: '',
          gender: '',
          dateOfBirth: '', // Consistent with interface and API
          schoolName: '',
          Class: '', // Consistent with interface and API
          favoriteSubjects: [],
          interests: [],
          sports: [],
          image: null,
          banner: null, // Reset banner
          city: '',
          country: '',
          age: undefined, // Reset age
        }
      }),
    }),
    {
      name: 'child-profile-storage',
    }
  )
);

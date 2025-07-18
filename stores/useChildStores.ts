import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface ChildProfile {
  _id?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: string;
  dateOfBirth?: string;
  schoolName?: string;
  Class?: string;
  favoriteSubjects?: string[];
  interests?: string[];
  sports?: string[];
  image?: string | null;
  banner?: string | null;
  city?: string;
  country?: string;
  age?: number;
  about?: string;
  education?: EducationEntry[];
  headline?: string;

}


interface ChildStoreState {
  childProfile: ChildProfile;
}

interface EducationEntry {
  schoolName: string;
  certificate: string;
  startDate: string;
  endDate: string;
  description: string;
  logo?: string | null;
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
        _id: undefined, // Initialize _id
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
        banner: null, 
        city: '',
        country: '',
        age: undefined, 
        about: '', 
        education: [], 
        headline: '', 
      },
      
      setChildProfile: (profileData) => set((state) => ({
        childProfile: { ...state.childProfile, ...profileData }
      })),
      // Action to reset child profile
      resetChildProfile: () => set({
        childProfile: {
          _id: undefined, // Reset _id
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
          about: '', // Reset 'about'
          education: [], 
          headline: '', 
        }
      }),
    }),
    {
      name: 'child-profile-storage',
    }
  )
);

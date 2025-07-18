import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EducationEntry {
  schoolName: string;
  certificate: string;
  startDate: string;
  endDate: string;
  description: string;
  logo?: string | null;
}

interface Milestone {
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

interface ChildProfile {
  _id?: string;
  childId?: string;
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
  achievements?: string[];
  milestones?: Milestone[];
  hobbies?: string[];
  skills?: string[];
  awards?: string[];
  projects?: string[];
  languages?: string;
}

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
      childProfile: {
        _id: undefined,
        childId: '',
        firstName: '',
        lastName: '',
        middleName: '',
        gender: '',
        dateOfBirth: '',
        schoolName: '',
        Class: '',
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
        achievements: [],
        milestones: [],
        hobbies: [],
        skills: [],
        awards: [],
        projects: [],
        languages: '',
      },
      setChildProfile: (profileData) =>
        set((state) => ({
          childProfile: { ...state.childProfile, ...profileData },
        })),
      resetChildProfile: () =>
        set({
          childProfile: {
            _id: undefined,
            childId: '',
            firstName: '',
            lastName: '',
            middleName: '',
            gender: '',
            dateOfBirth: '',
            schoolName: '',
            Class: '',
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
            achievements: [],
            milestones: [],
            hobbies: [],
            skills: [],
            awards: [],
            projects: [],
            languages: '',
          },
        }),
    }),
    {
      name: 'child-profile-storage',
    }
  )
);

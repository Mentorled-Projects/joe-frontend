import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChildPost } from '@/types/child';


const initialMockPosts: ChildPost[] = [
  {
    id: "1",
    authorName: "Alex Thompson",
    authorAvatar: "/assets/images/kiddp.svg", 
    timeAgo: "4h",
    edited: true,
    content: "Just finished my volcano science project! It actually erupted! 🌋 #ScienceExperiments #Volcano",
    image: "/assets/images/kid-volcano.svg", 
    tags: ["#ScienceExperiments", "#Volcano"],
  },
  {
    id: "2",
    authorName: "Emma Thompson",
    authorAvatar: "/assets/images/kiddp.svg",
    timeAgo: "1h",
    content: "I finished reading 'The Magical Treehouse' series! It was so exciting. What should I read next? #books #reading 📚",
    image: "/assets/images/kidsRabbit.svg", 
    tags: ["#books", "#reading"],
  },
];

interface PostState {
  posts: ChildPost[];
}

interface PostActions {
  setPosts: (posts: ChildPost[]) => void; 
  addPost: (post: ChildPost) => void;
  updatePost: (postId: string, updatedFields: Partial<ChildPost>) => void; 
  deletePost: (postId: string) => void;
}

type PostStore = PostState & PostActions;

export const usePostStore = create<PostStore>()(
  persist(
    (set) => ({
      posts: initialMockPosts, 

     
      setPosts: (newPosts) => set({ posts: newPosts }),

     
      addPost: (post) => set((state) => ({
        posts: [post, ...state.posts], 
      })),

     
      updatePost: (postId, updatedFields) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updatedFields } : post
          ),
        })),

     
      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),
    }),
    {
      name: 'child-posts-storage', 
    }
  )
);

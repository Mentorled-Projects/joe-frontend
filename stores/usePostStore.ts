import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChildPost } from '@/types/child'; // Ensure this path is correct

// Define your initial mock posts here, so they are part of the store's initial state
const initialMockPosts: ChildPost[] = [
  {
    id: "1",
    authorName: "Alex Thompson",
    authorAvatar: "/assets/images/kiddp.svg", // Placeholder avatar
    timeAgo: "4h",
    edited: true,
    content: "Just finished my volcano science project! It actually erupted! 🌋 #ScienceExperiments #Volcano",
    image: "/assets/images/kid-volcano.svg", // Placeholder post image
    tags: ["#ScienceExperiments", "#Volcano"],
  },
  {
    id: "2",
    authorName: "Emma Thompson",
    authorAvatar: "/assets/images/kiddp.svg", // Placeholder avatar
    timeAgo: "1h",
    content: "I finished reading 'The Magical Treehouse' series! It was so exciting. What should I read next? #books #reading 📚",
    image: "/assets/images/kidsRabbit.svg", // Placeholder post image
    tags: ["#books", "#reading"],
  },
];

interface PostState {
  posts: ChildPost[];
}

interface PostActions {
  setPosts: (posts: ChildPost[]) => void; // Added setPosts action
  addPost: (post: ChildPost) => void;
  updatePost: (postId: string, updatedFields: Partial<ChildPost>) => void; // Added updatePost action
  deletePost: (postId: string) => void; // Added deletePost action
}

type PostStore = PostState & PostActions;

export const usePostStore = create<PostStore>()(
  persist(
    (set) => ({
      posts: initialMockPosts, // Initialize with your mock posts

      // Action to set all posts (e.g., after fetching from API)
      setPosts: (newPosts) => set({ posts: newPosts }),

      // Action to add a new post
      addPost: (post) => set((state) => ({
        posts: [post, ...state.posts], // Add new post to the beginning of the array
      })),

      // Action to update an existing post
      updatePost: (postId, updatedFields) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === postId ? { ...post, ...updatedFields } : post
          ),
        })),

      // Action to delete a post
      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== postId),
        })),
    }),
    {
      name: 'child-posts-storage', // Name for localStorage key
    }
  )
);

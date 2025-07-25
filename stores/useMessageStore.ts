import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the structure for a single message
interface Message {
  id: string;
  conversationId: string; // To link messages to a specific conversation
  senderId: string;
  text: string;
  timestamp: number;
}

// Define the structure for a conversation (representing a chat with another user)
interface Conversation {
  id: string;
  userId: string; // The ID of the other user in the conversation
  userName: string;
  userAvatar: string;
  lastMessageText: string;
  lastMessageTimestamp: number;
}

// Define the state and actions for the message store
interface MessageStoreState {
  conversations: Conversation[];
  messages: Message[]; // All messages, will be filtered by activeConversationId
  activeConversationId: string | null;
  currentUserId: string; // Dummy ID for the current logged-in user (e.g., tutor's ID)

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (messages: Message[]) => void;
  setActiveConversation: (conversationId: string | null) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (conversationId: string, text: string, timestamp: number) => void;
  initializeStore: (userId: string) => void; // To set initial data/current user
}

// Create the Zustand store with persistence
export const useMessageStore = create<MessageStoreState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: [],
      activeConversationId: null,
      currentUserId: 'dummyTutorId', // Default dummy ID, will be updated on initialize

      setConversations: (conversations) => set({ conversations }),
      setMessages: (messages) => set({ messages }),
      setActiveConversation: (conversationId) => set({ activeConversationId: conversationId }),

      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
        // Also update the last message in the relevant conversation
        get().updateLastMessage(message.conversationId, message.text, message.timestamp);
      },

      updateLastMessage: (conversationId, text, timestamp) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, lastMessageText: text, lastMessageTimestamp: timestamp }
              : conv
          ),
        }));
      },

      initializeStore: (userId) => {
        // This function can be called once on app load or messages page load
        // to set the actual current user ID and potentially load initial data.
        set({ currentUserId: userId });

        // Dummy initial conversations and messages for demo
        const dummyConversations: Conversation[] = [
          {
            id: 'conv-1',
            userId: 'user-emily',
            userName: 'Emily Carter',
            userAvatar: 'https://placehold.co/40x40/FFC0CB/FFFFFF?text=EC',
            lastMessageText: 'Hi, I\'m looking for a tutor for my daughter, Chloe.',
            lastMessageTimestamp: Date.now() - 3600000, // 1 hour ago
          },
          {
            id: 'conv-2',
            userId: 'user-ryan',
            userName: 'Ryan Parker',
            userAvatar: 'https://placehold.co/40x40/ADD8E6/FFFFFF?text=RP',
            lastMessageText: 'Hi, I\'m looking for a tutor for my son, Owen.',
            lastMessageTimestamp: Date.now() - 7200000, // 2 hours ago
          },
          {
            id: 'conv-3',
            userId: 'user-sophia',
            userName: 'Sophia Hayes',
            userAvatar: 'https://placehold.co/40x40/90EE90/FFFFFF?text=SH',
            lastMessageText: 'Hi, I\'m looking for a tutor for my daughter, Ava.',
            lastMessageTimestamp: Date.now() - 10800000, // 3 hours ago
          },
        ];

        const dummyMessages: Message[] = [
          { id: 'msg-1-1', conversationId: 'conv-1', senderId: 'user-emily', text: 'Hi, I\'m looking for a tutor for my daughter, Chloe.', timestamp: Date.now() - 3600000 },
          { id: 'msg-1-2', conversationId: 'conv-1', senderId: userId, text: 'Hello Emily, I\'d be happy to help Chloe. What subjects is she struggling with?', timestamp: Date.now() - 3500000 },
          { id: 'msg-2-1', conversationId: 'conv-2', senderId: 'user-ryan', text: 'Hi, I\'m looking for a tutor for my son, Owen.', timestamp: Date.now() - 7200000 },
          { id: 'msg-3-1', conversationId: 'conv-3', senderId: 'user-sophia', text: 'Hi, I\'m looking for a tutor for my daughter, Ava.', timestamp: Date.now() - 10800000 },
        ];

        // Only set initial data if the store is empty (first load)
        if (get().conversations.length === 0 && get().messages.length === 0) {
          set({
            conversations: dummyConversations,
            messages: dummyMessages,
          });
        }
      },
    }),
    {
      name: 'message-storage', // Name for localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage
      // Define which parts of the state to persist
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
        activeConversationId: state.activeConversationId,
        currentUserId: state.currentUserId,
      }),
    }
  )
);

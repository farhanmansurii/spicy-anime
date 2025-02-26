import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LibraryItem {
  added: boolean;
  tracked: boolean;
  episodeId?: string;
}

interface LibraryStore {
  items: Record<string, LibraryItem>;
  addToLibrary: (animeId: string, episodeId?: string) => void;
  removeFromLibrary: (animeId: string) => void;
  trackEpisode: (animeId: string, episodeId: string) => void;
  untrackEpisode: (animeId: string) => void;
}

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set) => ({
      items: {},
      addToLibrary: (animeId, episodeId) =>
        set((state) => ({
          items: {
            ...state.items,
            [animeId]: { added: true, tracked: !!episodeId, episodeId },
          },
        })),
      removeFromLibrary: (animeId) =>
        set((state) => {
          const updatedItems = { ...state.items };
          delete updatedItems[animeId];
          return { items: updatedItems };
        }),
      trackEpisode: (animeId, episodeId) =>
        set((state) => ({
          items: {
            ...state.items,
            [animeId]: {
              ...(state.items[animeId] || { added: false }),
              tracked: true,
              episodeId,
            },
          },
        })),
      untrackEpisode: (animeId) =>
        set((state) => ({
          items: {
            ...state.items,
            [animeId]: {
              ...(state.items[animeId] || { added: false }),
              tracked: false,
              episodeId: undefined,
            },
          },
        })),
    }),
    {
      name: 'library-storage',

    }
  )
);

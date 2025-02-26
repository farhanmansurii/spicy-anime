import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AnimeResult {
  id: string;
  title: string;
  image: string;
  releaseDate: string | null;
  type: 'TV' | 'Movie' | 'ONA' | 'Special';
}

interface LastClickedStore {
  lastClicked: AnimeResult[];
  addClicked: (anime: AnimeResult) => void;
  removeClicked: (animeId: string) => void;
  clearAll: () => void;
}

export const useLastClicked = create(
  persist<LastClickedStore>(
    (set, get) => ({
      lastClicked: [],
      addClicked: (anime: AnimeResult) => {
        const filtered = get().lastClicked.filter(item => item.id !== anime.id);
        const updated = [...filtered, anime];
        if (updated.length > 10) {
          updated.shift();
        }
        set({ lastClicked: updated });
      },
      removeClicked: (animeId: string) => {
        set({
          lastClicked: get().lastClicked.filter(item => item.id !== animeId),
        });
      },
      clearAll: () => {
        set({ lastClicked: [] });
      },
    }),
    {
      name: 'last-clicked-storage', // unique name for localStorage persistence
    }
  )
);

export interface Episode {
    id: string;
    number: number;
    url: string;
    title: string;
    isFiller: boolean;
}
export interface AnimeInfo {
  id: string;
  title: string;
  malID: number;
  alID: number;
  japaneseTitle: string;
  image: string;
  description: string;
  type: string;
  url: string;
  recommendations: { id: string; title: string; image: string }[];
  relatedAnime: { id: string; title: string; image: string }[];
  subOrDub: string;
  hasSub: boolean;
  hasDub: boolean;
  genres: string[];
  status: string;
  season: string;
    totalEpisodes: number;
  episodes: Episode[];
}

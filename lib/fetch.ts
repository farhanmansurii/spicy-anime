// lib/animeApi.ts
import axios from 'axios';
import { AnimeInfo } from './type';

const animeURL = 'https://spicy-anime-bg.vercel.app';


export interface StreamSource {
    url: string;
    server: string;
    quality: string;
    isM3U8: boolean;
    isBackup: boolean;
}

export interface EpisodeStream {
  headers: {
    Referer: string;
    watchsb: string | null; // only provided when server equals "streamsb"
    "User-Agent": string | null;
  };
  sources: {
    url: string;
    quality: string;
      isM3U8: boolean;
    title:string
  }[];
}


/**
 * Search for anime by keyword.
 * @param query - The search query string.
 * @returns A promise that resolves to an array of AnimeInfo objects.
 *
 * Endpoint: GET /anime/search?query={query}
 */
export const searchAnime = async (query: string): Promise<AnimeInfo[]> => {
    try {
        const { data } = await axios.get<{ results: AnimeInfo[] }>(`${animeURL}/anime/search`, {
            params: { query }
        });

        return data.results as AnimeInfo[];
    } catch (error) {
        console.error('Error searching anime:', error);
        throw error;
    }
};

/**
 * Get detailed anime information by ID.
 * @param id - The unique anime ID.
 * @returns A promise that resolves to an AnimeInfo object.
 *
 * Endpoint: GET /anime/info/{id}
 */
export const getAnimeInfo = async (id: string): Promise<AnimeInfo> => {
    try {
        const { data } = await axios.get(`${animeURL}/anime/zoro/info?id=${id}`);
        return data as AnimeInfo;
    } catch (error) {
        console.error(`Error fetching info for anime ${id}:`, error);
        throw error;
    }
};

/**
 * Get streaming links for a given anime episode.
 * @param id - The anime ID.
 * @param episode - The episode number.
 * @returns A promise that resolves to an EpisodeStream object.
 *
 * Endpoint: GET /anime/watch/{id}/{episode}
 */
export const getEpisodeStreams = async (episodeId: string, server: string | null = 'vidcloud'): Promise<EpisodeStream> => {
    try {

        const { data } = await axios.get(`${animeURL}/anime/zoro/watch/${episodeId}?server=${server}`);
        return data as EpisodeStream;
    } catch (error) {
        console.error(`Error fetching episode ${episodeId} streams for anime :`, error);
        throw error;
    }
};

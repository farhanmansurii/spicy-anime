'use client';
/* eslint-disable @next/next/no-img-element */

import * as React from 'react';
import { Loader2, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Badge } from '../ui/badge';

type AnimeResult = {
  id: string;
  title: string;
  image: string;
  releaseDate: string | null;
  type: 'TV' | 'Movie' | 'ONA' | 'Special';
};

const fetchAnime = async (
  query: string,
  signal: AbortSignal,
): Promise<AnimeResult[]> => {
  const url = `https://spicy-anime-bg.vercel.app/anime/zoro/${query}?page=1`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.results.filter((anime: AnimeResult) => {
    const type = anime.type.toLowerCase();
    return type === 'tv' || type === 'movie';
  });
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function CommandDialogDemo() {
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 1000);

  const {
    data: results,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<AnimeResult[], Error>(
    ['anime', debouncedQuery],
    ({ signal }) => fetchAnime(debouncedQuery, signal as AbortSignal),
    {
      enabled: debouncedQuery.length > 3,
      keepPreviousData: false,
      staleTime: 5000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );

  const showLoading = isLoading && !results && debouncedQuery.length > 3;

  return (
    <div>
      <div className="flex h-12 items-center px-4 focus-within:ring-2 duration-200 rounded ring-1 ring-transparent focus-within:ring-primary my-4">
        {showLoading ? (
          <Loader2 className="text-muted-foreground animate-spin duration-50 peer-focus:text-primary" />
        ) : (
          <Search className="text-muted-foreground peer-focus:text-primary" />
        )}
        <Input
          value={query}
          className="my-2 h-12 border-0 shadow-none focus-visible:ring-0"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for anime..."
        />
      </div>

      <div className="min-h-96">
        {showLoading && <p>Loading...</p>}
        {isError && <p>Error: {error?.message}</p>}
        {results &&
          results.length === 0 &&
          !isLoading &&
          debouncedQuery.length > 3 && <p>No results found.</p>}
        {!!results?.length && (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {results?.map((e) => (
              <Link key={e.id} href={`/anime/${e.id}`}>
                <div className="rounded overflow-hidden group relative aspect-[2/3] ring-2 ring-transparent group-hover:ring-primary bg-muted group-hover:cursor-pointer  duration-150">
                  <div className="absolute group-hover:cursor-pointer inset-0 group-hover:bg-black/20 bg-none duration-200"></div>
                  {e.image && (
                    <img
                      src={e.image}
                      alt={''}
                      className="w-full flex border-none h-full aspect-[2/3]"
                    />
                  )}
                  <Badge className="rounded absolute top-1 right-1">{e.type}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}

        {isFetching && results && <p>Refreshing...</p>}
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export interface Anime {
  id: string;
  title: string;
  image: string;
  // Additional fields can be added if provided by the API.
}

interface AnimeRowProps {
  title: string;
  endpoint: string;
}

const AnimeRow: React.FC<AnimeRowProps> = ({ title, endpoint }) => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(endpoint)
      .then((response) => {
        console.log(`[log] : anime-row.tsx:26 : response →`, response)
        // According to the docs, the response should have a 'results' array.
        setAnimes(response.data.results);
      })
      .catch((error) => {
        console.error(`Error fetching ${title} anime:`, error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [endpoint, title]);

  return (
    <div className="my-4">
      <h2 className="text-lg md:text-2xl font-bold mb-2">{title}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto">
          {animes.map((anime) => (
            <div key={anime.id} className="w-40 flex-shrink-0">
              <img
                src={anime.image}
                alt={anime.title}
                className="w-full h-auto rounded"
              />
              <p className="text-sm mt-1">{anime.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimeRow;

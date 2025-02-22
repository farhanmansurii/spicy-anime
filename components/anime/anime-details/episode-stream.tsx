'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { getEpisodeStreams } from '@/lib/fetch';
import EpisodeRender from './episode-player';

export default function EpisodePlayer() {
    const searchParams = useSearchParams();
    const episodeId = searchParams.get('episode');



    const { data: results, isLoading, isError } = useQuery(
        ['episode', episodeId],
        () => getEpisodeStreams(episodeId as string),
        {
            enabled: Boolean(episodeId),
            staleTime: 5000,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
        }
    );

    if (!episodeId) {
        return <div>No episode selected.</div>;
    }
    if (isLoading) {
        return (
            <div className="w-full flex items-center justify-center aspect-video bg-muted">
                Loading...
            </div>
        );
    }

    if (isError) {
        return <div>This Episode is Currently unavailable</div>;
    }

    if (!results || !results.sources) {
        return <div>No streams available.</div>;
    }

    return <EpisodeRender sources={results.sources}/>;
}

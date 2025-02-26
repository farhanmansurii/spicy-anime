'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { getEpisodeStreams } from '@/lib/fetch';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { Episode } from '@/lib/type';

const EpisodeRender = dynamic(() => import('./episode-player'), { ssr: false });

export default function EpisodePlayer({ episodes }: { episodes: Episode[] }) {
	const searchParams = useSearchParams();
	const episodeId = searchParams.get('episode');
	console.log(`[log] : episode-stream.tsx:16 : episodeId →`, episodeId);

	const activeEpisode = episodes.find(
		(episode) => episode.id === decodeURIComponent(episodeId as string)
	);

	const {
		data: results,
		isLoading,
		isError,
	} = useQuery(['episode', episodeId], () => getEpisodeStreams(episodeId as string), {
		enabled: Boolean(episodeId),
		staleTime: 5000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	if (!episodeId || !activeEpisode) {
		return null;
	}

	if (isLoading) {
		return (
			<div className="w-full my-4 flex items-center rounded justify-center aspect-video bg-muted">
				<div className="flex items-center flex-col font-bold gap-2 text-primary">
					<Loader2 className="animate-spin size-12 text-primary" />
					<div>Please wait while the episode loads...</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="w-full my-4 flex items-center rounded justify-center aspect-video bg-muted">
				<div className="flex text-lg items-center flex-col font-bold gap-2 text-primary">
					<div>Oops! Something went wrong while loading the episode.</div>
				</div>
			</div>
		);
	}

	if (!results || !results.sources || results.sources.length === 0) {
		return (
			<div className="w-full my-4 flex items-center rounded justify-center aspect-video bg-muted">
				<div className="flex text-xl items-center flex-col font-bold gap-2 text-primary">
					<div>No streams available for this episode.</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full my-4 flex items-center rounded justify-center aspect-video">
			<EpisodeRender playerData={results} activeEpisode={activeEpisode} />
		</div>
	);
}

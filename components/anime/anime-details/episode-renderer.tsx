'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Episode } from '@/lib/type';
import { Badge } from '@/components/ui/badge';
import Bounce from '@/components/reusables/bounce-in';
import { useLibraryStore } from '@/store/useEpisodeStore';

interface PaginatedEpisodesProps {
	episodes: Episode[];
	animeId: string;
	type: string;
}

const EPISODES_PER_PAGE = 20;

const AnimatedEpisodes: React.FC<PaginatedEpisodesProps> = ({ episodes, type, animeId }) => {
	const [currentPage, setCurrentPage] = useState(0);
	const [hideFillers, setHideFillers] = useState(false);

	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const { items, trackEpisode, untrackEpisode } = useLibraryStore();
	const animeDataFromStorage = items[animeId] || {
		added: false,
		tracked: false,
		episodeId: undefined,
	};

	// Get the stored episode from the zustand store
	const storedEpisodeId = animeDataFromStorage.episodeId;
	const storedEpisode = storedEpisodeId ? episodes.find((ep) => ep.id === storedEpisodeId) : null;

	const filteredEpisodes = hideFillers
		? episodes.filter((episode) => !episode.isFiller)
		: episodes;
	const totalPages = Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE);
	const startIndex = currentPage * EPISODES_PER_PAGE;
	const currentEpisodes = filteredEpisodes.slice(startIndex, startIndex + EPISODES_PER_PAGE);

	// Reset pagination when toggling hideFillers
	useEffect(() => {
		setCurrentPage(0);
	}, [hideFillers]);

	// Get current episode id from URL search params and decode it.
	const currentEpisode = searchParams.get('episode');
	const currentEpisodeId = currentEpisode ? decodeURIComponent(currentEpisode) : null;
	const currentEpisodeIndex = currentEpisodeId
		? filteredEpisodes.findIndex((ep) => ep.id === currentEpisodeId)
		: -1;
	const isLastEpisode = currentEpisodeIndex === filteredEpisodes.length - 1;

	function handleEpisodeClick(episodeId: string) {
		const newParams = new URLSearchParams(searchParams);
		trackEpisode(animeId, episodeId);
		newParams.set('episode', episodeId);
		router.push(`${pathname}?${encodeURI(newParams.toString())}`);
	}

	function handleSelectPage(selectedPage: number) {
		setCurrentPage(selectedPage);
		const start = selectedPage * EPISODES_PER_PAGE;
		if (filteredEpisodes[start]) {
			const newParams = new URLSearchParams(searchParams);
			newParams.set('episode', filteredEpisodes[start].id);
			router.push(`${pathname}?${encodeURI(newParams.toString())}`);
		}
	}

	function handleNextEpisode() {
		let nextIndex = 0;
		if (currentEpisodeIndex === -1) nextIndex = 0;
		else nextIndex = currentEpisodeIndex + 1;
		if (nextIndex < filteredEpisodes.length) {
			const nextEpisode = filteredEpisodes[nextIndex];
			const newPage = Math.floor(nextIndex / EPISODES_PER_PAGE);
			setCurrentPage(newPage);
			const newParams = new URLSearchParams(searchParams);
			newParams.set('episode', nextEpisode.id);
			router.push(`${pathname}?${encodeURI(newParams.toString())}`);
		}
	}

	const isMovie = type === 'movie';

	return (
		<div className="flex gap-4 flex-col">
			{filteredEpisodes.length > EPISODES_PER_PAGE && (
				<div className="mt-4">
					<Select
						onValueChange={(value) => handleSelectPage(parseInt(value))}
						value={String(currentPage)}
					>
						<SelectTrigger className="h-12 font-bold text-lg p-4 rounded">
							<SelectValue placeholder="Select Episode Page" />
						</SelectTrigger>
						<SelectContent className="p-1">
							{Array.from({ length: totalPages }).map((_, index) => {
								const start = index * EPISODES_PER_PAGE + 1;
								const end = Math.min(
									(index + 1) * EPISODES_PER_PAGE,
									filteredEpisodes.length
								);
								return (
									<SelectItem key={index} value={String(index)}>
										Episodes {start} - {end}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>
			)}

			{!isMovie && (
				<div className="flex justify-between flex-wrap space-y-4">
					<div className="space-x-6 flex">
						<div className="flex items-center gap-2">
							<Switch
								id="hide-fillers"
								checked={hideFillers}
								onCheckedChange={(checked) => setHideFillers(checked)}
							/>
							<label htmlFor="hide-fillers" className="text-sm font-medium">
								Hide Filler Episodes
							</label>
						</div>
						{animeDataFromStorage.added && currentEpisodeId && (
							<div className="flex items-center gap-2">
								<Switch
									id="track-episodes"
									checked={animeDataFromStorage.tracked}
									onCheckedChange={() =>
										animeDataFromStorage.tracked
											? untrackEpisode(animeId)
											: currentEpisodeId &&
												trackEpisode(animeId, currentEpisodeId)
									}
								/>
								<label htmlFor="track-episodes" className="text-sm font-medium">
									Track Episodes
								</label>
							</div>
						)}
					</div>
					<div className="flex justify-end gap-2">
						{storedEpisode && currentEpisodeId !== storedEpisode.id && (
							<Button
								className="rounded"
								onClick={() => handleEpisodeClick(storedEpisode.id)}
							>
								Continue Watching Episode {storedEpisode.number}
							</Button>
						)}
						<Button
							className="rounded"
							onClick={handleNextEpisode}
							disabled={filteredEpisodes.length === 0 || isLastEpisode}
						>
							{currentEpisodeIndex === -1 ? 'Play Episode 1' : 'Next Episode'}
						</Button>
					</div>
				</div>
			)}

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{currentEpisodes.map((episode, index) => (
					<Bounce key={`${currentPage}-${episode.id}`} delay={0.07 + index * 0.03}>
						<div
							onClick={() => handleEpisodeClick(episode.id)}
							className={cn(
								'p-4 h-28 cursor-pointer relative hover:bg-muted duration-200 transition-all ease-in-out flex gap-1 flex-col border rounded',
								currentEpisodeId === episode.id
									? 'bg-primary text-background animate-in duration-200'
									: ''
							)}
						>
							{!isMovie ? (
								<>
									<p className="font-medium text-xs md:text-sm text-base/60">
										Episode {episode.number}
									</p>
									<p className="line-clamp-2 text-sm md:text-base font-bold">
										{episode.title}
									</p>
									{episode.isFiller && (
										<Badge className="absolute text-xs rounded top-1 right-1">
											Filler
										</Badge>
									)}
								</>
							) : (
								<p className="line-clamp-2 font-bold">Play Movie</p>
							)}
						</div>
					</Bounce>
				))}
			</div>

			{filteredEpisodes.length > EPISODES_PER_PAGE && (
				<div className="flex justify-between items-center mt-4">
					<Button
						variant="outline"
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
						disabled={currentPage === 0}
					>
						Previous
					</Button>
					<span>
						Page {currentPage + 1} of {totalPages}
					</span>
					<Button
						variant="outline"
						onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
						disabled={currentPage === totalPages - 1}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
};

export default AnimatedEpisodes;

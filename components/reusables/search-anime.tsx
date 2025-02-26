'use client';
/* eslint-disable @next/next/no-img-element */

import * as React from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { AnimeResult, useLastClicked } from '@/store/useLastClicked';
import { Button } from '../ui/button';

const fetchAnime = async (query: string, signal: AbortSignal): Promise<AnimeResult[]> => {
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

	// Zustand store functions and state
	const lastClicked = useLastClicked((state) => state.lastClicked);
	const removeClicked = useLastClicked((state) => state.removeClicked);
	const clearAll = useLastClicked((state) => state.clearAll);

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
		}
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
			{query.length > 3 ? (
				<div className="">
					{showLoading && <p>Loading...</p>}
					{isError && <p>Error: {error?.message}</p>}
					{results && results.length === 0 && !isLoading && debouncedQuery.length > 3 && (
						<p>No results found.</p>
					)}
					{!!results?.length && (
						<div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3">
							{results?.map((e) => (
								<Link key={e.id} href={`/anime/${e.id}`}>
									<div
										onClick={() => useLastClicked.getState().addClicked(e)}
										className="rounded overflow-hidden group relative aspect-[2/3] ring-2 ring-transparent group-hover:ring-primary bg-muted group-hover:cursor-pointer duration-150"
									>
										<div className="absolute group-hover:cursor-pointer inset-0 group-hover:bg-black/20 bg-none duration-200"></div>
										{e.image && (
											<img
												src={e.image}
												alt=""
												className="w-full border-none h-full aspect-[2/3]"
											/>
										)}
										<Badge className="rounded absolute top-1 right-1">
											{e.type}
										</Badge>
									</div>
								</Link>
							))}
						</div>
					)}

					{isFetching && results && <p>Refreshing...</p>}
				</div>
			) : (
				<div className="">
					{lastClicked.length > 0 ? (
						<div className="flex gap-2 flex-col">
							{lastClicked.length > 0 && (
								<div className="justify-end mb-2 flex">
									<Button size={'sm'} className="w-fit " onClick={clearAll}>
										Clear All
									</Button>
								</div>
							)}
							{lastClicked.map((anime) => (
								<Link key={anime.id} href={`/anime/${anime.id}`}>
									<div
										key={anime.id}
										className="px-3 py-1.5 hover:bg-primary group duration-200 ease-in-out cursor-pointer text-sm border-none  border-2 rounded flex items-center justify-between"
									>
										<span>
											{anime.title} ({anime.type})
										</span>
										<Button
											size={'sm'}
											onClick={() => removeClicked(anime.id)}
											className="text-sm bg-primary-foreground/10 group-hover:bg-background/70 text-primary"
										>
											<X size={'6'} />
										</Button>
									</div>
								</Link>
							))}
						</div>
					) : null}
				</div>
			)}
		</div>
	);
}

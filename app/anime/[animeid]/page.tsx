/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Container from '@/components/reusables/container';
import { getAnimeInfo } from '@/lib/fetch';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimeInfo } from '@/lib/type';
import Navbar from '@/components/reusables/navbar';
import { Badge } from '@/components/ui/badge';

import EpisodeRendererSkeleton from '@/components/anime/anime-details/anime-details-skeleton/episode-renderer-skeleton';
import FadeIn from '@/components/reusables/fade-in';
import LibraryButton from '@/components/anime/anime-details/lbrary-button';

const EpisodePlayer = dynamic(() => import('@/components/anime/anime-details/episode-stream'), {
	loading: () => <Skeleton className="h-20 w-full" />,
});

const PaginatedEpisodes = dynamic(
	() => import('@/components/anime/anime-details/episode-renderer'),
	{
		loading: () => <EpisodeRendererSkeleton />,
	}
);

export type paramsType = Promise<{ animeid: string }>;

export async function generateMetadata({ params }: { params: { animeid: string } }) {
	const data: AnimeInfo = await getAnimeInfo(params.animeid);

	return {
		title: data.title,
		description: data.description,
		openGraph: {
			title: data.title,
			description: data.description,
			images: [
				{
					url: data.image,
					width: 800,
					height: 600,
					alt: data.title,
				},
			],
			// Optionally specify the type depending on the content (movie, series, etc.)
			type: data.type === 'movie' ? 'video.movie' : 'video.episode',
		},
		twitter: {
			card: 'summary_large_image',
			title: data.title,
			description: data.description,
			images: [data.image],
		},
	};
}

export default async function PhotoPage(props: { params: paramsType }) {
	const { animeid } = await props.params;
	const data: AnimeInfo = await getAnimeInfo(animeid);

	return (
		<Container>
			<Navbar />
			<FadeIn>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
					<div className="md:col-span-1 w-7/12 md:w-full mx-auto md:aspect-[3/4] flex justify-center">
						<img
							src={data.image}
							alt={data.title}
							className="h-fit object-contain rounded shadow-lg"
						/>
					</div>
					<div className="md:col-span-2 flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<h1 className="text-xl md:text-3xl font-bold">{data.title}</h1>
							{data.japaneseTitle && (
								<h2 className="text-md md:text-xl text-gray-500">
									{data.japaneseTitle}
								</h2>
							)}
						</div>
						<div className="flex flex-wrap gap-2">
							<Badge>{data.type}</Badge>
							<Badge>{data.status}</Badge>
							<Badge>{data.season}</Badge>
							{data.type !== 'movie' && <Badge>Episodes: {data.totalEpisodes}</Badge>}
						</div>
						<div className="flex flex-wrap gap-2">
							{data.genres.map((genre) => (
								<Badge variant="secondary" color="secondary" key={genre}>
									{genre}
								</Badge>
							))}
						</div>

						<p className="text-muted-foreground text-sm md:text-lg line-clamp-4">
							{data.description}
						</p>
						<LibraryButton animeId={data.id} />
					</div>
				</div>
			</FadeIn>

			<Suspense fallback={<Skeleton className="h-20 w-full" />}>
				<FadeIn>
					<EpisodePlayer episodes={data.episodes} />
				</FadeIn>
			</Suspense>
			<Suspense fallback={<EpisodeRendererSkeleton />}>
				<FadeIn>
					<PaginatedEpisodes
						type={data.type.toLowerCase()}
						animeId={data.id}
						episodes={data.episodes}
					/>
				</FadeIn>
			</Suspense>
		</Container>
	);
}

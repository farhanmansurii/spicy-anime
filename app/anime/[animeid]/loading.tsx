import Container from '@/components/reusables/container';
import Navbar from '@/components/reusables/navbar';

import AnimeDetailsSkeleton from '@/components/anime/anime-details/anime-details-skeleton/anime-details-skeleton';
import EpisodeRendererSkeleton from '@/components/anime/anime-details/anime-details-skeleton/episode-renderer-skeleton';

export default function LoaderPage() {
	return (
		<Container>
			<Navbar />
			<AnimeDetailsSkeleton />
			<EpisodeRendererSkeleton />
		</Container>
	);
}

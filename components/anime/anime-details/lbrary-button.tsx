'use client';
import { Button } from '@/components/ui/button';
import { useLibraryStore } from '@/store/useEpisodeStore';
import { Heart, X } from 'lucide-react';

export default function LibraryButton({ animeId }: { animeId: string }) {
	const { items, addToLibrary, removeFromLibrary } = useLibraryStore();

	const isAdded = items[animeId]?.added || false;

	return (
		<div>
			{isAdded ? (
				<Button
					size="sm"
					className="rounded"
					variant={'outline'}
					onClick={() => removeFromLibrary(animeId)}
				>
					<X />
					Remove From Library
				</Button>
			) : (
				<Button size="sm" className="rounded" onClick={() => addToLibrary(animeId)}>
					<Heart />
					Add to Library
				</Button>
			)}
			{/* {isAdded && (
				<>
					{isTracked ? (
						<>
							<p>Currently tracking episode: {currentEpisode}</p>
							<Button size={'sm'} onClick={() => untrackEpisode(animeId)}>
								Stop Tracking
							</Button>
						</>
					) : (
						<Button size={'sm'} onClick={() => trackEpisode(animeId, '1')}>
							Track Episode 1
						</Button>
					)}
				</>
			)} */}
		</div>
	);
}

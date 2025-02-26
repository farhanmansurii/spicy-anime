import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function AnimeDetailsSkeleton() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
			<div className="md:col-span-1  w-7/12 md:w-full aspect-[3/4] bg-muted rounded-lg mx-auto flex justify-center"></div>
			<div className="md:col-span-2 flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-8 w-3/4" />
					<Skeleton className="h-6 w-1/2" />
				</div>
				<div className="flex flex-wrap gap-2">
					<Skeleton className="h-6 w-20 rounded" />
					<Skeleton className="h-6 w-14 rounded" />
					<Skeleton className="h-6 w-16 rounded" />
					<Skeleton className="h-6 w-24 rounded" />
				</div>
				<div className="flex flex-wrap gap-2">
					<Skeleton className="h-6 w-24 rounded" />
					<Skeleton className="h-6 w-14 rounded" />
					<Skeleton className="h-6 w-20 rounded" />
					<Skeleton className="h-6 w-16 rounded" />
				</div>

				<Skeleton className="h-20 w-full" />
			</div>
		</div>
	);
}

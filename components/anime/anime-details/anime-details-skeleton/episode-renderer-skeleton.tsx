import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import React from 'react';

export default function EpisodeRendererSkeleton() {
	return (
		<div className="flex gap-4 flex-col">
			<div className="mt-4">
				<Select disabled>
					<SelectTrigger className="h-12 font-bold text-lg p-4 rounded">
						<SelectValue placeholder="Select Episode Page" />
					</SelectTrigger>
					<SelectContent className="p-1">
						{Array.from({ length: 1 }).map((_, index) => {
							const start = index * 20 + 1;
							const end = Math.min((index + 1) * 20, 100);
							return (
								<SelectItem key={index} value={String(index)}>
									Episodes {start} - {end}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
			</div>
			<div className="flex justify-between">
				<div className="flex items-center gap-2">
					<Switch id="hide-fillers" checked={false} />
					<label htmlFor="hide-fillers" className="text-sm font-medium">
						Hide Filler Episodes
					</label>
				</div>
				<div className="flex justify-end">
					<Button disabled={true}>Play Episode 1</Button>
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 24 }).map((_, index) => (
					<div key={index}>
						<div
							className={
								'p-4 h-28 cursor-pointer text-transparent  flex gap-1 flex-col border rounded'
							}
						>
							<>
								<p className="font-medium rounded w-fit bg-muted text-xs  md:text-sm text-base/60">
									Episode 1
								</p>
								<p className="line-clamp-2 rounded bg-muted  text-sm md:text-base font-bold">
									SpicyAnime
								</p>
							</>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

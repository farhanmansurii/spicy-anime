/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider, SeekButton, Track } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { Forward } from 'lucide-react';
import { EpisodeStream } from '@/lib/fetch';
import { Episode } from '@/lib/type';

interface EpisodeRenderProps {
	playerData: EpisodeStream;
	activeEpisode: Episode;
}

const EpisodeRender: React.FC<EpisodeRenderProps> = ({ playerData, activeEpisode }) => {
	const { sources, intro, outro, subtitles } = playerData;

	if (!sources || sources.length === 0) {
		return <div>No source available</div>;
	}

	// const thumbnailsSubtitle = subtitles?.find((s) => s.lang.toLowerCase() === 'thumbnails');
	const textSubtitles = subtitles?.filter((s) => s.lang.toLowerCase() !== 'thumbnails');

	return (
		<MediaPlayer
			title={`Episode ${activeEpisode.number}: ${activeEpisode.title}`}
			src={{
				src: `https://m3u8-proxy-liard.vercel.app/m3u8-proxy?url=${sources[0].url}`,
				type: 'application/x-mpegurl',
			}}
		>
			<MediaProvider
				{...({
					config: {
						hls: {
							xhrSetup: (xhr: XMLHttpRequest) => {
								// Browsers forbid modifying the native "User-Agent" header,
								// so we set a custom header instead.
								xhr.setRequestHeader(
									'X-User-Agent',
									'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
								);
							},
						},
					},
				} as any)}
			/>

			{textSubtitles && textSubtitles.length > 0 && (
				<>
					{textSubtitles.map((subtitle, index) => (
						<Track
							key={`subtitle-${index}`}
							kind="subtitles"
							src={subtitle.url}
							label={subtitle.lang}
							lang={subtitle.lang}
						/>
					))}
				</>
			)}

			<DefaultVideoLayout icons={defaultLayoutIcons} />
		</MediaPlayer>
	);
};

export default EpisodeRender;

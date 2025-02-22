"use client";
import React from "react";
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';

interface Source {
    url: string;
    title: string;
    quality: string;
}

interface EpisodeRenderProps {
    sources: Source[];
}

const EpisodeRender: React.FC<EpisodeRenderProps> = ({ sources }) => {
    if (!sources || sources.length === 0) {
        return <div>No source available</div>;
    }
    return (
        <MediaPlayer title="Sprite Fight" src={'https://cors.consumet.stream/' + sources[0].url}>
            <MediaProvider />
            <PlyrLayout icons={plyrLayoutIcons} />
        </MediaPlayer>
    );
};

export default EpisodeRender;

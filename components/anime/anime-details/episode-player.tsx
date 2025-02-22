"use client";
import React, { useState } from "react";
import Player from "@oplayer/react";
import hls from "@oplayer/hls";
import ui from "@oplayer/ui";

interface EpisodeRenderProps {
    sources: { url: string; title: string }[];
}

const plugins = [
    ui({
        pictureInPicture: true,
        screenshot: true,
        keyboard: { global: true },
    }),
    hls(),
];

const EpisodeRender: React.FC<EpisodeRenderProps> = ({ sources }) => {
    const [selectedSource, setSelectedSource] = useState(sources[0]?.url || "");

    const handleSourceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSource(event.target.value);
    };

    if (!sources || sources.length === 0) return null;

    return (
        <div className="shadow-md rounded-md overflow-hidden my-4">
            {sources.length > 1 && (
                <select
                    value={selectedSource}
                    onChange={handleSourceChange}
            >
                    {sources.map((source, index) => (
                        <option key={index} value={source.url}>
                            {source.title || `Source ${index + 1}`}
                        </option>
                    ))}
                </select>
            )}

            <Player
                plugins={plugins}
                source={{
                    title: "Oppenheimer",
                    src: selectedSource,
                }}
                onEvent={(e) => console.log(e)}
            />

        </div>
    );
};

export default EpisodeRender;

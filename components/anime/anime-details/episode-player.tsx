import React, { useRef } from "react";
import ReactHlsPlayer from "react-hls-player";

interface Source {
    url: string;
    title: string;
    quality: string;
}

interface EpisodeRenderProps {
    sources: Source[];
}

const EpisodeRender: React.FC<EpisodeRenderProps> = ({ sources }) => {

    const playerRef = useRef<HTMLVideoElement>(null!);
    if (!sources || sources.length === 0) {
        return <div>No source available</div>;
    }
    return (
        <div className="w-full aspect-video">
            <ReactHlsPlayer
                playerRef={playerRef}
                src={sources[0].url}
                autoPlay={false}
                controls={true}
                width="100%"
                height="auto"
            />
        </div>
    );
};

export default EpisodeRender;

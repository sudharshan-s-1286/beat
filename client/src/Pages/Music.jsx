import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Spin, message, Badge } from 'antd';
import { SearchOutlined, InfoCircleOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';

const Music = () => {
    const [searchKey, setSearchKey] = useState('');
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [playingTrack, setPlayingTrack] = useState(null);

    // Search Handler (Jamendo)
    const searchTracks = async (e) => {
        e.preventDefault();

        if (!searchKey.trim()) {
            message.warning("Please enter a song name");
            return;
        }

        setLoading(true);
        setPlayingTrack(null); // Stop playing when new search
        console.log("Searching for:", searchKey);

        try {
            // Call our backend proxy
            const { data } = await axios.get('http://localhost:5000/api/jamendo/search', {
                params: { q: searchKey }
            });

            console.log("Search Results:", data.results);
            setTracks(data.results);

            if (!data.results || data.results.length === 0) {
                message.info("No tracks found");
            }
        } catch (error) {
            console.error("Search Error:", error);
            message.error("Error searching tracks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-4 animate-pulse">
                        BEAT Music
                    </h1>
                    <p className="text-gray-400 text-lg">Stream full songs powered by Jamendo</p>
                </header>

                {/* Search Bar */}
                <div className="flex justify-center mb-12">
                    <form onSubmit={searchTracks} className="flex gap-4 w-full max-w-xl relative">
                        <Input
                            size="large"
                            placeholder="Search for songs or artists..."
                            prefix={<SearchOutlined className="text-gray-400" />}
                            className="rounded-full bg-neutral-800 border-none text-white hover:bg-neutral-800 focus:bg-neutral-800 placeholder-gray-500"
                            style={{ backgroundColor: '#262626', color: 'white', borderColor: '#404040' }}
                            onChange={(e) => setSearchKey(e.target.value)}
                            value={searchKey}
                        />
                        <Button
                            type="primary"
                            size="large"
                            shape="circle"
                            onClick={searchTracks}
                            icon={<SearchOutlined />}
                            className="bg-violet-600 hover:bg-violet-500 border-none w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-violet-500/50 transition-all"
                        />
                    </form>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center mt-20">
                        <Spin size="large" tip="Loading tracks..." />
                    </div>
                )}

                {/* Tracks Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {tracks.map(track => {
                            const isPlaying = playingTrack === track.id;

                            return (
                                <div
                                    key={track.id}
                                    className="bg-neutral-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-neutral-800 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl border border-transparent hover:border-violet-500/30 flex flex-col"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-square w-full group-hover:opacity-100 transition-opacity">
                                        {track.album_image ? (
                                            <img
                                                className="w-full h-full object-cover"
                                                src={track.album_image}
                                                alt={track.name}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-gray-500">
                                                No Image
                                            </div>
                                        )}

                                        {/* Play Overlay (appears on hover) */}
                                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${isPlaying ? 'opacity-100' : ''}`}>
                                            {/* We don't need a custom button to trigger audio, we use the native controls below, 
                                                but for visual flair we can show an icon. 
                                                Actually, let's keep it simple and rely on the native player below the image. 
                                             */}
                                        </div>

                                        <div className="absolute top-2 right-2">
                                            <Badge count="Full Song" style={{ backgroundColor: '#8b5cf6' }} />
                                        </div>
                                    </div>

                                    {/* Info & Player */}
                                    <div className="p-5 flex flex-col flex-grow justify-between">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-lg truncate text-white mb-1" title={track.name}>
                                                {track.name}
                                            </h3>
                                            <p className="text-gray-400 truncate text-sm font-medium">
                                                {track.artist_name}
                                            </p>
                                        </div>

                                        <div className="mt-auto">
                                            {track.audio ? (
                                                <audio
                                                    controls
                                                    className="w-full h-8 rounded bg-gray-100"
                                                    src={track.audio}
                                                    onPlay={() => setPlayingTrack(track.id)}
                                                    // Ensure only one track plays at a time (basic logic)
                                                    onPause={() => setPlayingTrack(null)}
                                                >
                                                    Your browser does not support the audio element.
                                                </audio>
                                            ) : (
                                                <div className="flex items-center justify-center bg-neutral-700/50 rounded py-2 text-gray-400 text-sm">
                                                    <InfoCircleOutlined className="mr-2" />
                                                    Stream not available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {tracks.length === 0 && !loading && (
                    <div className="text-center text-gray-600 mt-20">
                        <p className="text-xl">Search for your favorite songs to start listening.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Music;

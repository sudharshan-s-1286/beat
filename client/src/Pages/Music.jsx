import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Button, Input, Spin, message, Badge, Select } from 'antd';
import { SearchOutlined, PlayCircleFilled, PauseCircleFilled, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { PlayerContext } from '../Context/PlayerContext';

const { Option } = Select;

const Music = () => {
    const [searchKey, setSearchKey] = useState('');
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('popularity_total'); // Default sort
    const [favoriteIds, setFavoriteIds] = useState(new Set()); // Store IDs of favorite tracks
    const [loadingFavoriteId, setLoadingFavoriteId] = useState(null); // Track ID currently being added

    // Global Player Context
    const { playTrack, currentTrack, isPlaying } = useContext(PlayerContext);

    // Fetch User Favorites on Mount
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const { data } = await axios.get('http://localhost:5000/api/playlist', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Set initial favorites
                const ids = new Set(data.map(t => t.id));
                setFavoriteIds(ids);
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };
        fetchFavorites();
    }, []);

    // Search Handler (Jamendo)
    const searchTracks = async (e) => {
        if (e) e.preventDefault();

        if (!searchKey.trim()) {
            message.warning("Please enter a song name");
            return;
        }

        setLoading(true);
        try {
            // Call our backend proxy
            const { data } = await axios.get('http://localhost:5000/api/jamendo/search', {
                params: {
                    q: searchKey,
                    order: sortBy
                }
            });
            setTracks(data.results || []);

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

    // Add to Favorites Handler
    const addToFavorites = async (e, track) => {
        e.stopPropagation(); // Prevent triggering play

        if (favoriteIds.has(track.id)) {
            message.warning("Song already in favorites");
            return;
        }

        setLoadingFavoriteId(track.id);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                message.error("Please sign in to add favorites");
                return;
            }

            await axios.post('http://localhost:5000/api/playlist/add', { track }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update local state
            setFavoriteIds(prev => new Set(prev).add(track.id));
            message.success("Added to favorites ❤️");

        } catch (error) {
            console.error("Add Favorite Error:", error);
            message.error("Failed to add favorite");
        } finally {
            setLoadingFavoriteId(null);
        }
    };

    // Triggered when sort option changes
    const handleSortChange = (value) => {
        setSortBy(value);
        if (searchKey.trim()) {
            setTimeout(() => document.querySelector('.search-btn')?.click(), 100);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-10 font-sans pb-32">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4 animate-pulse">
                        BEAT Music
                    </h1>
                    <p className="text-gray-400 text-lg">Stream full songs powered by Jamendo</p>
                </header>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row justify-center gap-4 mb-12 items-center">
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
                            className="search-btn bg-green-600 hover:bg-green-500 border-none w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-all"
                        />
                    </form>

                    {/* Sort Dropdown */}
                    <Select
                        defaultValue="popularity_total"
                        style={{ width: 160 }}
                        onChange={handleSortChange}
                        className="custom-select"
                        classNames={{ popup: "bg-neutral-800" }}
                        styles={{ popup: { backgroundColor: '#262626', color: 'white' } }}
                    >
                        <Option value="popularity_total">Popularity</Option>
                        <Option value="releasedate">Release Date</Option>
                        <Option value="name">Name</Option>
                        <Option value="duration">Duration</Option>
                    </Select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center mt-20">
                        <Spin size="large" />
                        <p className="mt-4 text-gray-400">Loading tracks...</p>
                    </div>
                )}

                {/* Tracks Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {tracks.map(track => {
                            const isCurrentTrack = currentTrack?.id === track.id;
                            const isTrackPlaying = isCurrentTrack && isPlaying;
                            const isFavorite = favoriteIds.has(track.id);
                            const isAdding = loadingFavoriteId === track.id;

                            return (
                                <div
                                    key={track.id}
                                    className={`bg-neutral-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-neutral-800 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl border ${isCurrentTrack ? 'border-green-500' : 'border-transparent'} hover:border-green-500/30 flex flex-col cursor-pointer relative`}
                                    onClick={() => playTrack(track)}
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-square w-full">
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

                                        {/* Play Overlay */}
                                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${isTrackPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            {isTrackPlaying ? (
                                                <PauseCircleFilled className="text-5xl text-green-500 bg-white rounded-full" />
                                            ) : (
                                                <PlayCircleFilled className="text-5xl text-green-500 bg-white rounded-full" />
                                            )}
                                        </div>

                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <Badge count="Full Song" style={{ backgroundColor: '#1db954' }} />
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-5 flex flex-col flex-grow justify-between">
                                        <div className="mb-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`font-bold text-lg truncate mb-1 flex-1 ${isCurrentTrack ? 'text-green-400' : 'text-white'}`} title={track.name}>
                                                    {track.name}
                                                </h3>

                                                {/* Heart Button */}
                                                <button
                                                    onClick={(e) => addToFavorites(e, track)}
                                                    disabled={isFavorite || isAdding}
                                                    className={`ml-2 transform hover:scale-110 transition-transform ${isFavorite ? 'cursor-default' : 'cursor-pointer hover:text-green-500'}`}
                                                >
                                                    {isAdding ? (
                                                        <Spin size="small" />
                                                    ) : isFavorite ? (
                                                        <HeartFilled className="text-green-500 text-xl" />
                                                    ) : (
                                                        <HeartOutlined className="text-gray-400 hover:text-white text-xl" />
                                                    )}
                                                </button>
                                            </div>

                                            <p className="text-gray-400 truncate text-sm font-medium">
                                                {track.artist_name}
                                            </p>
                                        </div>

                                        {/* Basic details */}
                                        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                                            <span>Duration: {Math.floor(track.duration / 60)}:{('0' + (track.duration % 60)).slice(-2)}</span>
                                            {isCurrentTrack && <span className="text-green-500 animate-pulse">Now Playing</span>}
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

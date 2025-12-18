import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Spin, message, Badge } from 'antd';
import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';

const Music = () => {
    const [token, setToken] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showOnlyPreviews, setShowOnlyPreviews] = useState(false);

    const navigate = useNavigate();

    // 1. Fetch Spotify Token
    useEffect(() => {
        const checkAuthAndGetSpotifyToken = async () => {
            const userToken = localStorage.getItem('token');
            console.log("Checking for JWT Token in localStorage:", userToken);

            if (!userToken) {
                message.error('Please login to access music');
                navigate('/signin');
                return;
            }

            try {
                // Send the JWT in Authorization header to backend
                const response = await axios.get('http://localhost:5000/api/spotify/token', {
                    headers: {
                        'Authorization': userToken
                    }
                });

                if (response.data && response.data.access_token) {
                    console.log("Spotify Access Token received:", response.data.access_token);
                    setToken(response.data.access_token);
                } else {
                    console.error("No access token in response:", response.data);
                    message.error("Failed to retrieve Spotify access");
                }
            } catch (error) {
                console.error("Error fetching Spotify token:", error);
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    message.error("Session expired. Please login again.");
                    localStorage.removeItem('token');
                    navigate('/signin');
                } else {
                    message.error("Service unavailable. Please try again later.");
                }
            }
        };

        checkAuthAndGetSpotifyToken();
    }, [navigate]);

    // 2. Search Handler
    const searchArtists = async (e) => {
        e.preventDefault();

        if (!token) {
            message.warning("Still connecting to Spotify... please wait");
            return;
        }
        if (!searchKey.trim()) {
            message.warning("Please enter a song name");
            return;
        }

        setLoading(true);
        console.log("Searching for:", searchKey, "using Token:", token);

        try {
            const { data } = await axios.get("https://api.spotify.com/v1/search", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    q: searchKey,
                    type: "track",
                    limit: 12
                }
            });

            console.log("Search Results:", data.tracks.items);
            setTracks(data.tracks.items);

            if (data.tracks.items.length === 0) {
                message.info("No tracks found");
            }
        } catch (error) {
            console.error("Search Error:", error);
            if (error.response && error.response.status === 401) {
                message.error("Spotify token expired. Refreshing page...");
                window.location.reload();
            } else {
                message.error("Error searching tracks");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-4 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4 animate-pulse">
                        Beat Music
                    </h1>
                    <p className="text-gray-400 text-lg">Search and preview top tracks via Spotify</p>
                </header>

                {/* Search Bar */}
                <div className="flex justify-center mb-8">
                    <form onSubmit={searchArtists} className="flex gap-4 w-full max-w-xl relative">
                        <Input
                            size="large"
                            placeholder="Song or Artist..."
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
                            onClick={searchArtists}
                            icon={<SearchOutlined />}
                            className="bg-green-500 hover:bg-green-400 border-none w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-all"
                        />
                    </form>
                </div>

                {/* Filter Button */}
                <div className="flex justify-center mb-8">
                    <Button
                        type={showOnlyPreviews ? "primary" : "default"}
                        onClick={() => setShowOnlyPreviews(!showOnlyPreviews)}
                        className={`${showOnlyPreviews ? "bg-green-600 border-none" : "bg-neutral-800 text-white border-neutral-600 hover:text-green-500 hover:border-green-500"}`}
                        shape="round"
                    >
                        {showOnlyPreviews ? "Showing Only Playable Tracks" : "Show All Tracks"}
                    </Button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center mt-20">
                        <Spin size="large" tip="Loading tracks..." />
                    </div>
                )}

                {/* Tracks Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {tracks
                            .filter(track => !showOnlyPreviews || track.preview_url)
                            .map(track => {
                                const hasPreview = !!track.preview_url;
                                return (
                                    <div
                                        key={track.id}
                                        className="bg-neutral-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-neutral-800 transition-all duration-300 group hover:shadow-2xl border border-transparent hover:border-neutral-700 flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-square w-full">
                                            {track.album.images.length ? ( // Check if images exist
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={track.album.images[0].url}
                                                    alt={track.name}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-neutral-700 flex items-center justify-center">No Image</div>
                                            )}

                                            {/* Preview Badge */}
                                            {hasPreview && (
                                                <div className="absolute top-2 right-2">
                                                    <Badge count="Preview Available" style={{ backgroundColor: '#1db954' }} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info & Player */}
                                        <div className="p-4 flex flex-col flex-grow justify-between">
                                            <div className="mb-4">
                                                <h3 className="font-bold text-lg truncate text-white mb-1" title={track.name}>
                                                    {track.name}
                                                </h3>
                                                <p className="text-gray-400 truncate text-sm">
                                                    {track.artists.map(artist => artist.name).join(', ')}
                                                </p>
                                            </div>

                                            <div>
                                                {hasPreview ? (
                                                    // Native HTML5 Audio Player as requested
                                                    <audio
                                                        controls
                                                        className="w-full h-8 mt-2 rounded"
                                                        controlsList="nodownload" // Optional: prevents download button
                                                    >
                                                        <source src={track.preview_url} type="audio/mpeg" />
                                                        Your browser does not support the audio element.
                                                    </audio>
                                                ) : (
                                                    <div className="flex items-center justify-center bg-neutral-700/50 rounded py-2 text-gray-400 text-sm">
                                                        <InfoCircleOutlined className="mr-2" />
                                                        Preview not available
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

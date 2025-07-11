'use client';

import { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon,
  FilmIcon,
  MusicalNoteIcon,
  TvIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import ReactPlayer from 'react-player';

interface MediaItem {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'music' | 'video';
  thumbnail: string;
  duration?: string;
  year?: number;
  genre?: string[];
  description?: string;
  url?: string;
  artist?: string;
  album?: string;
}

const mockMediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'Sample Movie',
    type: 'movie',
    thumbnail: 'https://via.placeholder.com/300x450/4F46E5/FFFFFF?text=Movie+1',
    duration: '2h 15m',
    year: 2023,
    genre: ['Action', 'Adventure'],
    description: 'An exciting adventure movie with stunning visuals and compelling storyline.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: '2',
    title: 'Tech Series',
    type: 'tv',
    thumbnail: 'https://via.placeholder.com/300x450/7C3AED/FFFFFF?text=TV+Show',
    duration: '45m per episode',
    year: 2023,
    genre: ['Documentary', 'Technology'],
    description: 'A fascinating look into the world of technology and innovation.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: '3',
    title: 'Ambient Sounds',
    type: 'music',
    thumbnail: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=Music',
    duration: '3:45',
    artist: 'Nature Sounds',
    album: 'Relaxation Collection',
    genre: ['Ambient', 'Relaxation'],
    description: 'Peaceful ambient sounds for relaxation and focus.',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '4',
    title: 'Tutorial Video',
    type: 'video',
    thumbnail: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Tutorial',
    duration: '12:30',
    year: 2023,
    genre: ['Educational'],
    description: 'Learn new skills with this comprehensive tutorial.',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
];

const categories = [
  { id: 'all', name: 'All', icon: FilmIcon },
  { id: 'movie', name: 'Movies', icon: FilmIcon },
  { id: 'tv', name: 'TV Shows', icon: TvIcon },
  { id: 'music', name: 'Music', icon: MusicalNoteIcon },
  { id: 'video', name: 'Videos', icon: PlayIcon },
];

export default function MediaPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(mockMediaItems);

  useEffect(() => {
    // Filter media items based on category and search
    let filtered = mockMediaItems;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.type === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setMediaItems(filtered);
  }, [selectedCategory, searchQuery]);

  const handlePlayMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'movie': return FilmIcon;
      case 'tv': return TvIcon;
      case 'music': return MusicalNoteIcon;
      default: return PlayIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Media Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Stream your favorite movies, TV shows, music, and videos
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={clsx(
                    'flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    selectedCategory === category.id
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Media Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {mediaItems.map((item) => {
                const Icon = getMediaIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className="group cursor-pointer"
                    onClick={() => handlePlayMedia(item)}
                  >
                    <div className="relative aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <PlayIcon className="w-6 h-6 text-gray-900 ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2">
                        <div className="bg-black bg-opacity-70 rounded-full p-1">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      {item.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {item.duration}
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {item.title}
                    </h3>
                    {item.artist && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {item.artist}
                      </p>
                    )}
                    {item.year && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.year}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Media Player */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {selectedMedia ? (
                  <>
                    <div className="aspect-video bg-black">
                      <ReactPlayer
                        url={selectedMedia.url}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        controls={true}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedMedia.title}
                      </h3>
                      {selectedMedia.artist && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          by {selectedMedia.artist}
                        </p>
                      )}
                      {selectedMedia.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          {selectedMedia.description}
                        </p>
                      )}
                      {selectedMedia.genre && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedMedia.genre.map((g) => (
                            <span
                              key={g}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={togglePlayPause}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {isPlaying ? (
                            <PauseIcon className="w-4 h-4 mr-2" />
                          ) : (
                            <PlayIcon className="w-4 h-4 mr-2" />
                          )}
                          {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                            <HeartIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            <ShareIcon className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                            <EllipsisHorizontalIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <FilmIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Select media to play
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Choose from movies, TV shows, music, or videos
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Integration Notice */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start">
            <FilmIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 mr-3" />
            <div>
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Powered by Advanced Media Server
              </h4>
              <p className="text-blue-700 dark:text-blue-200 mb-4">
                Our media center provides seamless streaming with support for multiple formats, 
                transcoding, and remote access. Enjoy your content anywhere, anytime.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong className="text-blue-900 dark:text-blue-100">Formats:</strong>
                  <p className="text-blue-700 dark:text-blue-200">MP4, MKV, AVI, MP3, FLAC</p>
                </div>
                <div>
                  <strong className="text-blue-900 dark:text-blue-100">Quality:</strong>
                  <p className="text-blue-700 dark:text-blue-200">Up to 4K HDR</p>
                </div>
                <div>
                  <strong className="text-blue-900 dark:text-blue-100">Devices:</strong>
                  <p className="text-blue-700 dark:text-blue-200">All platforms</p>
                </div>
                <div>
                  <strong className="text-blue-900 dark:text-blue-100">Features:</strong>
                  <p className="text-blue-700 dark:text-blue-200">Offline sync, Subtitles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { 
  PhotoIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  HeartIcon,
  ShareIcon,
  DownloadIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FaceSmileIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  date: string;
  location?: string;
  tags: string[];
  faces?: string[];
  size: string;
  camera?: string;
  liked: boolean;
}

const mockPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://picsum.photos/800/600?random=1',
    thumbnail: 'https://picsum.photos/300/300?random=1',
    title: 'Mountain Landscape',
    date: '2023-12-01',
    location: 'Rocky Mountains',
    tags: ['landscape', 'mountains', 'nature'],
    faces: [],
    size: '2.4 MB',
    camera: 'Canon EOS R5',
    liked: false
  },
  {
    id: '2',
    url: 'https://picsum.photos/800/600?random=2',
    thumbnail: 'https://picsum.photos/300/300?random=2',
    title: 'City Skyline',
    date: '2023-11-28',
    location: 'New York City',
    tags: ['city', 'architecture', 'skyline'],
    faces: [],
    size: '3.1 MB',
    camera: 'Sony A7R IV',
    liked: true
  },
  {
    id: '3',
    url: 'https://picsum.photos/800/600?random=3',
    thumbnail: 'https://picsum.photos/300/300?random=3',
    title: 'Beach Sunset',
    date: '2023-11-25',
    location: 'Malibu Beach',
    tags: ['sunset', 'beach', 'ocean'],
    faces: [],
    size: '1.8 MB',
    camera: 'iPhone 15 Pro',
    liked: false
  },
  {
    id: '4',
    url: 'https://picsum.photos/800/600?random=4',
    thumbnail: 'https://picsum.photos/300/300?random=4',
    title: 'Forest Path',
    date: '2023-11-20',
    location: 'Redwood National Park',
    tags: ['forest', 'trees', 'path'],
    faces: [],
    size: '2.7 MB',
    camera: 'Nikon D850',
    liked: true
  },
  {
    id: '5',
    url: 'https://picsum.photos/800/600?random=5',
    thumbnail: 'https://picsum.photos/300/300?random=5',
    title: 'Urban Street',
    date: '2023-11-15',
    location: 'Tokyo',
    tags: ['street', 'urban', 'night'],
    faces: [],
    size: '2.2 MB',
    camera: 'Fujifilm X-T5',
    liked: false
  },
  {
    id: '6',
    url: 'https://picsum.photos/800/600?random=6',
    thumbnail: 'https://picsum.photos/300/300?random=6',
    title: 'Desert Dunes',
    date: '2023-11-10',
    location: 'Sahara Desert',
    tags: ['desert', 'sand', 'dunes'],
    faces: [],
    size: '3.5 MB',
    camera: 'Canon EOS R6',
    liked: true
  },
];

const viewModes = [
  { id: 'grid', name: 'Grid', icon: Squares2X2Icon },
  { id: 'masonry', name: 'Masonry', icon: ViewColumnsIcon },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>(mockPhotos);

  useEffect(() => {
    let filtered = photos;
    
    if (searchQuery) {
      filtered = filtered.filter(photo =>
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredPhotos(filtered);
  }, [photos, searchQuery]);

  const toggleLike = (photoId: string) => {
    setPhotos(photos.map(photo =>
      photo.id === photoId ? { ...photo, liked: !photo.liked } : photo
    ));
  };

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (!selectedPhoto) return;
    
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredPhotos.length - 1;
    } else {
      newIndex = currentIndex < filteredPhotos.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Photo Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            AI-powered photo management with smart organization and search
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filter
            </button>
            
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {viewModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={clsx(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      viewMode === mode.id
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {mode.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className={clsx(
          'grid gap-4',
          viewMode === 'grid' 
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
        )}>
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative cursor-pointer"
              onClick={() => openLightbox(photo)}
            >
              <div className={clsx(
                'relative overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700',
                viewMode === 'grid' ? 'aspect-square' : 'aspect-[4/5]'
              )}>
                <img
                  src={photo.thumbnail}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
                
                {/* Overlay Controls */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(photo.id);
                    }}
                    className={clsx(
                      'p-2 rounded-full backdrop-blur-sm transition-colors',
                      photo.liked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-black bg-opacity-50 text-white hover:bg-red-500'
                    )}
                  >
                    <HeartIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Photo Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <h3 className="text-white font-medium text-sm truncate">
                    {photo.title}
                  </h3>
                  {photo.location && (
                    <p className="text-gray-300 text-xs flex items-center mt-1">
                      <MapPinIcon className="w-3 h-3 mr-1" />
                      {photo.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Navigation */}
              <button
                onClick={() => navigatePhoto('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => navigatePhoto('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              {/* Image */}
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-w-full max-h-full object-contain"
              />

              {/* Photo Details */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{selectedPhoto.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {new Date(selectedPhoto.date).toLocaleDateString()}
                      </div>
                      {selectedPhoto.location && (
                        <div className="flex items-center">
                          <MapPinIcon className="w-4 h-4 mr-2" />
                          {selectedPhoto.location}
                        </div>
                      )}
                      <div>Size: {selectedPhoto.size}</div>
                      {selectedPhoto.camera && (
                        <div>Camera: {selectedPhoto.camera}</div>
                      )}
                    </div>
                    {selectedPhoto.tags.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2">
                          {selectedPhoto.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => toggleLike(selectedPhoto.id)}
                      className={clsx(
                        'p-2 rounded-full transition-colors',
                        selectedPhoto.liked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-600 text-white hover:bg-red-500'
                      )}
                    >
                      <HeartIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-colors">
                      <ShareIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-colors">
                      <DownloadIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Features Notice */}
        <div className="mt-12 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-start">
            <FaceSmileIcon className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1 mr-3" />
            <div>
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                AI-Powered Photo Management
              </h4>
              <p className="text-purple-700 dark:text-purple-200 mb-4">
                Our advanced AI automatically organizes your photos with facial recognition, 
                object detection, and smart tagging. Find any photo instantly with natural language search.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong className="text-purple-900 dark:text-purple-100">Face Recognition:</strong>
                  <p className="text-purple-700 dark:text-purple-200">Auto-tag people</p>
                </div>
                <div>
                  <strong className="text-purple-900 dark:text-purple-100">Smart Albums:</strong>
                  <p className="text-purple-700 dark:text-purple-200">Auto-organized</p>
                </div>
                <div>
                  <strong className="text-purple-900 dark:text-purple-100">Duplicate Detection:</strong>
                  <p className="text-purple-700 dark:text-purple-200">Save storage</p>
                </div>
                <div>
                  <strong className="text-purple-900 dark:text-purple-100">Backup:</strong>
                  <p className="text-purple-700 dark:text-purple-200">Automatic sync</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
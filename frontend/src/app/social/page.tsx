'use client';

import { useState } from 'react';
import { 
  UserGroupIcon,
  PencilSquareIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  GifIcon,
  FaceSmileIcon,
  MapPinIcon,
  GlobeAltIcon,
  LockClosedIcon,
  UserPlusIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  reposts: number;
  replies: number;
  liked: boolean;
  reposted: boolean;
  images?: string[];
  visibility: 'public' | 'unlisted' | 'private';
}

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  verified?: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Alice Johnson',
      username: '@alice',
      avatar: 'https://picsum.photos/40/40?random=1',
      verified: true
    },
    content: 'Just launched our new unified platform! 🚀 Everything you need in one place - chat, media, AI, and more. The future of digital collaboration is here! #NovaStack #Innovation',
    timestamp: '2h',
    likes: 42,
    reposts: 12,
    replies: 8,
    liked: false,
    reposted: false,
    visibility: 'public'
  },
  {
    id: '2',
    author: {
      name: 'Bob Smith',
      username: '@bob_dev',
      avatar: 'https://picsum.photos/40/40?random=2'
    },
    content: 'The AI assistant feature is incredible! Just helped me debug a complex issue in minutes. This is the future of development tools.',
    timestamp: '4h',
    likes: 28,
    reposts: 6,
    replies: 15,
    liked: true,
    reposted: false,
    images: ['https://picsum.photos/400/300?random=3'],
    visibility: 'public'
  },
  {
    id: '3',
    author: {
      name: 'Carol Wilson',
      username: '@carol_design',
      avatar: 'https://picsum.photos/40/40?random=4',
      verified: true
    },
    content: 'Love the seamless integration between all the services. No more switching between dozens of apps! The UX is absolutely beautiful 💫',
    timestamp: '6h',
    likes: 67,
    reposts: 23,
    replies: 12,
    liked: true,
    reposted: true,
    visibility: 'public'
  }
];

const suggestedUsers: User[] = [
  {
    id: '1',
    name: 'David Chen',
    username: '@david_tech',
    avatar: 'https://picsum.photos/40/40?random=5',
    bio: 'Full-stack developer passionate about open source',
    followers: 1234,
    following: 567,
    verified: true
  },
  {
    id: '2',
    name: 'Emma Rodriguez',
    username: '@emma_ai',
    avatar: 'https://picsum.photos/40/40?random=6',
    bio: 'AI researcher and machine learning enthusiast',
    followers: 2345,
    following: 432
  },
  {
    id: '3',
    name: 'Frank Miller',
    username: '@frank_startup',
    avatar: 'https://picsum.photos/40/40?random=7',
    bio: 'Entrepreneur building the future',
    followers: 987,
    following: 234
  }
];

export default function SocialPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [postVisibility, setPostVisibility] = useState<'public' | 'unlisted' | 'private'>('public');

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleRepost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
            ...post,
            reposted: !post.reposted,
            reposts: post.reposted ? post.reposts - 1 : post.reposts + 1
          }
        : post
    ));
  };

  const handlePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'You',
        username: '@you',
        avatar: 'https://picsum.photos/40/40?random=0'
      },
      content: newPost,
      timestamp: 'now',
      likes: 0,
      reposts: 0,
      replies: 0,
      liked: false,
      reposted: false,
      visibility: postVisibility
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return GlobeAltIcon;
      case 'unlisted': return LockClosedIcon;
      case 'private': return LockClosedIcon;
      default: return GlobeAltIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Social Network
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Decentralized social platform with privacy-focused features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Navigation */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <nav className="space-y-2">
                <a href="#" className="flex items-center px-3 py-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <UserGroupIcon className="w-5 h-5 mr-3" />
                  Timeline
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <BellIcon className="w-5 h-5 mr-3" />
                  Notifications
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
                  Explore
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <ChatBubbleOvalLeftIcon className="w-5 h-5 mr-3" />
                  Messages
                </a>
              </nav>
            </div>

            {/* Suggested Users */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Suggested for you
              </h3>
              <div className="space-y-4">
                {suggestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {user.name}
                          </p>
                          {user.verified && (
                            <span className="ml-1 text-blue-500">✓</span>
                          )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {user.username}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors">
                      <UserPlusIcon className="w-3 h-3 mr-1" />
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Compose Post */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex space-x-3">
                <img
                  src="https://picsum.photos/40/40?random=0"
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="What's happening?"
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                        <PhotoIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                        <GifIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                        <FaceSmileIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                        <MapPinIcon className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <select
                        value={postVisibility}
                        onChange={(e) => setPostVisibility(e.target.value as any)}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="public">Public</option>
                        <option value="unlisted">Unlisted</option>
                        <option value="private">Private</option>
                      </select>
                      <button
                        onClick={handlePost}
                        disabled={!newPost.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => {
                const VisibilityIcon = getVisibilityIcon(post.visibility);
                return (
                  <div
                    key={post.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex space-x-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {post.author.name}
                            </h3>
                            {post.author.verified && (
                              <span className="text-blue-500">✓</span>
                            )}
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {post.author.username}
                            </span>
                            <span className="text-gray-400">·</span>
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {post.timestamp}
                            </span>
                            <VisibilityIcon className="w-4 h-4 text-gray-400" />
                          </div>
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <EllipsisHorizontalIcon className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                            {post.content}
                          </p>
                          
                          {post.images && (
                            <div className="mt-3 grid grid-cols-1 gap-2">
                              {post.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt="Post image"
                                  className="rounded-lg max-h-96 w-full object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 max-w-md">
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <ChatBubbleOvalLeftIcon className="w-5 h-5" />
                            <span className="text-sm">{post.replies}</span>
                          </button>
                          
                          <button
                            onClick={() => handleRepost(post.id)}
                            className={clsx(
                              'flex items-center space-x-2 transition-colors',
                              post.reposted
                                ? 'text-green-600'
                                : 'text-gray-500 hover:text-green-600'
                            )}
                          >
                            <ArrowPathRoundedSquareIcon className="w-5 h-5" />
                            <span className="text-sm">{post.reposts}</span>
                          </button>
                          
                          <button
                            onClick={() => handleLike(post.id)}
                            className={clsx(
                              'flex items-center space-x-2 transition-colors',
                              post.liked
                                ? 'text-red-600'
                                : 'text-gray-500 hover:text-red-600'
                            )}
                          >
                            {post.liked ? (
                              <HeartSolidIcon className="w-5 h-5" />
                            ) : (
                              <HeartIcon className="w-5 h-5" />
                            )}
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          
                          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                            <ShareIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Trending
              </h3>
              <div className="space-y-3">
                <div className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Trending in Technology</p>
                  <p className="font-medium text-gray-900 dark:text-white">#NovaStack</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">2,847 posts</p>
                </div>
                <div className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Trending</p>
                  <p className="font-medium text-gray-900 dark:text-white">#AI</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">1,234 posts</p>
                </div>
                <div className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Technology</p>
                  <p className="font-medium text-gray-900 dark:text-white">#OpenSource</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">987 posts</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Posts</span>
                  <span className="font-medium text-gray-900 dark:text-white">42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Following</span>
                  <span className="font-medium text-gray-900 dark:text-white">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Followers</span>
                  <span className="font-medium text-gray-900 dark:text-white">234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Likes received</span>
                  <span className="font-medium text-gray-900 dark:text-white">1,847</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Notice */}
        <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
          <div className="flex items-start">
            <UserGroupIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-1 mr-3" />
            <div>
              <h4 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                Decentralized Social Network
              </h4>
              <p className="text-indigo-700 dark:text-indigo-200 mb-4">
                Our social platform is built on open protocols with privacy at its core. 
                Connect with others while maintaining control over your data and digital identity.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong className="text-indigo-900 dark:text-indigo-100">Privacy:</strong>
                  <p className="text-indigo-700 dark:text-indigo-200">Data ownership</p>
                </div>
                <div>
                  <strong className="text-indigo-900 dark:text-indigo-100">Federation:</strong>
                  <p className="text-indigo-700 dark:text-indigo-200">Cross-platform</p>
                </div>
                <div>
                  <strong className="text-indigo-900 dark:text-indigo-100">Moderation:</strong>
                  <p className="text-indigo-700 dark:text-indigo-200">Community-driven</p>
                </div>
                <div>
                  <strong className="text-indigo-900 dark:text-indigo-100">Open Source:</strong>
                  <p className="text-indigo-700 dark:text-indigo-200">Transparent code</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { MessageSquare, Users, TrendingUp, Clock, Pin, ExternalLink, Search } from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned: boolean;
  tags: string[];
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postCount: number;
  color: string;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeForum();
  }, []);

  const initializeForum = async () => {
    try {
      // Mock data - in real implementation, this would fetch from Flarum API
      const mockCategories: ForumCategory[] = [
        {
          id: 'general',
          name: 'General Discussion',
          description: 'General topics and community discussions',
          postCount: 234,
          color: 'blue'
        },
        {
          id: 'startups',
          name: 'Startup Ideas',
          description: 'Share and discuss startup concepts',
          postCount: 156,
          color: 'green'
        },
        {
          id: 'funding',
          name: 'Funding & Investment',
          description: 'Investment opportunities and funding discussions',
          postCount: 89,
          color: 'purple'
        },
        {
          id: 'tech',
          name: 'Technology',
          description: 'Technical discussions and development',
          postCount: 178,
          color: 'orange'
        },
        {
          id: 'success',
          name: 'Success Stories',
          description: 'Share your entrepreneurial journey',
          postCount: 67,
          color: 'yellow'
        }
      ];

      const mockPosts: ForumPost[] = [
        {
          id: '1',
          title: 'Welcome to NovaStack Forum! 🚀',
          content: 'This is the official NovaStack community forum where entrepreneurs, investors, and innovators come together...',
          author: 'NovaStack Team',
          category: 'general',
          replies: 23,
          views: 456,
          lastActivity: '2 hours ago',
          isPinned: true,
          tags: ['announcement', 'welcome']
        },
        {
          id: '2',
          title: 'How to validate your startup idea in 2024',
          content: 'I\'ve been working on a new approach to startup validation that combines traditional methods with AI...',
          author: 'Sarah Chen',
          category: 'startups',
          replies: 15,
          views: 234,
          lastActivity: '4 hours ago',
          isPinned: false,
          tags: ['validation', 'methodology', 'ai']
        },
        {
          id: '3',
          title: 'Monero integration for private investments',
          content: 'Has anyone tried using the new Monero payment feature? I\'m curious about the privacy benefits...',
          author: 'Alex Rodriguez',
          category: 'funding',
          replies: 8,
          views: 123,
          lastActivity: '6 hours ago',
          isPinned: false,
          tags: ['monero', 'privacy', 'investment']
        },
        {
          id: '4',
          title: 'Building a decentralized startup ecosystem',
          content: 'The future of entrepreneurship is decentralized. Let\'s discuss how blockchain and Web3 technologies...',
          author: 'Michael Kim',
          category: 'tech',
          replies: 31,
          views: 567,
          lastActivity: '1 day ago',
          isPinned: false,
          tags: ['web3', 'blockchain', 'decentralization']
        },
        {
          id: '5',
          title: 'From idea to $1M ARR in 18 months',
          content: 'I want to share my journey of building a SaaS startup from scratch to seven figures...',
          author: 'Emma Thompson',
          category: 'success',
          replies: 42,
          views: 891,
          lastActivity: '2 days ago',
          isPinned: false,
          tags: ['saas', 'growth', 'revenue']
        }
      ];

      setCategories(mockCategories);
      setPosts(mockPosts);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize forum:', error);
      setIsLoading(false);
    }
  };

  const openFlarum = () => {
    // Open Flarum in new tab
    window.open(process.env.NEXT_PUBLIC_FLARUM_URL || 'http://localhost:8081', '_blank');
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500'
    };
    return colors[category?.color as keyof typeof colors] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading forum...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">NovaStack Forum</h1>
            <p className="text-blue-200">Community discussions and knowledge sharing</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={openFlarum}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Open Full Forum
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts, topics, or tags..."
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                All Categories
              </button>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-600/50 border border-blue-400'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getCategoryColor(category.id)}`}></div>
                      <span className="text-white font-medium">{category.name}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{category.description}</p>
                    <span className="text-blue-200 text-xs">{category.postCount} posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forum Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Forum Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Posts</span>
                  <span className="text-white font-semibold">724</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Active Users</span>
                  <span className="text-white font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Online Now</span>
                  <span className="text-green-400 font-semibold">23</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.author.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {post.isPinned && (
                          <Pin className="w-4 h-4 text-yellow-400" />
                        )}
                        <h3 className="text-xl font-semibold text-white hover:text-blue-300 transition-colors">
                          {post.title}
                        </h3>
                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(post.category)}`}></div>
                      </div>
                      
                      <p className="text-gray-300 mb-3 line-clamp-2">{post.content}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span>by {post.author}</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {post.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {post.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.lastActivity}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-blue-600/30 text-blue-200 px-2 py-1 rounded-md text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No posts found</h3>
                <p className="text-gray-400">Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        </div>

        {/* Integration Notice */}
        <div className="mt-8 bg-orange-600/20 border border-orange-400/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-orange-300" />
            <div>
              <h4 className="text-white font-semibold">Powered by Flarum</h4>
              <p className="text-orange-200 text-sm">
                Modern, fast, and extensible forum software. 
                <button 
                  onClick={openFlarum}
                  className="text-orange-300 hover:text-white ml-1 underline"
                >
                  Open full forum experience
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

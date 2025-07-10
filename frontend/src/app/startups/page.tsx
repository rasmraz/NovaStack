'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Rocket, Search, Heart, Eye, TrendingUp } from 'lucide-react';

interface Startup {
  id: string;
  name: string;
  tagline: string;
  description: string;
  industry: string;
  stage: string;
  fundingGoal: number;
  likeCount: number;
  viewCount: number;
  logo?: string;
}

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'AI/ML'];
  const stages = ['Idea', 'Seed', 'Series A', 'Series B', 'Growth'];

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const response = await fetch('/api/startups');
      const data = await response.json();
      
      if (data.success) {
        setStartups(data.data.startups);
      }
    } catch (error) {
      console.error('Error fetching startups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = !selectedIndustry || startup.industry === selectedIndustry;
    const matchesStage = !selectedStage || startup.stage === selectedStage;
    
    return matchesSearch && matchesIndustry && matchesStage;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Rocket className="h-8 w-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">NovaStack</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/startups" className="text-white font-medium">Startups</Link>
          <Link href="/chat" className="text-gray-300 hover:text-white transition-colors">Chat</Link>
          <Link href="/forum" className="text-gray-300 hover:text-white transition-colors">Forum</Link>
          <Link href="/video" className="text-gray-300 hover:text-white transition-colors">Video</Link>
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
          <Link href="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Startups</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore innovative startups, connect with founders, and find your next opportunity to build the future.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search startups..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full py-3 px-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                className="w-full py-3 px-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
              >
                <option value="">All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Startups Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <p className="text-gray-300 mt-4">Loading startups...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <div key={startup.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400/50 transition-all hover:transform hover:scale-105">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Rocket className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{startup.name}</h3>
                      <p className="text-purple-400 text-sm">{startup.stage}</p>
                    </div>
                  </div>
                  <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-xs">
                    {startup.industry}
                  </span>
                </div>
                
                <p className="text-gray-300 font-medium mb-2">{startup.tagline}</p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{startup.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{startup.likeCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{startup.viewCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>${startup.fundingGoal.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                    View Details
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredStartups.length === 0 && !loading && (
          <div className="text-center py-12">
            <Rocket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No startups found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or check back later for new startups.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Have a Startup Idea?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join NovaStack and connect with co-founders, investors, and the resources you need to succeed.
            </p>
            <Link
              href="/register"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center"
            >
              Start Your Journey
              <Rocket className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

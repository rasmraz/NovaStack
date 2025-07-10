'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Rocket, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  Heart, 
  Settings,
  Bell,
  Search,
  BarChart3,
  Calendar,
  MessageSquare,
  Video,
  MessageCircle,
  Globe
} from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar?: string;
  subscriptionTier: string;
  reputationScore: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user data for now
    setUser({
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      username: 'johndoe',
      subscriptionTier: 'Free',
      reputationScore: 85
    });
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <p className="text-gray-300 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">NovaStack</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <span className="text-white text-sm">{user?.firstName} {user?.lastName}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-300">
            Ready to build the future? Here's what's happening in your startup ecosystem.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">My Startups</p>
                <p className="text-2xl font-bold text-white">3</p>
              </div>
              <div className="bg-purple-600/20 p-3 rounded-lg">
                <Rocket className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-2xl font-bold text-white">1,247</p>
              </div>
              <div className="bg-blue-600/20 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Connections</p>
                <p className="text-2xl font-bold text-white">89</p>
              </div>
              <div className="bg-green-600/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reputation</p>
                <p className="text-2xl font-bold text-white">{user?.reputationScore}</p>
              </div>
              <div className="bg-yellow-600/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Startups */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">My Startups</h2>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>New Startup</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">TechVenture AI</h3>
                    <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded-full text-xs">Active</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">AI-powered startup analytics platform</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>234</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>18</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>5 members</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">EcoSolutions</h3>
                    <span className="bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded-full text-xs">Seeking Funding</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Sustainable energy management system</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>156</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>12</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>3 members</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-600 rounded-full p-2">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Sarah liked your startup "TechVenture AI"</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600 rounded-full p-2">
                    <MessageSquare className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm">New message in EcoSolutions team chat</p>
                    <p className="text-gray-400 text-xs">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-600 rounded-full p-2">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm">Alex joined your startup team</p>
                    <p className="text-gray-400 text-xs">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Create Startup</span>
                </button>
                <Link href="/chat" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>Join Chat</span>
                </Link>
                <Link href="/forum" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                  <Globe className="h-4 w-4" />
                  <span>Browse Forum</span>
                </Link>
                <Link href="/video" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                  <Video className="h-4 w-4" />
                  <span>Start Meeting</span>
                </Link>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                  <Search className="h-4 w-4" />
                  <span>Find Co-founders</span>
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg flex items-center space-x-2 transition-colors">
                  <DollarSign className="h-4 w-4" />
                  <span>Browse Investors</span>
                </button>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-6">Upcoming Events</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-600/20 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Startup Pitch Night</p>
                    <p className="text-gray-400 text-xs">Tomorrow, 7:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-600/20 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Founder Networking</p>
                    <p className="text-gray-400 text-xs">Friday, 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-2">Upgrade to Pro</h3>
              <p className="text-purple-100 text-sm mb-4">
                Unlock advanced features and connect with more investors.
              </p>
              <button className="bg-white text-purple-600 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
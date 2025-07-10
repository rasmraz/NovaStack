import Link from "next/link";
import { Rocket, Users, TrendingUp, Zap, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Rocket className="h-8 w-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">NovaStack</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/startups" className="text-gray-300 hover:text-white transition-colors">
            Startups
          </Link>
          <Link href="/investors" className="text-gray-300 hover:text-white transition-colors">
            Investors
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
            About
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/register" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Build the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}Future{" "}
            </span>
            Together
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The world's premier platform for startup collaboration. Connect with co-founders, 
            investors, and innovators to build the next generation of world-changing companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center">
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/startups" className="border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all">
              Explore Startups
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Build a Startup
          </h2>
          <p className="text-xl text-gray-300">
            From idea to IPO, NovaStack provides the tools and community to succeed
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Users className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Team Collaboration</h3>
            <p className="text-gray-300">
              Real-time chat, video calls, and project management tools to keep your team aligned and productive.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <TrendingUp className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Investment Tools</h3>
            <p className="text-gray-300">
              Connect with investors, manage funding rounds, and track your startup's financial progress.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Zap className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Insights</h3>
            <p className="text-gray-300">
              Get smart recommendations for co-founders, investors, and strategic decisions using advanced AI.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Star className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Pitch Deck Builder</h3>
            <p className="text-gray-300">
              Create compelling presentations with our AI-assisted pitch deck builder and templates.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Rocket className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Startup Marketplace</h3>
            <p className="text-gray-300">
              Discover innovative startups, join exciting projects, or showcase your own venture to the community.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <Users className="h-12 w-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Global Community</h3>
            <p className="text-gray-300">
              Join a worldwide network of entrepreneurs, investors, and innovators building the future together.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Build History?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of entrepreneurs already building the future on NovaStack
          </p>
          <Link href="/register" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Rocket className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">NovaStack</span>
            </div>
            <p className="text-gray-400">
              © 2024 NovaStack. Building the future, one startup at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

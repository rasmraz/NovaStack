'use client';

import { useEffect, useState } from 'react';
import { Video, Users, Calendar, Clock, Plus, ExternalLink, Mic, Camera, Share2, Settings } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  description: string;
  host: string;
  participants: number;
  maxParticipants: number;
  startTime: string;
  duration: string;
  status: 'upcoming' | 'live' | 'ended';
  isPrivate: boolean;
  roomUrl: string;
}

interface QuickMeeting {
  roomName: string;
  displayName: string;
  isPrivate: boolean;
}

export default function VideoPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [quickMeeting, setQuickMeeting] = useState<QuickMeeting>({
    roomName: '',
    displayName: '',
    isPrivate: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeVideo();
  }, []);

  const initializeVideo = async () => {
    try {
      // Mock data - in real implementation, this would fetch from backend
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          title: 'NovaStack Weekly Standup',
          description: 'Weekly team standup to discuss progress and blockers',
          host: 'Sarah Chen',
          participants: 8,
          maxParticipants: 50,
          startTime: '2024-07-10T14:00:00Z',
          duration: '30 min',
          status: 'live',
          isPrivate: false,
          roomUrl: 'novastack-standup'
        },
        {
          id: '2',
          title: 'Investor Pitch Session',
          description: 'Presenting our Q3 roadmap to potential investors',
          host: 'Michael Kim',
          participants: 0,
          maxParticipants: 20,
          startTime: '2024-07-10T16:00:00Z',
          duration: '60 min',
          status: 'upcoming',
          isPrivate: true,
          roomUrl: 'investor-pitch-q3'
        },
        {
          id: '3',
          title: 'Startup Mentorship Session',
          description: 'Open mentorship session for early-stage startups',
          host: 'Emma Thompson',
          participants: 0,
          maxParticipants: 100,
          startTime: '2024-07-10T18:00:00Z',
          duration: '90 min',
          status: 'upcoming',
          isPrivate: false,
          roomUrl: 'mentorship-session'
        },
        {
          id: '4',
          title: 'Tech Talk: Blockchain in Startups',
          description: 'Discussion on implementing blockchain technology in startup ecosystems',
          host: 'Alex Rodriguez',
          participants: 23,
          maxParticipants: 200,
          startTime: '2024-07-09T19:00:00Z',
          duration: '45 min',
          status: 'ended',
          isPrivate: false,
          roomUrl: 'blockchain-tech-talk'
        }
      ];

      setMeetings(mockMeetings);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize video:', error);
      setIsLoading(false);
    }
  };

  const createQuickMeeting = () => {
    if (!quickMeeting.roomName.trim()) {
      alert('Please enter a room name');
      return;
    }

    const roomUrl = quickMeeting.roomName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const jitsiUrl = `${process.env.NEXT_PUBLIC_JITSI_URL || 'http://localhost:8082'}/${roomUrl}`;
    
    // Open Jitsi Meet in new tab
    window.open(jitsiUrl, '_blank');
  };

  const joinMeeting = (meeting: Meeting) => {
    const jitsiUrl = `${process.env.NEXT_PUBLIC_JITSI_URL || 'http://localhost:8082'}/${meeting.roomUrl}`;
    window.open(jitsiUrl, '_blank');
  };

  const openJitsiMeet = () => {
    window.open(process.env.NEXT_PUBLIC_JITSI_URL || 'http://localhost:8082', '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500';
      case 'upcoming':
        return 'bg-green-500';
      case 'ended':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'LIVE';
      case 'upcoming':
        return 'UPCOMING';
      case 'ended':
        return 'ENDED';
      default:
        return 'UNKNOWN';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading video conferencing...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Video Conferencing</h1>
            <p className="text-blue-200">Connect face-to-face with the NovaStack community</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={openJitsiMeet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Open Jitsi Meet
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Meeting */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Start Quick Meeting
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={quickMeeting.roomName}
                    onChange={(e) => setQuickMeeting(prev => ({ ...prev, roomName: e.target.value }))}
                    placeholder="Enter room name"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Display Name
                  </label>
                  <input
                    type="text"
                    value={quickMeeting.displayName}
                    onChange={(e) => setQuickMeeting(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={quickMeeting.isPrivate}
                    onChange={(e) => setQuickMeeting(prev => ({ ...prev, isPrivate: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="private" className="text-sm text-gray-300">
                    Private meeting
                  </label>
                </div>
                
                <button
                  onClick={createQuickMeeting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Video className="w-5 h-5" />
                  Start Meeting
                </button>
              </div>
            </div>

            {/* Meeting Controls */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Meeting Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Camera className="w-5 h-5 text-blue-400" />
                  <span>HD Video Quality</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mic className="w-5 h-5 text-green-400" />
                  <span>Crystal Clear Audio</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  <span>Screen Sharing</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Users className="w-5 h-5 text-orange-400" />
                  <span>Up to 200 Participants</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span>Advanced Controls</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meetings List */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Scheduled Meetings</h2>
              
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getStatusColor(meeting.status)}`}>
                            {getStatusText(meeting.status)}
                          </span>
                          {meeting.isPrivate && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-white">
                              PRIVATE
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 mb-3">{meeting.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {meeting.participants}/{meeting.maxParticipants}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(meeting.startTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatTime(meeting.startTime)} ({meeting.duration})
                          </span>
                        </div>
                        
                        <div className="mt-3">
                          <span className="text-sm text-blue-200">Hosted by {meeting.host}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {meeting.status === 'live' && (
                          <button
                            onClick={() => joinMeeting(meeting)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" />
                            Join Live
                          </button>
                        )}
                        {meeting.status === 'upcoming' && (
                          <button
                            onClick={() => joinMeeting(meeting)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" />
                            Join
                          </button>
                        )}
                        {meeting.status === 'ended' && (
                          <button
                            disabled
                            className="bg-gray-600 cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Ended
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Integration Notice */}
        <div className="mt-8 bg-green-600/20 border border-green-400/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Video className="w-5 h-5 text-green-300" />
            <div>
              <h4 className="text-white font-semibold">Powered by Jitsi Meet</h4>
              <p className="text-green-200 text-sm">
                Open-source, secure video conferencing with no account required. 
                <button 
                  onClick={openJitsiMeet}
                  className="text-green-300 hover:text-white ml-1 underline"
                >
                  Open full Jitsi Meet interface
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
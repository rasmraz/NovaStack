'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Users, Settings, Plus, Hash, Lock, Globe } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  topic?: string;
  memberCount: number;
  isPublic: boolean;
  lastActivity: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
}

export default function ChatPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Matrix client and load rooms
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      // Mock data for now - in real implementation, this would connect to Matrix
      const mockRooms: Room[] = [
        {
          id: '!general:novastack.local',
          name: 'General',
          topic: 'General discussion for all NovaStack members',
          memberCount: 156,
          isPublic: true,
          lastActivity: '2 minutes ago'
        },
        {
          id: '!startups:novastack.local',
          name: 'Startups',
          topic: 'Share and discuss startup ideas',
          memberCount: 89,
          isPublic: true,
          lastActivity: '5 minutes ago'
        },
        {
          id: '!investors:novastack.local',
          name: 'Investors',
          topic: 'Investment opportunities and discussions',
          memberCount: 34,
          isPublic: false,
          lastActivity: '1 hour ago'
        },
        {
          id: '!tech-talk:novastack.local',
          name: 'Tech Talk',
          topic: 'Technical discussions and development',
          memberCount: 67,
          isPublic: true,
          lastActivity: '30 minutes ago'
        }
      ];

      setRooms(mockRooms);
      setSelectedRoom(mockRooms[0]);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loadMessages = async (roomId: string) => {
    try {
      // Mock messages - in real implementation, this would load from Matrix using roomId
      const mockMessages: Message[] = [
        {
          id: '1',
          sender: '@alice:novastack.local',
          content: 'Welcome to NovaStack! 🚀',
          timestamp: '10:30 AM',
          type: 'text'
        },
        {
          id: '2',
          sender: '@bob:novastack.local',
          content: 'Excited to be part of this community!',
          timestamp: '10:32 AM',
          type: 'text'
        },
        {
          id: '3',
          sender: '@charlie:novastack.local',
          content: 'Has anyone tried the new investment feature with Monero?',
          timestamp: '10:35 AM',
          type: 'text'
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      // In real implementation, this would send via Matrix
      const message: Message = {
        id: Date.now().toString(),
        sender: '@you:novastack.local',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    loadMessages(room.id);
  };

  const openElementWeb = () => {
    // Open Element Web in new tab
    window.open(process.env.NEXT_PUBLIC_ELEMENT_URL || 'http://localhost:8080', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">NovaStack Chat</h1>
            <p className="text-blue-200">Connect with entrepreneurs and investors</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={openElementWeb}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Open Full Chat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Rooms Sidebar */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Rooms</h2>
              <button className="text-blue-300 hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleRoomSelect(room)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedRoom?.id === room.id
                      ? 'bg-blue-600/50 border border-blue-400'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {room.isPublic ? (
                      <Hash className="w-4 h-4 text-green-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-white font-medium">{room.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {room.memberCount}
                    </span>
                    <span className="text-gray-400">{room.lastActivity}</span>
                  </div>
                  {room.topic && (
                    <p className="text-gray-300 text-xs mt-2 line-clamp-2">{room.topic}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col">
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        {selectedRoom.isPublic ? (
                          <Hash className="w-5 h-5 text-green-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-yellow-400" />
                        )}
                        {selectedRoom.name}
                      </h3>
                      {selectedRoom.topic && (
                        <p className="text-blue-200 mt-1">{selectedRoom.topic}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {selectedRoom.memberCount} members
                      </span>
                      <button className="text-blue-300 hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {message.sender.charAt(1).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{message.sender}</span>
                            <span className="text-gray-400 text-sm">{message.timestamp}</span>
                          </div>
                          <div className="text-gray-200">{message.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-white/20">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={`Message #${selectedRoom.name.toLowerCase()}`}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Select a room to start chatting</h3>
                  <p className="text-gray-400">Choose a room from the sidebar to join the conversation</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Integration Notice */}
        <div className="mt-8 bg-blue-600/20 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-300" />
            <div>
              <h4 className="text-white font-semibold">Powered by Matrix Protocol</h4>
              <p className="text-blue-200 text-sm">
                Secure, decentralized messaging with end-to-end encryption. 
                <button 
                  onClick={openElementWeb}
                  className="text-blue-300 hover:text-white ml-1 underline"
                >
                  Open full Element client
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

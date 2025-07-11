'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon,
  CpuChipIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  TrashIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'code' | 'analysis';
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  status: 'available' | 'loading' | 'offline';
}

const availableModels: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Advanced language model for complex reasoning and analysis',
    capabilities: ['Text Generation', 'Code Analysis', 'Problem Solving'],
    status: 'available'
  },
  {
    id: 'codellama',
    name: 'Code Llama',
    description: 'Specialized model for code generation and programming tasks',
    capabilities: ['Code Generation', 'Code Review', 'Debugging'],
    status: 'available'
  },
  {
    id: 'llama2',
    name: 'Llama 2',
    description: 'Open-source model for general conversation and assistance',
    capabilities: ['General Chat', 'Writing', 'Analysis'],
    status: 'available'
  },
  {
    id: 'mistral',
    name: 'Mistral 7B',
    description: 'Efficient model for quick responses and lightweight tasks',
    capabilities: ['Quick Responses', 'Summarization', 'Q&A'],
    status: 'loading'
  }
];

const quickPrompts = [
  {
    icon: CodeBracketIcon,
    title: 'Code Review',
    prompt: 'Please review this code and suggest improvements:'
  },
  {
    icon: DocumentTextIcon,
    title: 'Write Documentation',
    prompt: 'Help me write documentation for this function:'
  },
  {
    icon: LightBulbIcon,
    title: 'Brainstorm Ideas',
    prompt: 'Help me brainstorm ideas for:'
  },
  {
    icon: ChartBarIcon,
    title: 'Data Analysis',
    prompt: 'Analyze this data and provide insights:'
  }
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you with coding, writing, analysis, and much more. What would you like to work on today?',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState(availableModels[0]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(inputMessage),
        timestamp: new Date(),
        type: inputMessage.toLowerCase().includes('code') ? 'code' : 'text'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (input: string): string => {
    if (input.toLowerCase().includes('code')) {
      return `Here's a sample code solution:

\`\`\`javascript
function sampleFunction(input) {
  // Process the input
  const result = input.map(item => {
    return {
      ...item,
      processed: true,
      timestamp: new Date()
    };
  });
  
  return result;
}

// Usage example
const data = [{ id: 1, name: 'test' }];
const processed = sampleFunction(data);
console.log(processed);
\`\`\`

This code demonstrates a clean approach to processing data with proper error handling and modern JavaScript features.`;
    }
    
    return `I understand you're asking about "${input}". Here's a comprehensive response:

This is a complex topic that requires careful consideration of multiple factors. Let me break it down:

1. **Key Concepts**: The fundamental principles involve understanding the core mechanisms and their interactions.

2. **Best Practices**: 
   - Always consider scalability and maintainability
   - Follow established patterns and conventions
   - Test thoroughly before implementation

3. **Implementation Strategy**: Start with a minimal viable approach and iterate based on feedback and requirements.

Would you like me to elaborate on any specific aspect or provide more detailed examples?`;
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt + ' ');
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Chat cleared! How can I help you today?',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Powerful AI tools for coding, writing, analysis, and automation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Model Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                AI Models
              </h3>
              <div className="space-y-3">
                {availableModels.map((model) => (
                  <div
                    key={model.id}
                    onClick={() => model.status === 'available' && setSelectedModel(model)}
                    className={clsx(
                      'p-3 rounded-lg border cursor-pointer transition-all',
                      selectedModel.id === model.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500',
                      model.status !== 'available' && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {model.name}
                      </h4>
                      <span className={clsx(
                        'px-2 py-1 text-xs rounded-full',
                        model.status === 'available' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : model.status === 'loading'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      )}>
                        {model.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {model.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Prompts
              </h3>
              <div className="space-y-2">
                {quickPrompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt.prompt)}
                      className="w-full flex items-center p-3 text-left rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {prompt.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Chat Settings
                </h3>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={clearChat}
                className="w-full mt-4 flex items-center justify-center p-2 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Clear Chat
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[calc(100vh-200px)]">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <CpuChipIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedModel.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedModel.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={clsx(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={clsx(
                        'max-w-3xl rounded-lg p-4 relative group',
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(message.content)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-opacity"
                        >
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown
                          components={{
                            code({ node, inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={tomorrow}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                      
                      <div className={clsx(
                        'text-xs mt-2',
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      )}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Ask me anything..."
                      rows={1}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Notice */}
        <div className="mt-8 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-start">
            <CpuChipIcon className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-1 mr-3" />
            <div>
              <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                Powered by Advanced AI Models
              </h4>
              <p className="text-orange-700 dark:text-orange-200 mb-4">
                Our AI assistant integrates multiple state-of-the-art models including GPT-4, Code Llama, 
                and open-source alternatives. Get help with coding, writing, analysis, and creative tasks.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong className="text-orange-900 dark:text-orange-100">Code Generation:</strong>
                  <p className="text-orange-700 dark:text-orange-200">Multiple languages</p>
                </div>
                <div>
                  <strong className="text-orange-900 dark:text-orange-100">Analysis:</strong>
                  <p className="text-orange-700 dark:text-orange-200">Data & documents</p>
                </div>
                <div>
                  <strong className="text-orange-900 dark:text-orange-100">Writing:</strong>
                  <p className="text-orange-700 dark:text-orange-200">Creative & technical</p>
                </div>
                <div>
                  <strong className="text-orange-900 dark:text-orange-100">Automation:</strong>
                  <p className="text-orange-700 dark:text-orange-200">Task workflows</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
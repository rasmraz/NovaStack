import Link from 'next/link';
import { 
  ChatBubbleLeftRightIcon, 
  FilmIcon, 
  ChatBubbleOvalLeftEllipsisIcon,
  PhotoIcon,
  CpuChipIcon,
  CloudIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Real-time Chat',
    description: 'Secure messaging with end-to-end encryption, group chats, and file sharing.',
    icon: ChatBubbleLeftRightIcon,
    href: '/chat',
    color: 'bg-blue-500',
  },
  {
    name: 'Media Streaming',
    description: 'Stream movies, TV shows, music, and personal media collections.',
    icon: FilmIcon,
    href: '/media',
    color: 'bg-purple-500',
  },
  {
    name: 'Discussion Forums',
    description: 'Community discussions, Q&A, and knowledge sharing platform.',
    icon: ChatBubbleOvalLeftEllipsisIcon,
    href: '/forum',
    color: 'bg-green-500',
  },
  {
    name: 'Photo Gallery',
    description: 'AI-powered photo management with facial recognition and smart albums.',
    icon: PhotoIcon,
    href: '/gallery',
    color: 'bg-pink-500',
  },
  {
    name: 'AI Assistant',
    description: 'Powerful AI tools for coding, writing, analysis, and automation.',
    icon: CpuChipIcon,
    href: '/ai',
    color: 'bg-orange-500',
  },
  {
    name: 'File Management',
    description: 'Cloud storage, file sync, and collaborative document editing.',
    icon: CloudIcon,
    href: '/files',
    color: 'bg-cyan-500',
  },
  {
    name: 'Social Network',
    description: 'Decentralized social platform with privacy-focused features.',
    icon: UserGroupIcon,
    href: '/social',
    color: 'bg-indigo-500',
  },
];

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Your Complete Digital Platform
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Everything you need in one place - chat, media, AI, files, and social features. 
              Built with privacy, performance, and user experience in mind.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/chat"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get started
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">
              Integrated Platform
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need, unified
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              No more switching between dozens of apps. Our platform brings together all the tools 
              you need for communication, productivity, and entertainment.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className="group relative flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}>
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                    <ArrowRightIcon className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </Link>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Trusted by users worldwide
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Join thousands of users who have made the switch to our unified platform
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-white dark:bg-gray-700 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">
                  Active Users
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  10K+
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-gray-700 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">
                  Messages Sent
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  1M+
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-gray-700 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">
                  Files Stored
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  100TB+
                </dd>
              </div>
              <div className="flex flex-col bg-white dark:bg-gray-700 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-300">
                  Uptime
                </dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  99.9%
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

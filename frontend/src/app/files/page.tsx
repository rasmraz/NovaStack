'use client';

import { useState, useCallback } from 'react';
import { 
  CloudIcon,
  FolderIcon,
  DocumentIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  ShareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  FolderPlusIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { useDropzone } from 'react-dropzone';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
  fileType?: string;
  shared?: boolean;
  thumbnail?: string;
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    modified: '2 days ago',
    shared: false
  },
  {
    id: '2',
    name: 'Photos',
    type: 'folder',
    modified: '1 week ago',
    shared: true
  },
  {
    id: '3',
    name: 'Projects',
    type: 'folder',
    modified: '3 days ago',
    shared: false
  },
  {
    id: '4',
    name: 'presentation.pptx',
    type: 'file',
    size: '2.4 MB',
    modified: '1 hour ago',
    fileType: 'presentation',
    shared: true
  },
  {
    id: '5',
    name: 'report.pdf',
    type: 'file',
    size: '1.2 MB',
    modified: '3 hours ago',
    fileType: 'pdf',
    shared: false
  },
  {
    id: '6',
    name: 'vacation.jpg',
    type: 'file',
    size: '3.8 MB',
    modified: '2 days ago',
    fileType: 'image',
    shared: false,
    thumbnail: 'https://picsum.photos/100/100?random=1'
  },
  {
    id: '7',
    name: 'music.mp3',
    type: 'file',
    size: '4.2 MB',
    modified: '1 week ago',
    fileType: 'audio',
    shared: false
  },
  {
    id: '8',
    name: 'video.mp4',
    type: 'file',
    size: '15.6 MB',
    modified: '4 days ago',
    fileType: 'video',
    shared: true
  }
];

const viewModes = [
  { id: 'list', name: 'List' },
  { id: 'grid', name: 'Grid' }
];

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('/');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle file upload
    acceptedFiles.forEach((file) => {
      const newFile: FileItem = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: 'file',
        size: formatFileSize(file.size),
        modified: 'Just now',
        fileType: getFileType(file.name),
        shared: false
      };
      setFiles(prev => [...prev, newFile]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext || '')) return 'audio';
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['doc', 'docx'].includes(ext || '')) return 'document';
    if (['ppt', 'pptx'].includes(ext || '')) return 'presentation';
    if (['zip', 'rar', '7z'].includes(ext || '')) return 'archive';
    return 'file';
  };

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') return FolderIcon;
    
    switch (item.fileType) {
      case 'image': return PhotoIcon;
      case 'video': return FilmIcon;
      case 'audio': return MusicalNoteIcon;
      case 'archive': return ArchiveBoxIcon;
      default: return DocumentIcon;
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            File Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Cloud storage, file sync, and collaborative document editing
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {viewModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={clsx(
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    viewMode === mode.id
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FolderPlusIcon className="w-4 h-4 mr-2" />
              New Folder
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <PlusIcon className="w-4 h-4 mr-2" />
              Upload
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  Home
                </button>
              </li>
              {currentPath !== '/' && (
                <>
                  <span className="text-gray-400">/</span>
                  <li className="text-gray-500 dark:text-gray-400">Current Folder</li>
                </>
              )}
            </ol>
          </nav>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={clsx(
            'mb-6 border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          )}
        >
          <input {...getInputProps()} />
          <CloudIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-blue-600 dark:text-blue-400">Drop files here...</p>
          ) : (
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Drag and drop files here, or click to select files
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports all file types up to 100MB
              </p>
            </div>
          )}
        </div>

        {/* File List/Grid */}
        {viewMode === 'list' ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-3">Modified</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file);
                return (
                  <div
                    key={file.id}
                    className={clsx(
                      'px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                      selectedFiles.includes(file.id) && 'bg-blue-50 dark:bg-blue-900/20'
                    )}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6 flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Icon className="w-5 h-5 text-gray-400 mr-3" />
                        {file.thumbnail && (
                          <img
                            src={file.thumbnail}
                            alt={file.name}
                            className="w-8 h-8 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {file.name}
                          </p>
                          {file.shared && (
                            <p className="text-xs text-blue-600 dark:text-blue-400">Shared</p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 text-sm text-gray-500 dark:text-gray-400">
                        {file.size || '—'}
                      </div>
                      <div className="col-span-3 text-sm text-gray-500 dark:text-gray-400">
                        {file.modified}
                      </div>
                      <div className="col-span-1">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <EllipsisHorizontalIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => {
              const Icon = getFileIcon(file);
              return (
                <div
                  key={file.id}
                  className={clsx(
                    'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-pointer',
                    selectedFiles.includes(file.id) && 'ring-2 ring-blue-500'
                  )}
                  onClick={() => toggleFileSelection(file.id)}
                >
                  <div className="text-center">
                    {file.thumbnail ? (
                      <img
                        src={file.thumbnail}
                        alt={file.name}
                        className="w-16 h-16 rounded object-cover mx-auto mb-3"
                      />
                    ) : (
                      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                    )}
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {file.size || file.modified}
                    </p>
                    {file.shared && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Shared</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selection Actions */}
        {selectedFiles.length > 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedFiles.length} selected
              </span>
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <ShareIcon className="w-4 h-4 mr-1" />
                  Share
                </button>
                <button className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                  Download
                </button>
                <button className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <PencilIcon className="w-4 h-4 mr-1" />
                  Rename
                </button>
                <button className="flex items-center px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Integration Notice */}
        <div className="mt-12 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-6">
          <div className="flex items-start">
            <CloudIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mt-1 mr-3" />
            <div>
              <h4 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                Advanced Cloud Storage Platform
              </h4>
              <p className="text-cyan-700 dark:text-cyan-200 mb-4">
                Our file management system provides secure cloud storage with real-time sync, 
                collaborative editing, and advanced sharing controls. Access your files anywhere, anytime.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <strong className="text-cyan-900 dark:text-cyan-100">Storage:</strong>
                  <p className="text-cyan-700 dark:text-cyan-200">Unlimited space</p>
                </div>
                <div>
                  <strong className="text-cyan-900 dark:text-cyan-100">Sync:</strong>
                  <p className="text-cyan-700 dark:text-cyan-200">Real-time across devices</p>
                </div>
                <div>
                  <strong className="text-cyan-900 dark:text-cyan-100">Collaboration:</strong>
                  <p className="text-cyan-700 dark:text-cyan-200">Live document editing</p>
                </div>
                <div>
                  <strong className="text-cyan-900 dark:text-cyan-100">Security:</strong>
                  <p className="text-cyan-700 dark:text-cyan-200">End-to-end encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
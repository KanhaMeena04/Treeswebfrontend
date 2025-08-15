import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Eye, Heart, Users, BarChart3 } from 'lucide-react';
import { StoryUpload } from './StoryUpload';
import { StoryViewer } from './StoryViewer';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StoryData {
  id: string;
  image: string;
  textOverlays: TextOverlay[];
  stickers: Sticker[];
  createdAt: Date;
  expiresAt: Date;
  views?: number;
  likes?: number;
  viewers?: StoryViewer[];
  reactions?: StoryReaction[];
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

interface StoryViewer {
  id: string;
  name: string;
  username: string;
  avatar: string;
  viewedAt: Date;
  isFollowing: boolean;
}

interface StoryReaction {
  id: string;
  type: 'like' | 'heart' | 'laugh' | 'wow' | 'sad' | 'angry';
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  timestamp: Date;
}

// Mock stories data with enhanced viewer and reaction data
const mockStories: StoryData[] = [
  {
    id: '1',
    image: '/placeholder.svg',
    textOverlays: [
      {
        id: '1',
        text: 'Beautiful day! 🌞',
        x: 50,
        y: 100,
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Inter'
      }
    ],
    stickers: [
      {
        id: '1',
        emoji: '😍',
        x: 200,
        y: 150,
        size: 40
      }
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours left
    views: 45,
    likes: 12,
    viewers: [
      {
        id: '1',
        name: 'Sarah Johnson',
        username: 'sarahj',
        avatar: '/placeholder.svg',
        viewedAt: new Date(Date.now() - 30 * 60 * 1000),
        isFollowing: true
      },
      {
        id: '2',
        name: 'Mike Chen',
        username: 'mikechen',
        avatar: '/placeholder.svg',
        viewedAt: new Date(Date.now() - 45 * 60 * 1000),
        isFollowing: false
      }
    ],
    reactions: [
      {
        id: '1',
        type: 'heart',
        user: {
          id: '1',
          name: 'Sarah Johnson',
          username: 'sarahj',
          avatar: '/placeholder.svg'
        },
        timestamp: new Date(Date.now() - 25 * 60 * 1000)
      }
    ]
  },
  {
    id: '2',
    image: '/placeholder.svg',
    textOverlays: [
      {
        id: '2',
        text: 'Coffee time ☕',
        x: 80,
        y: 120,
        fontSize: 28,
        color: '#FFD700',
        fontFamily: 'Inter'
      }
    ],
    stickers: [
      {
        id: '2',
        emoji: '☕',
        x: 180,
        y: 200,
        size: 50
      }
    ],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours left
    views: 32,
    likes: 8,
    viewers: [
      {
        id: '3',
        name: 'Emma Wilson',
        username: 'emmaw',
        avatar: '/placeholder.svg',
        viewedAt: new Date(Date.now() - 20 * 60 * 1000),
        isFollowing: true
      }
    ],
    reactions: [
      {
        id: '2',
        type: 'like',
        user: {
          id: '3',
          name: 'Emma Wilson',
          username: 'emmaw',
          avatar: '/placeholder.svg'
        },
        timestamp: new Date(Date.now() - 15 * 60 * 1000)
      }
    ]
  }
];

export const StoryBar = () => {
  const [stories, setStories] = useState<StoryData[]>(mockStories);
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [expiredStories, setExpiredStories] = useState<string[]>([]);
  const [hoveredStory, setHoveredStory] = useState<string | null>(null);

  // Check for expired stories every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expired = stories
        .filter(story => new Date(story.expiresAt) <= now)
        .map(story => story.id);
      
      if (expired.length > 0) {
        setExpiredStories(prev => [...prev, ...expired]);
        setStories(prev => prev.filter(story => !expired.includes(story.id)));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [stories]);

  const handleStorySave = (storyData: StoryData) => {
    setStories(prev => [storyData, ...prev]);
    toast({
      title: 'Story Created!',
      description: 'Your story will be visible for 24 hours',
    });
  };

  const handleStoryClick = (index: number) => {
    setCurrentStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleStoryChange = (index: number) => {
    setCurrentStoryIndex(index);
  };

  const getTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getProgressPercentage = (expiresAt: Date): number => {
    const now = new Date();
    const createdAt = new Date(expiresAt.getTime() - 24 * 60 * 60 * 1000);
    const totalDuration = expiresAt.getTime() - createdAt.getTime();
    const elapsed = now.getTime() - createdAt.getTime();
    
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <TooltipProvider>
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3">
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto">
          {/* Create Story Button */}
          <div className="flex flex-col items-center gap-2 min-w-[70px] sm:min-w-[80px] flex-shrink-0">
            <button
              onClick={() => setShowStoryUpload(true)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-gray-300 hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            </button>
            <span className="text-xs text-gray-600 text-center">Create Story</span>
          </div>

          {/* Existing Stories */}
          {stories.map((story, index) => {
            const timeRemaining = getTimeRemaining(story.expiresAt);
            const progress = getProgressPercentage(story.expiresAt);
            const isExpired = timeRemaining === 'Expired';

            return (
              <Tooltip key={story.id}>
                <TooltipTrigger asChild>
                  <div 
                    className="flex flex-col items-center gap-2 min-w-[70px] sm:min-w-[80px] flex-shrink-0"
                    onMouseEnter={() => setHoveredStory(story.id)}
                    onMouseLeave={() => setHoveredStory(null)}
                  >
                    <div className="relative group">
                      {/* Story Circle with Progress - Instagram Style */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer hover:scale-105 transition-transform">
                        <div className="w-full h-full rounded-full bg-white p-1">
                          <div className="w-full h-full rounded-full overflow-hidden relative">
                            <img
                              src={story.image}
                              alt="Story"
                              className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                              onClick={() => handleStoryClick(index)}
                            />
                            
                            {/* Progress Ring - Only visible on hover */}
                            {hoveredStory === story.id && (
                              <div className="absolute inset-0 rounded-full">
                                <svg className="w-full h-full transform -rotate-90">
                                  <circle
                                    cx="50%"
                                    cy="50%"
                                    r="25"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="transparent"
                                    className="text-primary/30"
                                  />
                                  <circle
                                    cx="50%"
                                    cy="50%"
                                    r="25"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="transparent"
                                    className="text-primary"
                                    strokeDasharray={`${2 * Math.PI * 25}`}
                                    strokeDashoffset={`${2 * Math.PI * 25 * (1 - progress / 100)}`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>
                            )}

                            {/* Hover Overlay - Shows minimal info */}
                            {hoveredStory === story.id && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="text-center text-white">
                                  <div className="text-lg font-bold">{story.views || 0}</div>
                                  <div className="text-xs">views</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <span className="text-xs text-gray-600 text-center max-w-[70px] truncate">
                      {story.textOverlays[0]?.text.slice(0, 10)}...
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Story Preview</span>
                      <Badge variant="secondary" className="text-xs">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Click to view
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span>{story.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{story.reactions?.length || 0} reactions</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Posted {formatTimeAgo(story.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {story.viewers?.length || 0} viewers
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-400 pt-1 border-t border-gray-200">
                      Click the story to see full insights and viewer list
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Expired Stories Info */}
          {expiredStories.length > 0 && (
            <div className="flex flex-col items-center gap-2 min-w-[70px] sm:min-w-[80px] flex-shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500 text-center">
                {expiredStories.length} expired
              </span>
            </div>
          )}
        </div>

        {/* Story Upload Modal */}
        <StoryUpload
          isOpen={showStoryUpload}
          onClose={() => setShowStoryUpload(false)}
          onSave={handleStorySave}
        />

        {/* Story Viewer Modal */}
        <StoryViewer
          isOpen={showStoryViewer}
          onClose={() => setShowStoryViewer(false)}
          stories={stories}
          currentStoryIndex={currentStoryIndex}
          onStoryChange={handleStoryChange}
        />
      </div>
    </TooltipProvider>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Clock, Eye, Heart, Users, MessageCircle, Share2, MoreVertical, User, Calendar, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: StoryData[];
  currentStoryIndex: number;
  onStoryChange: (index: number) => void;
}

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

// Mock data for story insights
const mockViewers: StoryViewer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: 'sarahj',
    avatar: '/placeholder.svg',
    viewedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isFollowing: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    username: 'mikechen',
    avatar: '/placeholder.svg',
    viewedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    isFollowing: false
  },
  {
    id: '3',
    name: 'Emma Wilson',
    username: 'emmaw',
    avatar: '/placeholder.svg',
    viewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isFollowing: true
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    username: 'alexr',
    avatar: '/placeholder.svg',
    viewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isFollowing: false
  }
];

const mockReactions: StoryReaction[] = [
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
  },
  {
    id: '2',
    type: 'like',
    user: {
      id: '2',
      name: 'Mike Chen',
      username: 'mikechen',
      avatar: '/placeholder.svg'
    },
    timestamp: new Date(Date.now() - 40 * 60 * 1000)
  },
  {
    id: '3',
    type: 'wow',
    user: {
      id: '3',
      name: 'Emma Wilson',
      username: 'emmaw',
      avatar: '/placeholder.svg'
    },
    timestamp: new Date(Date.now() - 55 * 60 * 1000)
  }
];

export const StoryViewer: React.FC<StoryViewerProps> = ({
  isOpen,
  onClose,
  stories,
  currentStoryIndex,
  onStoryChange
}) => {
  const [currentStory, setCurrentStory] = useState<StoryData | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const storyDuration = 5000; // 5 seconds per story

  useEffect(() => {
    if (isOpen && stories.length > 0) {
      setCurrentStory(stories[currentStoryIndex]);
      setProgress(0);
      setIsPaused(false);
      setHasLiked(false);
      setShowInsights(false);
      startProgress();
    }
  }, [isOpen, currentStoryIndex, stories]);

  useEffect(() => {
    if (currentStory) {
      updateTimeRemaining();
      const timeInterval = setInterval(updateTimeRemaining, 1000);
      return () => clearInterval(timeInterval);
    }
  }, [currentStory]);

  const startProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (!isPaused && !showInsights) {
        setProgress(prev => {
          if (prev >= 100) {
            nextStory();
            return 0;
          }
          return prev + (100 / (storyDuration / 100));
        });
      }
    }, 100);
  };

  const updateTimeRemaining = () => {
    if (!currentStory) return;

    const now = new Date();
    const expiresAt = new Date(currentStory.expiresAt);
    const timeLeft = expiresAt.getTime() - now.getTime();

    if (timeLeft <= 0) {
      setTimeRemaining('Expired');
      return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m left`);
    } else {
      setTimeRemaining(`${minutes}m left`);
    }
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      onStoryChange(currentStoryIndex + 1);
    } else {
      onClose();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      onStoryChange(currentStoryIndex - 1);
    }
  };

  const handleLike = () => {
    setHasLiked(!hasLiked);
    toast({
      title: hasLiked ? 'Story unliked' : 'Story liked!',
      description: hasLiked ? 'You unliked this story' : 'You liked this story',
    });
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      startProgress();
    }
  };

  const handleInsights = () => {
    setShowInsights(!showInsights);
    if (showInsights) {
      startProgress();
    }
  };

  const handleClose = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    onClose();
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

  const getReactionEmoji = (type: string): string => {
    switch (type) {
      case 'like': return '👍';
      case 'heart': return '❤️';
      case 'laugh': return '😂';
      case 'wow': return '😮';
      case 'sad': return '😢';
      case 'angry': return '😠';
      default: return '👍';
    }
  };

  if (!currentStory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 bg-black border-0">
        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 p-4">
            <div className="flex gap-1">
              {stories.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-100 ${
                    index === currentStoryIndex
                      ? index < currentStoryIndex
                        ? 'bg-white'
                        : 'bg-white/50'
                      : 'bg-white/30'
                  }`}
                >
                  {index === currentStoryIndex && (
                    <div
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="absolute top-16 left-0 right-0 z-10 p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {currentStory.id.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">Your Story</div>
                  <div className="text-xs text-white/70 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span>Posted {formatTimeAgo(currentStory.createdAt)}</span>
                    <span>•</span>
                    <span>{timeRemaining} left</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleInsights}
                  className="text-white hover:bg-white/20"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Story Image */}
          <div className="relative w-full h-[600px]">
            <img
              src={currentStory.image}
              alt="Story"
              className="w-full h-full object-cover"
              onClick={handlePause}
            />
            
            {/* Text Overlays */}
            {currentStory.textOverlays.map((overlay) => (
              <div
                key={overlay.id}
                className="absolute select-none"
                style={{
                  left: overlay.x,
                  top: overlay.y,
                  fontSize: overlay.fontSize,
                  color: overlay.color,
                  fontFamily: overlay.fontFamily,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                {overlay.text}
              </div>
            ))}
            
            {/* Stickers */}
            {currentStory.stickers.map((sticker) => (
              <div
                key={sticker.id}
                className="absolute select-none"
                style={{
                  left: sticker.x,
                  top: sticker.y,
                  fontSize: sticker.size
                }}
              >
                {sticker.emoji}
              </div>
            ))}

            {/* Navigation Arrows */}
            {stories.length > 1 && (
              <>
                {currentStoryIndex > 0 && (
                  <button
                    onClick={previousStory}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                
                {currentStoryIndex < stories.length - 1 && (
                  <button
                    onClick={nextStory}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                    hasLiked 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-black/30 hover:bg-black/50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">
                    {hasLiked ? 'Liked' : 'Like'}
                  </span>
                </button>
                
                <button
                  onClick={handleInsights}
                  className="flex items-center gap-2 px-3 py-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">
                    {mockViewers.length} views
                  </span>
                </button>
              </div>
              
              <div className="text-xs text-white/70">
                {stories.length > 1 && `${currentStoryIndex + 1} of ${stories.length}`}
              </div>
            </div>
          </div>

          {/* Story Insights Overlay */}
          {showInsights && (
            <div className="absolute inset-0 bg-black/95 z-20 overflow-y-auto">
              <div className="p-4">
                {/* Insights Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Story Insights</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleInsights}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Story Info */}
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={currentStory.image}
                      alt="Story"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="text-white">
                      <div className="font-medium">Story Details</div>
                      <div className="text-sm text-white/70 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {formatTimeAgo(currentStory.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="text-white">
                      <div className="text-lg font-bold">{mockViewers.length}</div>
                      <div className="text-xs text-white/70">Views</div>
                    </div>
                    <div className="text-white">
                      <div className="text-lg font-bold">{mockReactions.length}</div>
                      <div className="text-xs text-white/70">Reactions</div>
                    </div>
                    <div className="text-white">
                      <div className="text-lg font-bold">{timeRemaining}</div>
                      <div className="text-xs text-white/70">Remaining</div>
                    </div>
                  </div>
                </div>

                {/* Viewers Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Who Viewed ({mockViewers.length})
                  </h3>
                  <div className="space-y-3">
                    {mockViewers.map((viewer) => (
                      <div key={viewer.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={viewer.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              {viewer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-white">
                            <div className="font-medium">{viewer.name}</div>
                            <div className="text-sm text-white/70">@{viewer.username}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {viewer.isFollowing && (
                            <Badge variant="secondary" className="text-xs">Following</Badge>
                          )}
                          <span className="text-xs text-white/70">{formatTimeAgo(viewer.viewedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reactions Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Reactions ({mockReactions.length})
                  </h3>
                  <div className="space-y-3">
                    {mockReactions.map((reaction) => (
                      <div key={reaction.id} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{getReactionEmoji(reaction.type)}</div>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={reaction.user.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              {reaction.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-white">
                            <div className="font-medium">{reaction.user.name}</div>
                            <div className="text-sm text-white/70">@{reaction.user.username}</div>
                          </div>
                        </div>
                        <span className="text-xs text-white/70">{formatTimeAgo(reaction.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/30 text-white hover:bg-white/20"
                    onClick={() => {
                      toast({
                        title: 'Share Story',
                        description: 'Story sharing functionality would be implemented here',
                      });
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/30 text-white hover:bg-white/20"
                    onClick={() => {
                      toast({
                        title: 'Download Story',
                        description: 'Story download functionality would be implemented here',
                      });
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Pause Indicator */}
          {isPaused && !showInsights && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-black/70 text-white px-4 py-2 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-medium">Story Paused</div>
                  <div className="text-sm text-white/70">Tap to resume</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

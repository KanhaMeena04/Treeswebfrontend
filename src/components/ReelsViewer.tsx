import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Volume2, VolumeX, MoreHorizontal, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Reel {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  video: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  liked: boolean;
  music?: string;
}

const mockReels: Reel[] = [
  {
    id: '1',
    user: { name: 'Alice Johnson', username: 'alice', avatar: '/placeholder.svg', verified: true },
    video: '/placeholder.svg',
    caption: 'Amazing sunset today! 🌅 #nature #sunset',
    likes: 1234,
    comments: 89,
    shares: 45,
    views: 12500,
    liked: false,
    music: 'Original Audio'
  },
  {
    id: '2',
    user: { name: 'Bob Creator', username: 'bob', avatar: '/placeholder.svg', verified: false },
    video: '/placeholder.svg',
    caption: 'Quick cooking tip! Try this at home 👨‍🍳',
    likes: 892,
    comments: 156,
    shares: 78,
    views: 8900,
    liked: true,
    music: 'Trending Audio'
  }
];

export const ReelsViewer = () => {
  const [currentReel, setCurrentReel] = useState(0);
  const [muted, setMuted] = useState(true);
  const [reels, setReels] = useState(mockReels);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  const handleLike = (index: number) => {
    const updatedReels = [...reels];
    updatedReels[index].liked = !updatedReels[index].liked;
    updatedReels[index].likes += updatedReels[index].liked ? 1 : -1;
    setReels(updatedReels);
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentReel < reels.length - 1) {
      setCurrentReel(currentReel + 1);
    } else if (direction === 'up' && currentReel > 0) {
      setCurrentReel(currentReel - 1);
    }
  };

  const reel = reels[currentReel];

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          autoPlay
          muted={muted}
          playsInline
          controls={false}
        >
          <source src={reel.video} type="video/mp4" />
        </video>
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex">
        {/* Left side - scroll areas */}
        <div className="flex-1 flex flex-col">
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => handleScroll('up')}
          />
          <div 
            className="flex-1 cursor-pointer" 
            onClick={() => handleScroll('down')}
          />
        </div>

        {/* Right side - actions */}
        <div className="w-16 flex flex-col justify-end items-center pb-20 space-y-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleLike(currentReel)}
            className={`h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm ${
              reel.liked ? 'text-red-500' : 'text-white'
            }`}
          >
            <Heart className={`w-6 h-6 ${reel.liked ? 'fill-current' : ''}`} />
          </Button>
          <span className="text-white text-xs font-medium">{reel.likes}</span>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm text-white"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <span className="text-white text-xs font-medium">{reel.comments}</span>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm text-white"
          >
            <Share className="w-6 h-6" />
          </Button>
          <span className="text-white text-xs font-medium">{reel.shares}</span>

          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full bg-black/20 backdrop-blur-sm text-white"
          >
            <MoreHorizontal className="w-6 h-6" />
          </Button>

          <Avatar className="w-12 h-12 border-2 border-white">
            <AvatarImage src={reel.user.avatar} />
            <AvatarFallback>{reel.user.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-16 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={reel.user.avatar} />
            <AvatarFallback>{reel.user.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-white font-medium">@{reel.user.username}</span>
          {reel.user.verified && (
            <CheckCircle className="w-4 h-4 text-blue-500 fill-current" />
          )}
          <Button
            variant="outline"
            size="sm"
            className="ml-2 h-6 px-3 text-xs bg-transparent border-white text-white hover:bg-white hover:text-black"
          >
            Follow
          </Button>
        </div>
        <p className="text-white text-sm mb-2">{reel.caption}</p>
        {reel.music && (
          <div className="flex items-center space-x-2">
            <span className="text-white text-xs">♪ {reel.music}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-2">
          <Badge variant="secondary" className="text-xs">
            {reel.views.toLocaleString()} views
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMuted(!muted)}
            className="h-8 w-8 text-white"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 right-4 flex flex-col space-y-1">
        {reels.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full ${
              index === currentReel ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
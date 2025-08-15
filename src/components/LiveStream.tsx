import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StreamerSubscriptionModal } from './StreamerSubscriptionModal';
import { SubscriberBadge } from './SubscriberBadge';
import { Heart, MessageCircle, Share2, Users, Eye, Gift, Crown, Play, Send } from 'lucide-react';

interface LiveStream {
  id: string;
  streamer: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  title: string;
  category: string;
  viewers: number;
  thumbnail: string;
  isLive: boolean;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  isSubscriber?: boolean;
  tier?: 'gold' | 'diamond' | 'chrome' | 'custom';
}

const mockStreams: LiveStream[] = [
  {
    id: '1',
    streamer: { name: 'Gaming Pro', username: 'gamingpro', avatar: '/placeholder.svg', verified: true },
    title: 'Epic Gaming Session - Join Now!',
    category: 'Gaming',
    viewers: 1234,
    thumbnail: '/placeholder.svg',
    isLive: true
  },
  {
    id: '2',
    streamer: { name: 'Music Artist', username: 'musiclive', avatar: '/placeholder.svg', verified: false },
    title: 'Live Music Performance',
    category: 'Music',
    viewers: 892,
    thumbnail: '/placeholder.svg',
    isLive: true
  },
  {
    id: '3',
    streamer: { name: 'Chef Master', username: 'chefmaster', avatar: '/placeholder.svg', verified: true },
    title: 'Cooking Masterclass',
    category: 'Lifestyle',
    viewers: 567,
    thumbnail: '/placeholder.svg',
    isLive: true
  }
];

const topStreamers = [
  { rank: 1, name: 'StreamKing', followers: '2.1M', avatar: '/placeholder.svg' },
  { rank: 2, name: 'LiveQueen', followers: '1.8M', avatar: '/placeholder.svg' },
  { rank: 3, name: 'GameMaster', followers: '1.5M', avatar: '/placeholder.svg' },
];

const mockChat: ChatMessage[] = [
  { id: '1', user: 'user123', message: 'Amazing stream!', timestamp: '2m ago', isSubscriber: true, tier: 'tier2' },
  { id: '2', user: 'viewer456', message: 'Love this content', timestamp: '1m ago', isSubscriber: false },
  { id: '3', user: 'fan789', message: 'Keep it up!', timestamp: '30s ago', isSubscriber: true, tier: 'tier1' },
];

export const LiveStream = () => {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const categories = ['All', 'Gaming', 'Music', 'Lifestyle', 'Education', 'Sports'];

  const filteredStreams = activeCategory === 'All' 
    ? mockStreams 
    : mockStreams.filter(stream => stream.category === activeCategory);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  if (selectedStream) {
    return (
      <div className="h-screen flex flex-col bg-black">
        {/* Stream Header */}
        <div className="bg-black p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => setSelectedStream(null)}
              className="text-white"
            >
              ← Back
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={selectedStream.streamer.avatar} />
              <AvatarFallback>{selectedStream.streamer.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-white font-medium">{selectedStream.streamer.name}</h3>
              <p className="text-gray-300 text-sm">{selectedStream.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full mr-1" />
              LIVE
            </Badge>
            <div className="flex items-center space-x-1 text-white">
              <Users className="w-4 h-4" />
              <span className="text-sm">{selectedStream.viewers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Stream Content */}
        <div className="flex-1 flex">
          {/* Video Area */}
          <div className="flex-1 bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Live Stream Player</p>
              <p className="text-sm opacity-75">Video would be displayed here</p>
            </div>
          </div>

          <div className="w-80 bg-white border-l flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold">Live Chat</h3>
              <Button size="sm" onClick={() => setShowSubscriptionModal(true)} className="treesh-bg-red">
                Subscribe
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {mockChat.map((msg) => (
                  <div key={msg.id} className="flex items-start space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">{msg.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-primary">{msg.user}</span>
                        {msg.isSubscriber && msg.tier && (
                          <SubscriberBadge tier={msg.tier} size="sm" className="ml-2" />
                        )}
                        <span className="ml-2">{msg.message}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Live Streams</h1>
        <Button className="bg-primary hover:bg-primary-dark text-white font-inter w-full sm:w-auto">
          Go Live
        </Button>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-6 w-full max-w-2xl">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-6">
          {/* Top Streamers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span>Top Streamers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topStreamers.map((streamer) => (
                  <div key={streamer.rank} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                      {streamer.rank}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={streamer.avatar} />
                      <AvatarFallback>{streamer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{streamer.name}</p>
                      <p className="text-sm text-muted-foreground">{streamer.followers} followers</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Streams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStreams.map((stream) => (
              <Card key={stream.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedStream(stream)}>
                <div className="relative">
                  <img
                    src={stream.thumbnail}
                    alt={stream.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge variant="destructive" className="absolute top-2 left-2 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-1" />
                    LIVE
                  </Badge>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{stream.viewers.toLocaleString()}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={stream.streamer.avatar} />
                      <AvatarFallback>{stream.streamer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground">{stream.streamer.name}</p>
                      <Badge variant="outline" className="mt-1">{stream.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <StreamerSubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        streamerName={selectedStream?.streamer.name || 'Creator'}
        streamerId={selectedStream?.id || ''}
        tiers={[]}
      />
    </div>
  );
};
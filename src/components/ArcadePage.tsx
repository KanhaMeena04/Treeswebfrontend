import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Filter, 
  MessageCircle, 
  Heart, 
  X, 
  Users, 
  TrendingUp, 
  Star,
  Shield,
  MapPin,
  Flag,
  UserMinus,
  Lock,
  Camera,
  Settings,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Calendar,
  MapPin as LocationIcon,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Enhanced mock data for users to match with
const mockUsers = [
  {
    id: '1',
    name: 'Emma Wilson',
    age: 24,
    bio: 'Love traveling and photography 📸 Coffee addict and adventure seeker',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    location: 'New York, NY',
    distance: 5,
    interests: ['Travel', 'Photography', 'Coffee', 'Adventure'],
    verified: true,
    lastActive: '2 minutes ago',
    mutualFriends: 3,
    occupation: 'Photographer',
    education: 'NYU',
    height: '5\'6"',
    zodiac: 'Libra',
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
  },
  {
    id: '2',
    name: 'Alex Chen',
    age: 26,
    bio: 'Fitness enthusiast and dog lover 🐕 Always up for a good workout',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'Los Angeles, CA',
    distance: 8,
    interests: ['Fitness', 'Dogs', 'Hiking', 'Healthy Living'],
    verified: false,
    lastActive: '1 hour ago',
    mutualFriends: 1,
    occupation: 'Personal Trainer',
    education: 'UCLA',
    height: '6\'0"',
    zodiac: 'Capricorn',
    photos: ['/placeholder.svg', '/placeholder.svg']
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    age: 25,
    bio: 'Artist and coffee lover ☕ Creating beauty one brushstroke at a time',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    location: 'Chicago, IL',
    distance: 3,
    interests: ['Art', 'Coffee', 'Music', 'Creativity'],
    verified: true,
    lastActive: 'Online now',
    mutualFriends: 5,
    occupation: 'Art Director',
    education: 'SAIC',
    height: '5\'4"',
    zodiac: 'Pisces',
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
  },
  {
    id: '4',
    name: 'Michael Rodriguez',
    age: 28,
    bio: 'Tech entrepreneur by day, musician by night 🎸 Building the future one code at a time',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg'],
    location: 'San Francisco, CA',
    distance: 12,
    interests: ['Technology', 'Music', 'Entrepreneurship', 'Innovation'],
    verified: true,
    lastActive: '5 minutes ago',
    mutualFriends: 2,
    occupation: 'Tech CEO',
    education: 'Stanford',
    height: '5\'10"',
    zodiac: 'Aries',
    photos: ['/placeholder.svg', '/placeholder.svg']
  },
  {
    id: '5',
    name: 'Jessica Kim',
    age: 23,
    bio: 'Foodie and travel blogger 🌍 Exploring the world one plate at a time',
    avatar: '/placeholder.svg',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    location: 'Seattle, WA',
    distance: 6,
    interests: ['Food', 'Travel', 'Blogging', 'Culture'],
    verified: false,
    lastActive: '30 minutes ago',
    mutualFriends: 4,
    occupation: 'Travel Blogger',
    education: 'UW',
    height: '5\'5"',
    zodiac: 'Gemini',
    photos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
  }
];

// Mock matches data
const mockMatches = [
  {
    id: '1',
    user: mockUsers[0],
    matchedAt: '2024-01-19T18:00:00Z',
    chatPin: '1234',
    messages: [
      { id: '1', sender: 'system', text: 'You matched with Emma! 🎉', time: '2024-01-19T18:00:00Z' },
      { id: '2', sender: 'them', text: 'Hey! Love your profile 😊', time: '2024-01-19T18:05:00Z' },
      { id: '3', sender: 'me', text: 'Thanks! Yours too! How are you?', time: '2024-01-19T18:10:00Z' },
      { id: '4', sender: 'them', text: 'Your art is amazing!', time: '2024-01-19T18:20:00Z' },
      { id: '5', sender: 'me', text: 'Thanks! I love your creative energy', time: '2024-01-19T18:30:00Z' }
    ],
    lastMessage: 'Thanks! I love your creative energy',
    lastMessageTime: '2024-01-19T18:30:00Z',
    unreadCount: 0
  },
  {
    id: '2',
    user: mockUsers[2],
    matchedAt: '2024-01-18T14:30:00Z',
    chatPin: '5678',
    messages: [
      { id: '1', sender: 'system', text: 'You matched with Sarah! 🎉', time: '2024-01-18T14:30:00Z' },
      { id: '2', sender: 'them', text: 'Hi there! 👋', time: '2024-01-18T14:35:00Z' }
    ],
    lastMessage: 'Hi there! 👋',
    lastMessageTime: '2024-01-18T14:35:00Z',
    unreadCount: 1
  }
];

export const ArcadePage = () => {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [dislikedUsers, setDislikedUsers] = useState<string[]>([]);
  const [superLikedUsers, setSuperLikedUsers] = useState<string[]>([]);
  const [matches, setMatches] = useState(mockMatches);
  const [activeTab, setActiveTab] = useState('swipe');
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [maxDistance, setMaxDistance] = useState([50]);
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [onlyVerified, setOnlyVerified] = useState(false);
  
  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [chatPin, setChatPin] = useState('');
  const [isChatAuthenticated, setIsChatAuthenticated] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  // Match notification
  const [showMatchNotification, setShowMatchNotification] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  
  // Report/Block states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [userToReport, setUserToReport] = useState<any>(null);

  const currentUser = mockUsers[currentUserIndex];

  // Filter users based on preferences
  const filteredUsers = mockUsers.filter(user => {
    if (onlyVerified && !user.verified) return false;
    if (user.age < ageRange[0] || user.age > ageRange[1]) return false;
    if (user.distance > maxDistance[0]) return false;
    if (selectedInterests.length > 0 && !selectedInterests.some(interest => user.interests.includes(interest))) return false;
    return true;
  });

  const handleLike = (userId: string) => {
    setLikedUsers(prev => [...prev, userId]);
    setCurrentUserIndex(prev => prev + 1);
    
    // Simulate match (30% chance)
    if (Math.random() > 0.7) {
      const matchedUser = mockUsers.find(u => u.id === userId);
      if (matchedUser) {
        setMatchedUser(matchedUser);
        setShowMatchNotification(true);
        setTimeout(() => setShowMatchNotification(false), 5000);
        
        // Add to matches
        const newMatch = {
          id: Date.now().toString(),
          user: matchedUser,
          matchedAt: new Date().toISOString(),
          chatPin: Math.floor(1000 + Math.random() * 9000).toString(),
          messages: [
            { 
              id: '1', 
              sender: 'system', 
              text: `You matched with ${matchedUser.name}! 🎉`, 
              time: new Date().toISOString() 
            }
          ],
          lastMessage: `You matched with ${matchedUser.name}! 🎉`,
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0
        };
        setMatches(prev => [newMatch, ...prev]);
      }
    }
    
    toast({
      title: "Liked! 💖",
      description: "You liked this profile",
    });
  };

  const handleDislike = (userId: string) => {
    setDislikedUsers(prev => [...prev, userId]);
    setCurrentUserIndex(prev => prev + 1);
    
    toast({
      title: "Passed",
      description: "You passed on this profile",
    });
  };

  const handleSuperLike = (userId: string) => {
    setSuperLikedUsers(prev => [...prev, userId]);
    setCurrentUserIndex(prev => prev + 1);
    
    toast({
      title: "Super Liked! ⭐",
      description: "You super liked this profile!",
    });
  };

  const resetSwipeHistory = () => {
    setCurrentUserIndex(0);
    setLikedUsers([]);
    setDislikedUsers([]);
    setSuperLikedUsers([]);
    toast({
      title: "Reset Complete",
      description: "Swipe history has been reset",
    });
  };

  const handleBlockUser = (userId: string) => {
    // Remove from matches
    setMatches(prev => prev.filter(match => match.user.id !== userId));
    
    // Add to blocked users (you could store this in state)
    toast({
      title: "User Blocked",
      description: "This user has been blocked",
    });
    
    if (showChat) {
      setShowChat(false);
      setIsChatAuthenticated(false);
      setChatPin('');
    }
  };

  const handleReportUser = (user: any) => {
    setUserToReport(user);
    setShowReportModal(true);
  };

  const submitReport = () => {
    if (reportReason.trim()) {
      toast({
        title: "Report Submitted",
        description: "Thank you for your report. We'll review it shortly.",
      });
      setShowReportModal(false);
      setReportReason('');
      setUserToReport(null);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedMatch) return;
    
    const message = {
      id: Date.now().toString(),
      sender: 'me',
      text: newMessage,
      time: new Date().toISOString()
    };
    
    setSelectedMatch(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      lastMessage: newMessage,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0
    }));
    
    // Update matches list
    setMatches(prev => prev.map(match => 
      match.id === selectedMatch.id 
        ? { ...match, lastMessage: newMessage, lastMessageTime: new Date().toISOString(), unreadCount: 0 }
        : match
    ));
    
    setNewMessage('');
    
    // Simulate response
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        sender: 'them',
        text: 'Thanks for the message! 😊',
        time: new Date().toISOString()
      };
      
      setSelectedMatch(prev => ({
        ...prev,
        messages: [...prev.messages, response],
        lastMessage: 'Thanks for the message! 😊',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1
      }));
      
      // Update matches list
      setMatches(prev => prev.map(match => 
        match.id === selectedMatch.id 
          ? { ...match, lastMessage: 'Thanks for the message! 😊', lastMessageTime: new Date().toISOString(), unreadCount: 1 }
          : match
      ));
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleChatPinSubmit = () => {
    if (chatPin === selectedMatch?.chatPin) {
      setIsChatAuthenticated(true);
      toast({
        title: "Chat Unlocked! 🔓",
        description: "You can now chat with your match",
      });
    } else {
      toast({
        title: "Incorrect PIN",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const nextImage = () => {
    if (currentUser && currentUser.photos.length > 1) {
      setCurrentImageIndex(prev => 
        prev === currentUser.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (currentUser && currentUser.photos.length > 1) {
      setCurrentImageIndex(prev => 
        prev === 0 ? currentUser.photos.length - 1 : prev - 1
      );
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-8 pb-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">No More Profiles</h2>
            <p className="text-muted-foreground mb-4">
              You've seen all available profiles. Check back later for new matches!
            </p>
            <Button onClick={resetSwipeHistory}>
              Reset Swipe History
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">Arcade – Matchmaking</h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Swipe, match, and connect with amazing people</p>
          </div>
          
          <div className="flex space-x-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="h-9 w-9 sm:h-10 sm:w-10"
            >
              <Filter className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              onClick={resetSwipeHistory}
              className="h-9 sm:h-10 text-xs sm:text-sm"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Discovery Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-sm sm:text-base">Gender Preference</Label>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger className="h-9 sm:h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm sm:text-base">Age Range: {ageRange[0]} - {ageRange[1]}</Label>
                  <Slider
                    value={ageRange}
                    onValueChange={setAgeRange}
                    max={60}
                    min={18}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm sm:text-base">Max Distance: {maxDistance[0]} km</Label>
                  <Slider
                    value={maxDistance}
                    onValueChange={setMaxDistance}
                    max={100}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-sm sm:text-base">Interests</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Travel', 'Photography', 'Fitness', 'Art', 'Gaming', 'Food', 'Music', 'Technology'].map((interest) => (
                      <Button
                        key={interest}
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedInterests(prev => 
                            prev.includes(interest) 
                              ? prev.filter(i => i !== interest)
                              : [...prev, interest]
                          );
                        }}
                        className="justify-start text-xs sm:text-sm h-8 sm:h-9"
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified-only"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="verified-only" className="text-sm sm:text-base">Show only verified users</Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-10 sm:h-12">
            <TabsTrigger value="swipe" className="text-xs sm:text-sm">Swipe</TabsTrigger>
            <TabsTrigger value="matches" className="text-xs sm:text-sm">Matches ({matches.length})</TabsTrigger>
            <TabsTrigger value="stats" className="text-xs sm:text-sm">Stats</TabsTrigger>
          </TabsList>

          {/* Swipe Tab */}
          <TabsContent value="swipe" className="space-y-4 sm:space-y-6">
            <Card className="w-full max-w-sm sm:max-w-md mx-auto">
              <CardContent className="p-0">
                {/* Profile Image */}
                <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                  <img
                    src={currentUser.photos[currentImageIndex]}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Image Navigation */}
                  {currentUser.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      
                      {/* Image Dots */}
                      <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                        {currentUser.photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Profile Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{currentUser.name}, {currentUser.age}</h3>
                      {currentUser.verified && (
                        <Badge className="bg-blue-500">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm opacity-90 mb-2">{currentUser.bio}</p>
                    <div className="flex items-center space-x-4 text-xs opacity-75">
                      <span className="flex items-center">
                        <LocationIcon className="w-3 h-3 mr-1" />
                        {currentUser.location}
                      </span>
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {currentUser.mutualFriends} mutual friends
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4">
                  <div className="flex justify-center space-x-3 sm:space-x-4 mb-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 sm:w-12 sm:h-12 rounded-full border-red-300 hover:border-red-400"
                      onClick={() => handleDislike(currentUser.id)}
                    >
                      <X className="w-7 h-7 sm:w-6 sm:h-6 text-red-500" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 sm:w-12 sm:h-12 rounded-full border-yellow-300 hover:border-yellow-400"
                      onClick={() => handleSuperLike(currentUser.id)}
                    >
                      <Star className="w-7 h-7 sm:w-6 sm:h-6 text-yellow-500" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 sm:w-12 sm:h-12 rounded-full border-green-300 hover:border-green-400"
                      onClick={() => handleLike(currentUser.id)}
                    >
                      <Heart className="w-7 h-7 sm:w-6 sm:h-6 text-green-500" />
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Swipe right to like, left to pass</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-6">
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Matches Yet</h3>
                <p className="text-muted-foreground">
                  Start swiping to find your matches!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {matches.map((match) => (
                  <Card key={match.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={match.user.avatar} />
                          <AvatarFallback>{match.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold">{match.user.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Matched {new Date(match.matchedAt).toLocaleDateString()}
                          </p>
                          {match.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {match.unreadCount} new
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedMatch(match);
                            setShowChat(true);
                            setIsChatAuthenticated(false);
                            setChatPin('');
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReportUser(match.user)}
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBlockUser(match.user.id)}
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h3 className="text-2xl font-bold">{likedUsers.length}</h3>
                  <p className="text-muted-foreground">Profiles Liked</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-2xl font-bold">{superLikedUsers.length}</h3>
                  <p className="text-muted-foreground">Super Likes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-2xl font-bold">{matches.length}</h3>
                  <p className="text-muted-foreground">Total Matches</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold">
                    {likedUsers.length > 0 ? Math.round((matches.length / likedUsers.length) * 100) : 0}%
                  </h3>
                  <p className="text-muted-foreground">Match Rate</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-2xl font-bold">{dislikedUsers.length}</h3>
                  <p className="text-muted-foreground">Profiles Passed</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Match Notification */}
        {showMatchNotification && matchedUser && (
          <div className="fixed top-4 left-4 right-4 sm:right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm mx-auto sm:mx-0">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6" />
              <div>
                <h4 className="font-semibold">It's a Match! 🎉</h4>
                <p className="text-sm">You and {matchedUser.name} liked each other!</p>
                <Button 
                  size="sm" 
                  className="mt-2 bg-white text-green-500 hover:bg-gray-100"
                  onClick={() => {
                    setShowMatchNotification(false);
                    setActiveTab('matches');
                  }}
                >
                  View Match
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Modal */}
        <Dialog open={showChat} onOpenChange={setShowChat}>
          <DialogContent className="w-[95vw] max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Chat with {selectedMatch?.user.name}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {!isChatAuthenticated ? (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-yellow-600 mb-2">
                      <Lock className="w-5 h-5" />
                      <span className="font-semibold">Secure Chat</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Enter the 4-digit PIN to unlock secure chat with {selectedMatch?.user.name}.
                    </p>
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2, 3].map((index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength={1}
                        className="w-14 h-14 sm:w-12 sm:h-12 text-center text-lg font-mono"
                        value={chatPin[index] || ''}
                        onChange={(e) => {
                          const newPin = chatPin.split('');
                          newPin[index] = e.target.value;
                          setChatPin(newPin.join(''));
                          
                          // Auto-focus next input
                          if (e.target.value && index < 3) {
                            const nextInput = e.target.parentElement?.nextElementSibling?.querySelector('input');
                            if (nextInput) nextInput.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleChatPinSubmit}
                    disabled={chatPin.length !== 4}
                    className="w-full"
                  >
                    Unlock Chat
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    PIN: {selectedMatch?.chatPin} (for demo purposes)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-green-600 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">Secure Chat Active</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your conversation with {selectedMatch?.user.name} is now encrypted and secure.
                    </p>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="border rounded-lg p-4 min-h-64 max-h-96 overflow-y-auto">
                    {selectedMatch?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-3 flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg ${
                            message.sender === 'me'
                              ? 'bg-blue-500 text-white'
                              : message.sender === 'system'
                              ? 'bg-gray-200 text-gray-700 mx-auto'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowChat(false);
                        setIsChatAuthenticated(false);
                        setChatPin('');
                      }}
                    >
                      Close Chat
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleBlockUser(selectedMatch?.user.id)}
                    >
                      <UserMinus className="w-4 h-4 mr-2" />
                      Block User
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Report Modal */}
        <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
          <DialogContent className="w-[95vw] max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Flag className="w-5 h-5 text-red-500" />
                <span>Report User</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Report {userToReport?.name} for inappropriate behavior or content.
              </p>
              
              <div>
                <Label htmlFor="report-reason">Reason for Report</Label>
                <Select value={reportReason} onValueChange={setReportReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="fake">Fake Profile</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitReport}
                  disabled={!reportReason}
                  className="flex-1"
                >
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

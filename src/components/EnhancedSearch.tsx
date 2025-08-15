import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, Hash, Image, Video, Users, TrendingUp } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'hashtag' | 'reel';
  title: string;
  subtitle: string;
  avatar?: string;
  image?: string;
  verified?: boolean;
  followers?: number;
  likes?: number;
  hashtag?: string;
  postCount?: number;
}

const mockSearchResults: SearchResult[] = [
  // Users
  {
    id: '1',
    type: 'user',
    title: 'Alice Johnson',
    subtitle: '@alice • Digital Creator',
    avatar: '/placeholder.svg',
    verified: true,
    followers: 12500
  },
  {
    id: '2',
    type: 'user',
    title: 'Bob Smith',
    subtitle: '@bob • Fitness Enthusiast',
    avatar: '/placeholder.svg',
    verified: false,
    followers: 3400
  },
  // Posts
  {
    id: '3',
    type: 'post',
    title: 'Beautiful sunset today! 🌅',
    subtitle: 'Posted by @alice • 2h ago',
    image: '/placeholder.svg',
    likes: 234
  },
  {
    id: '4',
    type: 'post',
    title: 'New recipe alert! 👨‍🍳',
    subtitle: 'Posted by @chefmaster • 4h ago',
    image: '/placeholder.svg',
    likes: 156
  },
  // Hashtags
  {
    id: '5',
    type: 'hashtag',
    title: '#sunset',
    subtitle: '12.5K posts',
    hashtag: 'sunset',
    postCount: 12500
  },
  {
    id: '6',
    type: 'hashtag',
    title: '#fitness',
    subtitle: '8.9K posts',
    hashtag: 'fitness',
    postCount: 8900
  },
  // Reels
  {
    id: '7',
    type: 'reel',
    title: 'Quick workout routine 💪',
    subtitle: 'By @bob • 1.2K views',
    image: '/placeholder.svg',
    likes: 89
  }
];

export const EnhancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter and search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      let filtered = mockSearchResults.filter(result => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          result.title.toLowerCase().includes(query) ||
          result.subtitle.toLowerCase().includes(query);
        
        if (filterType === 'all') return matchesQuery;
        return result.type === filterType && matchesQuery;
      });

      // Sort results
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'relevance':
            return 0; // Keep original order for relevance
          case 'popularity':
            return (b.followers || b.likes || 0) - (a.followers || a.likes || 0);
          case 'recent':
            return 0; // Would sort by timestamp in real app
          default:
            return 0;
        }
      });

      setResults(filtered);
      setLoading(false);
    }, 500);
  }, [searchQuery, filterType, sortBy]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'post':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'hashtag':
        return <Hash className="w-4 h-4 text-purple-500" />;
      case 'reel':
        return <Video className="w-4 h-4 text-red-500" />;
      default:
        return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderSearchResult = (result: SearchResult) => {
    switch (result.type) {
      case 'user':
        return (
          <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={result.avatar} />
                  <AvatarFallback>{result.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{result.title}</h3>
                    {result.verified && (
                      <Badge className="bg-blue-500 text-white text-xs">✓</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {result.followers?.toLocaleString()} followers
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">Follow</Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'post':
        return (
          <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                  <img src={result.image} alt="Post" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-2">{result.title}</h3>
                  <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {result.likes?.toLocaleString()} likes
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'hashtag':
        return (
          <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Hash className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-600">{result.title}</h3>
                    <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Follow</Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'reel':
        return (
          <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                  <img src={result.image} alt="Reel" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-2">{result.title}</h3>
                  <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {result.likes?.toLocaleString()} likes
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Search Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Search</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users, posts, hashtags, reels..."
              className="pl-10 font-inter text-base sm:text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Search Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="post">Posts</SelectItem>
              <SelectItem value="hashtag">Hashtags</SelectItem>
              <SelectItem value="reel">Reels</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="recent">Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                <TabsTrigger value="all" className="text-xs sm:text-sm">All ({results.length})</TabsTrigger>
                <TabsTrigger value="users" className="text-xs sm:text-sm">
                  Users ({results.filter(r => r.type === 'user').length})
                </TabsTrigger>
                <TabsTrigger value="posts" className="text-xs sm:text-sm">
                  Posts ({results.filter(r => r.type === 'post').length})
                </TabsTrigger>
                <TabsTrigger value="hashtags" className="text-xs sm:text-sm">
                  Hashtags ({results.filter(r => r.type === 'hashtag').length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Searching...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map(renderSearchResult)}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try different keywords or check your spelling
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <div className="space-y-4">
                  {results.filter(r => r.type === 'user').map(renderSearchResult)}
                </div>
              </TabsContent>

              <TabsContent value="posts" className="mt-6">
                <div className="space-y-4">
                  {results.filter(r => r.type === 'post').map(renderSearchResult)}
                </div>
              </TabsContent>

              <TabsContent value="hashtags" className="mt-6">
                <div className="space-y-4">
                  {results.filter(r => r.type === 'hashtag').map(renderSearchResult)}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Search Suggestions */}
        {!searchQuery && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">Start searching</h3>
            <p className="text-muted-foreground mb-6">
              Search for users, posts, hashtags, and reels
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              <div className="text-center p-3 sm:p-4 rounded-lg bg-gray-50">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium">Users</p>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-gray-50">
                <Image className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium">Posts</p>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-gray-50">
                <Hash className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium">Hashtags</p>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-gray-50">
                <Video className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mx-auto mb-2" />
                <p className="text-xs sm:text-sm font-medium">Reels</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Grid3X3, 
  Bookmark, 
  Filter,
  FolderOpen,
  Calendar,
  Heart,
  MessageCircle
} from 'lucide-react';

interface SavedPost {
  id: string;
  image: string;
  type: 'post' | 'reel';
  caption: string;
  savedAt: Date;
  category?: string;
  tags?: string[];
}

const mockSavedPosts: SavedPost[] = [
  {
    id: '1',
    image: '/placeholder.svg',
    type: 'post',
    caption: 'Beautiful sunset! 🌅',
    savedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'Nature',
    tags: ['sunset', 'nature', 'photography']
  },
  {
    id: '2',
    image: '/placeholder.svg',
    type: 'reel',
    caption: 'Quick workout routine 💪',
    savedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    category: 'Fitness',
    tags: ['workout', 'fitness', 'health']
  },
  {
    id: '3',
    image: '/placeholder.svg',
    type: 'post',
    caption: 'Coffee time ☕',
    savedAt: new Date(Date.now() - 30 * 60 * 1000),
    category: 'Lifestyle',
    tags: ['coffee', 'lifestyle', 'relaxation']
  },
  {
    id: '4',
    image: '/placeholder.svg',
    type: 'post',
    caption: 'Travel memories ✈️',
    savedAt: new Date(Date.now() - 15 * 60 * 1000),
    category: 'Travel',
    tags: ['travel', 'memories', 'adventure']
  }
];

const categories = ['All', 'Nature', 'Fitness', 'Lifestyle', 'Travel', 'Food', 'Art', 'Technology'];

export const SavedPosts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>(mockSavedPosts);

  const filteredPosts = savedPosts.filter(post => {
    const matchesSearch = post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRemoveSaved = (postId: string) => {
    setSavedPosts(prev => prev.filter(post => post.id !== postId));
  };

  const formatSavedTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (savedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bookmark className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No saved posts yet</h3>
        <p className="text-muted-foreground mb-4">
          Posts you save will appear here for easy access
        </p>
        <Button variant="outline">
          <Bookmark className="w-4 h-4 mr-2" />
          Start Saving Posts
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Saved Posts</h2>
          <p className="text-muted-foreground">
            {savedPosts.length} saved {savedPosts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search saved posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts Grid/List */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground">No posts found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`group relative ${
                viewMode === 'grid' 
                  ? 'aspect-square' 
                  : 'flex items-center gap-4 p-4 border rounded-lg'
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden rounded-lg ${
                viewMode === 'grid' ? 'w-full h-full' : 'w-20 h-20'
              }`}>
                <img
                  src={post.image}
                  alt="Saved post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Post Type Badge */}
                {post.type === 'reel' && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-blue-500 text-white text-xs">
                      <span className="mr-1">▶</span> Reel
                    </Badge>
                  </div>
                )}

                {/* Category Badge */}
                {post.category && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {post.category}
                    </Badge>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveSaved(post.id)}
                      className="bg-white/20 hover:bg-white/30 border-white text-white"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content (List View) */}
              {viewMode === 'list' && (
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatSavedTime(post.savedAt)}
                    </span>
                  </div>
                  
                  <p className="font-medium mb-2">{post.caption}</p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Caption (Grid View) */}
              {viewMode === 'grid' && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-white text-sm truncate">{post.caption}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/70 text-xs">
                      {formatSavedTime(post.savedAt)}
                    </span>
                    {post.category && (
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Saved Posts Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{savedPosts.length}</div>
            <div className="text-sm text-muted-foreground">Total Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {savedPosts.filter(p => p.type === 'post').length}
            </div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {savedPosts.filter(p => p.type === 'reel').length}
            </div>
            <div className="text-sm text-muted-foreground">Reels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {new Set(savedPosts.map(p => p.category)).size}
            </div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

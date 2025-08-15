import { useState, useEffect, useCallback, useRef } from 'react';
import { FeedPost } from './FeedPost';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

interface Post {
  id: string;
  user: { name: string; username: string; avatar: string; verified: boolean };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  saved: boolean;
  type: 'post' | 'psa';
}

interface InfiniteScrollFeedProps {
  onReport?: (type: 'post', targetId: string, targetName?: string) => void;
}

// Mock data generator for infinite scroll
const generateMockPosts = (page: number): Post[] => {
  const posts: Post[] = [];
  const startId = page * 10;
  
  for (let i = 0; i < 10; i++) {
    const postId = startId + i;
    const isPSA = postId % 5 === 0; // Every 5th post is a PSA
    
    posts.push({
      id: postId.toString(),
      user: { 
        name: `User ${postId}`, 
        username: `user${postId}`, 
        avatar: '/placeholder.svg', 
        verified: postId % 3 === 0 
      },
      content: isPSA 
        ? `🚨 IMPORTANT: This is PSA #${postId}. Please read carefully.`
        : `This is post #${postId} with some interesting content! 📱✨`,
      image: postId % 2 === 0 ? '/placeholder.svg' : undefined,
      timestamp: `${Math.floor(Math.random() * 24)}h ago`,
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      shares: Math.floor(Math.random() * 50),
      liked: false,
      saved: false,
      type: isPSA ? 'psa' : 'post'
    });
  }
  
  return posts;
};

export const InfiniteScrollFeed = ({ onReport }: InfiniteScrollFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const observer = useRef<IntersectionObserver>();
  const lastPostRef = useRef<HTMLDivElement>(null);

  // Load initial posts
  useEffect(() => {
    loadPosts(0, true);
  }, []);

  // Load posts function
  const loadPosts = useCallback(async (pageNum: number, isInitial = false) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPosts = generateMockPosts(pageNum);
      
      if (isInitial) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      
      setPage(pageNum);
      setHasMore(newPosts.length === 10); // If we get less than 10 posts, we've reached the end
      
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Load more posts when scrolling
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadPosts(page + 1);
    }
  }, [loading, hasMore, page, loadPosts]);

  // Refresh feed
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts(0, true);
    setRefreshing(false);
  };

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (lastPostRef.current) {
      observer.current.observe(lastPostRef.current);
    }
    
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, hasMore, loadMore]);

  // Handle post interactions
  const handlePostUpdate = (postId: string, updates: Partial<Post>) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  };

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => loadPosts(0, true)}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="mb-4"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh Feed
        </Button>
      </div>

      {/* Posts */}
      {posts.map((post, index) => (
        <div key={post.id} ref={index === posts.length - 1 ? lastPostRef : null}>
          <FeedPost 
            post={post} 
            onReport={onReport}
          />
        </div>
      ))}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading more posts...</p>
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-1 bg-gray-300 mx-auto mb-4 rounded-full" />
          <p className="text-muted-foreground">You've reached the end of your feed</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later for more content!
          </p>
        </div>
      )}

      {/* Error State */}
      {error && posts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

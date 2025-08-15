import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  Send,
  ThumbsUp,
  Smile,
  Flag,
  Copy,
  Link,
  Download
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PostDetailProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostData;
}

interface PostData {
  id: string;
  image: string;
  type: 'post' | 'reel';
  likes: number;
  caption: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  timestamp: string;
  location?: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  text: string;
  timestamp: string;
  likes: number;
}

const mockComments: Comment[] = [
  {
    id: '1',
    user: {
      name: 'Alice Johnson',
      username: 'alice',
      avatar: '/placeholder.svg',
      verified: true
    },
    text: 'Beautiful! Love this shot 📸',
    timestamp: '2h ago',
    likes: 5
  },
  {
    id: '2',
    user: {
      name: 'Bob Smith',
      username: 'bob',
      avatar: '/placeholder.svg',
      verified: false
    },
    text: 'Amazing composition!',
    timestamp: '1h ago',
    likes: 3
  },
  {
    id: '3',
    user: {
      name: 'Emma Wilson',
      username: 'emma',
      avatar: '/placeholder.svg',
      verified: true
    },
    text: 'This is incredible! 🔥',
    timestamp: '30m ago',
    likes: 2
  }
];

export const PostDetail: React.FC<PostDetailProps> = ({
  isOpen,
  onClose,
  post
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? 'Post unliked' : 'Post liked!',
      description: isLiked ? 'You unliked this post' : 'You liked this post',
    });
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? 'Post unsaved' : 'Post saved!',
      description: isSaved ? 'Post removed from saved' : 'Post added to saved',
    });
  };

  const handleComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        username: 'you',
        avatar: '/placeholder.svg',
        verified: false
      },
      text: commentText,
      timestamp: 'Just now',
      likes: 0
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText('');
    
    toast({
      title: 'Comment added!',
      description: 'Your comment has been posted successfully',
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast({
      title: 'Link copied!',
      description: 'Post link has been copied to clipboard',
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = post.image;
    link.download = `post-${post.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Download started!',
      description: 'Post image is being downloaded',
    });
  };

  const handleReport = () => {
    toast({
      title: 'Post reported',
      description: 'Thank you for helping keep our community safe',
    });
    setShowMoreOptions(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="flex">
          {/* Image Section */}
          <div className="flex-1">
            <div className="relative">
              <img
                src={post.image}
                alt="Post"
                className="w-full h-[600px] object-cover"
              />
              
              {/* Post Type Badge */}
              {post.type === 'reel' && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-500 text-white">
                    <span className="mr-1">▶</span> Reel
                  </Badge>
                </div>
              )}
              
              {/* More Options Button */}
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black/20 hover:bg-black/40 text-white"
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
                
                {/* More Options Menu */}
                {showMoreOptions && (
                  <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                    <button
                      onClick={handleShare}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button
                      onClick={handleDownload}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={handleReport}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <Flag className="w-4 h-4" />
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 max-w-md border-l">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.user.name}</span>
                      {post.user.verified && (
                        <Badge className="bg-blue-500 text-xs">✓</Badge>
                      )}
                    </div>
                    {post.location && (
                      <p className="text-sm text-muted-foreground">{post.location}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Caption */}
            <div className="p-4 border-b">
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{post.user.name}</span>
                    <span className="text-sm text-muted-foreground">{post.caption}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto max-h-[300px]">
              <div className="p-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.user.name}</span>
                        {comment.user.verified && (
                          <Badge className="bg-blue-500 text-xs">✓</Badge>
                        )}
                        <span className="text-sm text-muted-foreground">{comment.text}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{comment.timestamp}</span>
                        <button className="hover:text-foreground">Like</button>
                        <button className="hover:text-foreground">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${
                      isLiked ? 'text-red-500' : 'text-foreground'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes + (isLiked ? 1 : 0)}</span>
                  </button>
                  
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-sm">{comments.length}</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
                
                <button
                  onClick={handleSave}
                  className={`hover:opacity-80 transition-opacity ${
                    isSaved ? 'text-blue-500' : 'text-foreground'
                  }`}
                >
                  <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Add Comment */}
              <div className="flex items-center gap-2">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

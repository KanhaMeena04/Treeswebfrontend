import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image, Video, Camera, AlertCircle, CheckCircle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'post' | 'story' | 'reel';
}

const streamCategories = [
  'Gaming',
  'Music',
  'Art & Creativity',
  'Lifestyle',
  'Education',
  'Sports',
  'Technology',
  'Entertainment',
  'Other'
];

// File size limits in MB
const FILE_SIZE_LIMITS = {
  post: { image: 10, video: 100 },
  story: { image: 5, video: 50 },
  reel: { video: 100 }
};

// Supported file types
const SUPPORTED_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/webm']
};

export const UploadModal = ({ isOpen, onClose, type }: UploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [streamCategory, setStreamCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // File validation
    if (!selectedFile) {
      newErrors.file = 'Please select a file to upload';
    } else {
      // File type validation
      const isImage = selectedFile.type.startsWith('image/');
      const isVideo = selectedFile.type.startsWith('video/');
      
      if (type === 'reel' && !isVideo) {
        newErrors.file = 'Reels must be video files';
      } else if (!isImage && !isVideo) {
        newErrors.file = 'Please select a valid image or video file';
      }

      // File size validation
      const fileSizeMB = selectedFile.size / (1024 * 1024);
      const maxSize = isImage ? FILE_SIZE_LIMITS[type].image : FILE_SIZE_LIMITS[type].video;
      
      if (fileSizeMB > maxSize) {
        newErrors.file = `File size must be less than ${maxSize}MB`;
      }
    }

    // Caption validation
    if (caption.length > 2000) {
      newErrors.caption = 'Caption cannot exceed 2000 characters';
    }

    // Stream validation (for live streams)
    if (type === 'live') {
      if (!streamTitle.trim()) {
        newErrors.streamTitle = 'Stream title is required';
      } else if (streamTitle.length > 100) {
        newErrors.streamTitle = 'Stream title cannot exceed 100 characters';
      }
      
      if (!streamCategory) {
        newErrors.streamCategory = 'Please select a stream category';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleUpload = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before uploading',
        variant: 'destructive'
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Upload completed:', {
        type,
        file: selectedFile?.name,
        caption,
        streamTitle,
        streamCategory
      });
      
      toast({
        title: 'Upload Successful!',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} has been uploaded successfully`,
      });
      
      handleClose();
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCaption('');
    setStreamTitle('');
    setStreamCategory('');
    setIsUploading(false);
    setErrors({});
    setDragActive(false);
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'post': return 'Create New Post';
      case 'story': return 'Add to Story';
      case 'reel': return 'Create Reel';
      default: return 'Upload Content';
    }
  };

  const getAcceptedTypes = () => {
    switch (type) {
      case 'post': return 'image/*,video/*';
      case 'story': return 'image/*,video/*';
      case 'reel': return 'video/*';
      default: return 'image/*,video/*';
    }
  };

  const getFileSizeLimit = () => {
    if (type === 'reel') return `${FILE_SIZE_LIMITS.reel.video}MB`;
    return `${FILE_SIZE_LIMITS[type].image}MB for images, ${FILE_SIZE_LIMITS[type].video}MB for videos`;
  };

  const removeFile = () => {
    setSelectedFile(null);
    setErrors(prev => ({ ...prev, file: '' }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Media File *</Label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
              } ${errors.file ? 'border-red-500 bg-red-50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    {selectedFile.type.startsWith('image/') ? (
                      <Image className="w-12 h-12 text-green-500" />
                    ) : (
                      <Video className="w-12 h-12 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Button variant="outline" size="sm" onClick={removeFile}>
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className={`w-12 h-12 mx-auto ${errors.file ? 'text-red-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium">
                      {dragActive ? 'Drop your file here' : 'Drag & drop or click to select'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {type === 'reel' ? 'Select a video file' : 'Select an image or video'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max size: {getFileSizeLimit()}
                    </p>
                  </div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Choose File</span>
                    </Button>
                    <Input
                      id="file-upload"
                      type="file"
                      accept={getAcceptedTypes()}
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </Label>
                </div>
              )}
            </div>
            
            {/* File Error */}
            {errors.file && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.file}</span>
              </div>
            )}
          </div>
          
          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption">
              {type === 'story' ? 'Add text (optional)' : 'Caption'}
            </Label>
            <Textarea
              id="caption"
              placeholder={`Write a ${type === 'story' ? 'message' : 'caption'}...`}
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                if (errors.caption) setErrors(prev => ({ ...prev, caption: '' }));
              }}
              rows={3}
              maxLength={2000}
              className={errors.caption ? 'border-red-500 focus:border-red-500' : ''}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {errors.caption && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.caption}</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {caption.length}/2000
              </span>
            </div>
          </div>
          
          {/* Additional options for reels */}
          {type === 'reel' && (
            <div className="space-y-2">
              <Label>Reel Settings</Label>
              <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded">
                <ul className="space-y-1">
                  <li>• Keep videos under 60 seconds for best engagement</li>
                  <li>• Use trending audio for better reach</li>
                  <li>• Add relevant hashtags in caption</li>
                  <li>• Ensure good lighting and clear audio</li>
                </ul>
              </div>
            </div>
          )}
          
          {/* Story expiry notice */}
          {type === 'story' && (
            <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded border border-blue-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>Your story will be visible for 24 hours</span>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1" disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                `Share ${type}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Go Live Modal
export const GoLiveModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [streamTitle, setStreamTitle] = useState('');
  const [streamCategory, setStreamCategory] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!streamTitle.trim()) {
      newErrors.streamTitle = 'Stream title is required';
    } else if (streamTitle.length > 100) {
      newErrors.streamTitle = 'Stream title cannot exceed 100 characters';
    }
    
    if (!streamCategory) {
      newErrors.streamCategory = 'Please select a stream category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoLive = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before going live',
        variant: 'destructive'
      });
      return;
    }
    
    setIsStarting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Going live:', { streamTitle, streamCategory });
      
      toast({
        title: 'Going Live!',
        description: 'Your stream is starting...',
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start stream. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleClose = () => {
    setStreamTitle('');
    setStreamCategory('');
    setIsStarting(false);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Go Live</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stream-title">Stream Title *</Label>
            <Input
              id="stream-title"
              placeholder="What's your stream about?"
              value={streamTitle}
              onChange={(e) => {
                setStreamTitle(e.target.value);
                if (errors.streamTitle) setErrors(prev => ({ ...prev, streamTitle: '' }));
              }}
              maxLength={100}
              className={errors.streamTitle ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.streamTitle && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.streamTitle}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground text-right">
              {streamTitle.length}/100
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stream-category">Category *</Label>
            <Select 
              value={streamCategory} 
              onValueChange={(value) => {
                setStreamCategory(value);
                if (errors.streamCategory) setErrors(prev => ({ ...prev, streamCategory: '' }));
              }}
            >
              <SelectTrigger className={errors.streamCategory ? 'border-red-500 focus:border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {streamCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.streamCategory && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.streamCategory}</span>
              </div>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground bg-red-50 p-3 rounded border border-red-200">
            <div className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-red-500" />
              <span>You'll be live to all your followers</span>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1" disabled={isStarting}>
              Cancel
            </Button>
            <Button 
              onClick={handleGoLive} 
              disabled={!streamTitle.trim() || !streamCategory || isStarting}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isStarting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Starting...</span>
                </div>
              ) : (
                'Go Live'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
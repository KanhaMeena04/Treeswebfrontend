import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, UserPlus, Megaphone, Settings, Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const mockNotifications = [
  {
    id: '1',
    type: 'like',
    user: { name: 'Alice Johnson', avatar: '/placeholder.svg' },
    content: 'liked your post',
    timestamp: '2m ago',
    read: false
  },
  {
    id: '2',
    type: 'match',
    user: { name: 'Bob Smith', avatar: '/placeholder.svg' },
    content: 'You have a new match!',
    timestamp: '1h ago',
    read: false
  },
  {
    id: '3',
    type: 'comment',
    user: { name: 'Emma Wilson', avatar: '/placeholder.svg' },
    content: 'commented on your post: "Amazing photo!"',
    timestamp: '3h ago',
    read: true
  },
  {
    id: '4',
    type: 'psa',
    user: { name: 'Admin', avatar: '/placeholder.svg' },
    content: 'New community guidelines are now in effect',
    timestamp: '1d ago',
    read: true
  },
  {
    id: '5',
    type: 'follow',
    user: { name: 'John Doe', avatar: '/placeholder.svg' },
    content: 'started following you',
    timestamp: '2d ago',
    read: true
  }
];

const notificationSettings = {
  likes: true,
  comments: true,
  matches: true,
  follows: true,
  psa: true,
  messages: true
};

export const NotificationPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState(notificationSettings);
  const [unreadCount, setUnreadCount] = useState(
    notifications.filter(n => !n.read).length
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'match':
        return <Heart className="w-4 h-4 text-pink-500" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'psa':
        return <Megaphone className="w-4 h-4 text-orange-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const updateSetting = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-10 bg-offwhite border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
            <Button variant="ghost" size="sm" onClick={() => {}}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        {!isMobile && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 font-treesh">Notifications</h1>
            <p className="text-gray-600 mt-1">Stay updated with what's happening</p>
          </div>
        )}

        {/* Notification Settings */}
        <div className="mb-6 p-4 bg-offwhite border border-gray-200 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Push Notifications</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Email Notifications</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">SMS Notifications</span>
              <Switch />
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <Card 
              key={index} 
              className={`transition-colors duration-200 ${
                notification.read 
                  ? 'bg-offwhite border-gray-200' 
                  : 'bg-white border-primary/20 shadow-sm'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {notification.user}
                      </span>
                      <span className="text-sm text-gray-500">
                        {notification.action}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                      {!notification.read && (
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500">When you get notifications, they'll appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};
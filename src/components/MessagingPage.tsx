import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Search, MoreVertical, Image, Paperclip, AlertCircle, Smile, Mic, Video, ArrowLeft, Phone, Video as VideoCall, MessageCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const mockChats = [
  {
    id: '1',
    user: { name: 'Alice Johnson', avatar: '/placeholder.svg', online: true, username: 'alice' },
    lastMessage: 'Hey! How are you?',
    timestamp: '2m ago',
    unread: 2,
    type: 'general'
  },
  {
    id: '2',
    user: { name: 'Bob Smith', avatar: '/placeholder.svg', online: false, username: 'bob' },
    lastMessage: 'Thanks for the match! 😊',
    timestamp: '1h ago',
    unread: 0,
    type: 'match'
  },
  {
    id: '3',
    user: { name: 'Emma Wilson', avatar: '/placeholder.svg', online: true, username: 'emma' },
    lastMessage: 'Love your new post!',
    timestamp: '3h ago',
    unread: 1,
    type: 'general'
  }
];

const mockMessages = [
  {
    id: '1',
    sender: 'Alice Johnson',
    content: 'Hey! How are you?',
    timestamp: '2:30 PM',
    isMe: false,
    type: 'text'
  },
  {
    id: '2',
    sender: 'Me',
    content: 'I\'m doing great! Thanks for asking.',
    timestamp: '2:32 PM',
    isMe: true,
    type: 'text'
  },
  {
    id: '3',
    sender: 'Alice Johnson',
    content: 'That\'s awesome! Want to grab coffee sometime?',
    timestamp: '2:33 PM',
    isMe: false,
    type: 'text'
  }
];

export const MessagingPage = () => {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  const isMobile = useIsMobile();

  const validateMessage = (message: string): boolean => {
    if (!message.trim()) {
      setMessageError('Message cannot be empty');
      return false;
    }
    if (message.length > 1000) {
      setMessageError('Message cannot exceed 1000 characters');
      return false;
    }
    setMessageError('');
    return true;
  };

  const handleSendMessage = async () => {
    if (!validateMessage(newMessage)) {
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const message = {
        id: Date.now().toString(),
        sender: 'Me',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        type: 'text'
      };

      setMessages([...messages, message]);
      setNewMessage('');
      setMessageError('');

      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate reply
        const reply = {
          id: (Date.now() + 1).toString(),
          sender: selectedChat.user.name,
          content: 'Thanks for your message! I\'ll get back to you soon.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          type: 'text'
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);

      toast({
        title: 'Message sent!',
        description: 'Your message has been delivered',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = mockChats.filter(chat => 
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlockUser = (userId: string) => {
    toast({
      title: 'User Blocked',
      description: 'User has been blocked successfully',
    });
  };

  const handleReportUser = (userId: string) => {
    toast({
      title: 'User Reported',
      description: 'Thank you for helping keep our community safe',
    });
  };

  const handleDeleteChat = (userId: string) => {
    toast({
      title: 'Chat Deleted',
      description: 'Chat history has been deleted',
    });
  };

  const handleAttachment = (type: 'image' | 'video' | 'file') => {
    toast({
      title: 'Attachment Feature',
      description: `${type} attachment feature coming soon!`,
    });
  };

  const handleVoiceMessage = () => {
    toast({
      title: 'Voice Message',
      description: 'Voice message feature coming soon!',
    });
  };

  const handleEmoji = () => {
    toast({
      title: 'Emoji Picker',
      description: 'Emoji picker feature coming soon!',
    });
  };

  const handleChatSelect = (chat: typeof mockChats[0]) => {
    setSelectedChat(chat);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackToChats = () => {
    setShowChatList(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 hover:bg-gray-100"
              onClick={() => setShowChatList(true)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-600">Chat with your connections</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          </div>
        </header>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)]">
          {/* Chat List */}
          <div className={`${isMobile ? (showChatList ? 'w-full' : 'hidden') : 'w-80'} bg-white border-r border-gray-200 flex flex-col`}>
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 text-sm"
                />
              </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {mockChats
                  .filter(chat => 
                    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChat?.id === chat.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedChat(chat);
                        if (isMobile) setShowChatList(false);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={chat.user.avatar} />
                            <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {chat.user.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">{chat.user.name}</h3>
                            <span className="text-xs text-gray-500">{chat.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                          {chat.type === 'match' && (
                            <Badge variant="secondary" className="text-xs mt-1">Match</Badge>
                          )}
                        </div>
                        {chat.unread > 0 && (
                          <Badge variant="destructive" className="ml-2">
                            {chat.unread > 9 ? '9+' : chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          {selectedChat && (
            <div className={`${isMobile ? (showChatList ? 'hidden' : 'w-full') : 'flex-1'} bg-white flex flex-col`}>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedChat.user.avatar} />
                        <AvatarFallback>{selectedChat.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {selectedChat.user.online && (
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedChat.user.name}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedChat.user.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <VideoCall className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Block User</DropdownMenuItem>
                        <DropdownMenuItem>Report User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isMe
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isMe ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <p className="text-sm">Typing...</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="h-10 pr-12"
                      maxLength={1000}
                    />
                    {messageError && (
                      <div className="absolute -top-6 left-0 text-xs text-red-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{messageError}</span>
                      </div>
                    )}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                      {newMessage.length}/1000
                    </div>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSending || !newMessage.trim()}
                    className="h-10 px-4"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* No Chat Selected */}
          {!selectedChat && !isMobile && (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
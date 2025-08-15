import { useState, useEffect } from 'react';
import { demoChatAPI, Chat, ChatMessage } from '@/services/demoData';
import { handleDemoError, handleDemoSuccess } from '@/services/demoData';

export const useChat = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoChatAPI.getChats();
      setChats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chats';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load chats');
    } finally {
      setIsLoading(false);
    }
  };

  const loadChat = async (chatId: string, pin: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const chat = await demoChatAPI.getChat(chatId, pin);
      setCurrentChat(chat);
      
      // Load messages for this chat
      const chatMessages = await demoChatAPI.getMessages(chatId, pin);
      setMessages(chatMessages);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chat';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load chat');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createChat = async (matchId: string): Promise<Chat | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const newChat = await demoChatAPI.createChat(matchId);
      
      // Add to chats list
      setChats(prev => [...prev, newChat]);
      
      handleDemoSuccess('Chat created successfully');
      return newChat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create chat';
      setError(errorMessage);
      handleDemoError(err, 'Failed to create chat');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (chatId: string, content: string, pin: string): Promise<ChatMessage | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const newMessage = await demoChatAPI.sendMessage(chatId, content, pin);
      
      // Add to messages
      setMessages(prev => [...prev, newMessage]);
      
      // Update current chat's last message
      if (currentChat && currentChat.id === chatId) {
        setCurrentChat(prev => prev ? {
          ...prev,
          lastMessage: newMessage,
          unreadCount: 0,
        } : null);
      }
      
      // Update chats list
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, lastMessage: newMessage, unreadCount: 0 }
          : chat
      ));
      
      return newMessage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      handleDemoError(err, 'Failed to send message');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pinMessage = async (chatId: string, messageId: string, pin: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await demoChatAPI.pinMessage(chatId, messageId, pin);
      
      // Update message in local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isPinned: true }
          : msg
      ));
      
      handleDemoSuccess('Message pinned successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pin message';
      setError(errorMessage);
      handleDemoError(err, 'Failed to pin message');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (chatId: string, pin: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await demoChatAPI.markAsRead(chatId, pin);
      
      // Update unread count in local state
      if (currentChat && currentChat.id === chatId) {
        setCurrentChat(prev => prev ? { ...prev, unreadCount: 0 } : null);
      }
      
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, unreadCount: 0 }
          : chat
      ));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark chat as read';
      setError(errorMessage);
      handleDemoError(err, 'Failed to mark chat as read');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveChat = async (chatId: string, pin: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await demoChatAPI.leaveChat(chatId, pin);
      
      // Remove from chats list
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // Clear current chat if it's the one being left
      if (currentChat && currentChat.id === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
      
      handleDemoSuccess('Left chat successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to leave chat';
      setError(errorMessage);
      handleDemoError(err, 'Failed to leave chat');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getChatPin = async (chatId: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await demoChatAPI.getChatPin(chatId);
      return result.chatPin;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get chat PIN';
      setError(errorMessage);
      handleDemoError(err, 'Failed to get chat PIN');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetChatPin = async (chatId: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await demoChatAPI.resetChatPin(chatId);
      
      // Update current chat if it's the one being reset
      if (currentChat && currentChat.id === chatId) {
        setCurrentChat(prev => prev ? { ...prev, chatPin: result.chatPin } : null);
      }
      
      // Update chats list
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, chatPin: result.chatPin }
          : chat
      ));
      
      handleDemoSuccess('Chat PIN reset successfully');
      return result.chatPin;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset chat PIN';
      setError(errorMessage);
      handleDemoError(err, 'Failed to reset chat PIN');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = (chat: Chat | null) => {
    setCurrentChat(chat);
    if (chat) {
      setMessages([]); // Clear messages when switching chats
    }
  };

  const refreshChats = () => {
    loadChats();
  };

  const clearError = () => {
    setError(null);
  };

  return {
    chats,
    currentChat,
    messages,
    isLoading,
    error,
    loadChat,
    createChat,
    sendMessage,
    pinMessage,
    markAsRead,
    leaveChat,
    getChatPin,
    resetChatPin,
    selectChat,
    refreshChats,
    clearError,
  };
};

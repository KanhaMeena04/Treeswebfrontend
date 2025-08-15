import { useState, useEffect } from 'react';
import { demoArcadeAPI, UserPreference, Match } from '@/services/demoData';
import { handleDemoError, handleDemoSuccess } from '@/services/demoData';

export const useArcade = () => {
  const [preferences, setPreferences] = useState<UserPreference | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<Array<{
    id: string;
    name: string;
    avatar?: string;
    age: number;
    location: string;
    bio?: string;
    interests: string[];
    matchScore: number;
  }>>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [interactions, setInteractions] = useState<Array<{
    userId: string;
    userName: string;
    userAvatar?: string;
    action: 'like' | 'dislike' | 'super_like' | 'pass';
    timestamp: string;
  }>>([]);
  const [stats, setStats] = useState<{
    totalLikes: number;
    totalDislikes: number;
    totalSuperLikes: number;
    totalMatches: number;
    averageMatchScore: number;
  } | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<Array<{
    id: string;
    name: string;
    avatar?: string;
    blockedAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadPreferences();
    loadPotentialMatches();
    loadMatches();
    loadInteractions();
    loadStats();
    loadBlockedUsers();
  }, []);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoArcadeAPI.getPreferences();
      setPreferences(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load preferences';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPotentialMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoArcadeAPI.getPotentialMatches();
      setPotentialMatches(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load potential matches';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load potential matches');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoArcadeAPI.getMatches();
      setMatches(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load matches';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load matches');
    } finally {
      setIsLoading(false);
    }
  };

  const loadInteractions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoArcadeAPI.getInteractions();
      setInteractions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load interactions';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load interactions');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoArcadeAPI.getStats();
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load stats';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBlockedUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoArcadeAPI.getBlockedUsers();
      setBlockedUsers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load blocked users';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load blocked users');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreference>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedPreferences = await demoArcadeAPI.updatePreferences(updates);
      setPreferences(updatedPreferences);
      handleDemoSuccess('Preferences updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update preferences';
      setError(errorMessage);
      handleDemoError(err, 'Failed to update preferences');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const likeUser = async (userId: string): Promise<{ matched: boolean; matchId?: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await demoArcadeAPI.likeUser(userId);
      
      if (result.matched) {
        // Add to matches if it's a new match
        const newMatch: Match = {
          id: result.matchId!,
          userId: userId,
          matchedUserId: userId,
          matchedUserName: potentialMatches.find(u => u.id === userId)?.name || 'Unknown',
          matchedUserAvatar: potentialMatches.find(u => u.id === userId)?.avatar,
          matchDate: new Date().toISOString(),
          unreadCount: 0,
        };
        setMatches(prev => [...prev, newMatch]);
        handleDemoSuccess('It\'s a match! 🎉');
      } else {
        handleDemoSuccess('Like sent!');
      }

      // Remove from potential matches
      setPotentialMatches(prev => prev.filter(u => u.id !== userId));
      
      // Add to interactions
      const newInteraction = {
        userId,
        userName: potentialMatches.find(u => u.id === userId)?.name || 'Unknown',
        userAvatar: potentialMatches.find(u => u.id === userId)?.avatar,
        action: 'like' as const,
        timestamp: new Date().toISOString(),
      };
      setInteractions(prev => [newInteraction, ...prev]);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like user';
      setError(errorMessage);
      handleDemoError(err, 'Failed to like user');
      return { matched: false };
    } finally {
      setIsLoading(false);
    }
  };

  const superLikeUser = async (userId: string): Promise<{ matched: boolean; matchId?: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await demoArcadeAPI.superLikeUser(userId);
      
      if (result.matched) {
        // Add to matches if it's a new match
        const newMatch: Match = {
          id: result.matchId!,
          userId: userId,
          matchedUserId: userId,
          matchedUserName: potentialMatches.find(u => u.id === userId)?.name || 'Unknown',
          matchedUserAvatar: potentialMatches.find(u => u.id === userId)?.avatar,
          matchDate: new Date().toISOString(),
          unreadCount: 0,
        };
        setMatches(prev => [...prev, newMatch]);
        handleDemoSuccess('Super like match! 🚀');
      } else {
        handleDemoSuccess('Super like sent!');
      }

      // Remove from potential matches
      setPotentialMatches(prev => prev.filter(u => u.id !== userId));
      
      // Add to interactions
      const newInteraction = {
        userId,
        userName: potentialMatches.find(u => u.id === userId)?.name || 'Unknown',
        userAvatar: potentialMatches.find(u => u.id === userId)?.avatar,
        action: 'super_like' as const,
        timestamp: new Date().toISOString(),
      };
      setInteractions(prev => [newInteraction, ...prev]);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to super like user';
      setError(errorMessage);
      handleDemoError(err, 'Failed to super like user');
      return { matched: false };
    } finally {
      setIsLoading(false);
    }
  };

  const dislikeUser = async (userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await demoArcadeAPI.dislikeUser(userId);
      
      // Remove from potential matches
      setPotentialMatches(prev => prev.filter(u => u.id !== userId));
      
      // Add to interactions
      const newInteraction = {
        userId,
        userName: potentialMatches.find(u => u.id === userId)?.name || 'Unknown',
        userAvatar: potentialMatches.find(u => u.id === userId)?.avatar,
        action: 'dislike' as const,
        timestamp: new Date().toISOString(),
      };
      setInteractions(prev => [newInteraction, ...prev]);
      
      handleDemoSuccess('User passed');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to dislike user';
      setError(errorMessage);
      handleDemoError(err, 'Failed to dislike user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const passUser = async (userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await demoArcadeAPI.passUser(userId);
      
      // Remove from potential matches
      setPotentialMatches(prev => prev.filter(u => u.id !== userId));
      
      // Add to interactions
      const newInteraction = {
        userId,
        userName: potentialMatches.find(u => u.id === userId)?.name || 'Unknown',
        userAvatar: potentialMatches.find(u => u.id === userId)?.avatar,
        action: 'pass' as const,
        timestamp: new Date().toISOString(),
      };
      setInteractions(prev => [newInteraction, ...prev]);
      
      handleDemoSuccess('User passed');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pass user';
      setError(errorMessage);
      handleDemoError(err, 'Failed to pass user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const blockUser = async (userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await demoArcadeAPI.blockUser(userId);
      
      // Add to blocked users
      const blockedUser = {
        id: userId,
        name: potentialMatches.find(u => u.id === userId)?.name || 'Unknown',
        avatar: potentialMatches.find(u => u.id === userId)?.avatar,
        blockedAt: new Date().toISOString(),
      };
      setBlockedUsers(prev => [...prev, blockedUser]);
      
      // Remove from potential matches
      setPotentialMatches(prev => prev.filter(u => u.id !== userId));
      
      handleDemoSuccess('User blocked successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to block user';
      setError(errorMessage);
      handleDemoError(err, 'Failed to block user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const unblockUser = async (userId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await demoArcadeAPI.unblockUser(userId);
      
      // Remove from blocked users
      setBlockedUsers(prev => prev.filter(u => u.id !== userId));
      
      handleDemoSuccess('User unblocked successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unblock user';
      setError(errorMessage);
      handleDemoError(err, 'Failed to unblock user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadPotentialMatches();
    loadMatches();
    loadInteractions();
    loadStats();
  };

  const clearError = () => {
    setError(null);
  };

  return {
    preferences,
    potentialMatches,
    matches,
    interactions,
    stats,
    blockedUsers,
    isLoading,
    error,
    updatePreferences,
    likeUser,
    superLikeUser,
    dislikeUser,
    passUser,
    blockUser,
    unblockUser,
    refreshData,
    clearError,
  };
};

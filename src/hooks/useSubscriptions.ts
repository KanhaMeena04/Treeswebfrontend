import { useState, useEffect } from 'react';
import { demoSubscriptionAPI, Subscription, SubscriptionTier } from '@/services/demoData';
import { handleDemoError, handleDemoSuccess } from '@/services/demoData';

export const useSubscriptions = () => {
  const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState<Subscription[]>([]);
  const [streamerDiscovery, setStreamerDiscovery] = useState<Array<{
    id: string;
    name: string;
    avatar?: string;
    category: string;
    totalViews: number;
    subscriptionTiers: SubscriptionTier[];
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user subscriptions on mount
  useEffect(() => {
    loadUserSubscriptions();
    loadSubscriptionHistory();
    loadStreamerDiscovery();
  }, []);

  const loadUserSubscriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoSubscriptionAPI.getUserSubscriptions();
      setUserSubscriptions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subscriptions';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSubscriptionHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoSubscriptionAPI.getSubscriptionHistory();
      setSubscriptionHistory(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load subscription history';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load subscription history');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStreamerDiscovery = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoSubscriptionAPI.getStreamerDiscovery();
      setStreamerDiscovery(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load streamer discovery';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load streamer discovery');
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (subscriptionData: {
    streamerId: string;
    tier: 'gold' | 'diamond' | 'chrome';
    paymentMethod: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const newSubscription = await demoSubscriptionAPI.createSubscription(subscriptionData);
      setUserSubscriptions(prev => [...prev, newSubscription]);
      handleDemoSuccess('Subscription created successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errorMessage);
      handleDemoError(err, 'Failed to create subscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await demoSubscriptionAPI.cancelSubscription(subscriptionId);
      
      // Update local state
      setUserSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'cancelled' as const }
            : sub
        )
      );
      
      handleDemoSuccess('Subscription cancelled successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
      setError(errorMessage);
      handleDemoError(err, 'Failed to cancel subscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAutoRenew = async (subscriptionId: string, autoRenew: boolean): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedSubscription = await demoSubscriptionAPI.updateAutoRenew(subscriptionId, autoRenew);
      
      // Update local state
      setUserSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, autoRenew: updatedSubscription.autoRenew }
            : sub
        )
      );
      
      handleDemoSuccess(`Auto-renew ${autoRenew ? 'enabled' : 'disabled'} successfully`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update auto-renew';
      setError(errorMessage);
      handleDemoError(err, 'Failed to update auto-renew');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getStreamerTiers = async (streamerId: string): Promise<SubscriptionTier[]> => {
    try {
      setIsLoading(true);
      setError(null);
      const tiers = await demoSubscriptionAPI.getStreamerTiers(streamerId);
      return tiers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load streamer tiers';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load streamer tiers');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadUserSubscriptions();
    loadSubscriptionHistory();
    loadStreamerDiscovery();
  };

  const clearError = () => {
    setError(null);
  };

  return {
    userSubscriptions,
    subscriptionHistory,
    streamerDiscovery,
    isLoading,
    error,
    createSubscription,
    cancelSubscription,
    updateAutoRenew,
    getStreamerTiers,
    refreshData,
    clearError,
  };
};

import { useState, useEffect } from 'react';
import { demoSettingsAPI, UserSettings } from '@/services/demoData';
import { handleDemoError, handleDemoSuccess } from '@/services/demoData';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoSettingsAPI.getSettings();
      setSettings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load settings';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccountSettings = async (updates: Partial<UserSettings['account']>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedSettings = await demoSettingsAPI.updateAccountSettings(updates);
      setSettings(updatedSettings);
      handleDemoSuccess('Account settings updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update account settings';
      setError(errorMessage);
      handleDemoError(err, 'Failed to update account settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrivacySettings = async (updates: Partial<UserSettings['privacy']>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedSettings = await demoSettingsAPI.updatePrivacySettings(updates);
      setSettings(updatedSettings);
      handleDemoSuccess('Privacy settings updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update privacy settings';
      setError(errorMessage);
      handleDemoError(err, 'Failed to update privacy settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotificationSettings = async (updates: Partial<UserSettings['notifications']>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedSettings = await demoSettingsAPI.updateNotificationSettings(updates);
      setSettings(updatedSettings);
      handleDemoSuccess('Notification settings updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update notification settings';
      setError(errorMessage);
      handleDemoError(err, 'Failed to update notification settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppSettings = async (updates: Partial<UserSettings['app']>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const updatedSettings = await demoSettingsAPI.updateAppSettings(updates);
      setSettings(updatedSettings);
      handleDemoSuccess('App settings updated successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update app settings';
      setError(errorMessage);
      handleDemoError(err, 'Failed to update app settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await demoSettingsAPI.exportSettings();
      
      // Create and download the file
      const blob = new Blob([result.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      handleDemoSuccess('Settings exported successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export settings';
      setError(errorMessage);
      handleDemoError(err, 'Failed to export settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const defaultSettings = await demoSettingsAPI.resetSettings();
      setSettings(defaultSettings);
      handleDemoSuccess('Settings reset to default successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset settings';
      setError(errorMessage);
      handleDemoError(err, 'Failed to reset settings');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    settings,
    isLoading,
    error,
    loadSettings,
    updateAccountSettings,
    updatePrivacySettings,
    updateNotificationSettings,
    updateAppSettings,
    exportSettings,
    resetSettings,
    clearError,
  };
};

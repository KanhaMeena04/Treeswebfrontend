import { useState, useEffect } from 'react';
import { demoReportsAPI } from '@/services/demoData';
import { handleDemoError, handleDemoSuccess } from '@/services/demoData';

export const useReports = () => {
  const [myReports, setMyReports] = useState<Array<{
    id: string;
    reportedUserName: string;
    reportType: string;
    reason: string;
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
    createdAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user reports on mount
  useEffect(() => {
    loadMyReports();
  }, []);

  const loadMyReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await demoReportsAPI.getMyReports();
      setMyReports(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load reports';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const reportUser = async (reportData: {
    reportedUserId: string;
    reportType: 'inappropriate' | 'spam' | 'harassment' | 'fake_profile' | 'other';
    reason: string;
    evidence?: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await demoReportsAPI.reportUser(reportData);
      
      // Add to my reports
      const newReport = {
        id: result.reportId,
        reportedUserName: 'Unknown', // We don't have the name in the response
        reportType: reportData.reportType,
        reason: reportData.reason,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      setMyReports(prev => [newReport, ...prev]);
      
      handleDemoSuccess('User reported successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to report user';
      setError(errorMessage);
      handleDemoError(err, 'Failed to report user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getReportDetails = async (reportId: string): Promise<{
    id: string;
    reportedUserName: string;
    reportType: string;
    reason: string;
    evidence?: string;
    status: string;
    adminNotes?: string;
    actionsTaken?: string[];
    createdAt: string;
    updatedAt: string;
  } | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const report = await demoReportsAPI.getReport(reportId);
      return report;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load report details';
      setError(errorMessage);
      handleDemoError(err, 'Failed to load report details');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshReports = () => {
    loadMyReports();
  };

  const clearError = () => {
    setError(null);
  };

  return {
    myReports,
    isLoading,
    error,
    reportUser,
    getReportDetails,
    refreshReports,
    clearError,
  };
};

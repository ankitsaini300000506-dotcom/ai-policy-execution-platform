'use client';

import { useState, useEffect } from 'react';
import MetricsCard from './MetricsCard';
import Icon from '@/components/ui/AppIcon';
import SystemHealthMonitor from './SystemHealthMonitor';
import ActivityTimeline from './ActivityTimeline';
import PerformanceChart from './PerformanceChart';
import StorageUtilization from './StorageUtilization';
import QuickActions from './QuickActions';
import APIUsageStats from './APIUsageStats';
import RoleBasedTasks, { Task } from './RoleBasedTasks';
import AuditLogView, { AuditLog } from './AuditLogView';
import SystemOverview from './SystemOverview';
import { fetchTasks, updateTaskStatus, escalateTask, fetchAuditLogs, fetchRecentActivity, fetchPolicyStats, fetchPerformanceStats, fetchStorageStats, fetchSystemHealth, BackendTask, ActivityEvent } from '@/lib/api';

const DashboardInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
    setCurrentTime(new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }, []);

  const [policyStats, setPolicyStats] = useState({ total: 0, active: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        setIsLoadingActivity(true);
        const activity = await fetchRecentActivity();
        // Map backend activity to frontend format
        const formattedActivity = activity.map((event: ActivityEvent, index: number) => ({
          id: index,
          type: 'process', // Default type
          title: event.action || 'Unknown Action', // Handle missing action
          description: event.details || 'No details', // Handle missing details
          timestamp: event.timestamp,
          user: event.user || 'System',
          status: 'completed'
        }));
        setRecentActivity(formattedActivity);
      } catch (error) {
        console.error('Failed to load activity', error);
      } finally {
        setIsLoadingActivity(false);
      }
    };
    if (isHydrated) loadActivity();
  }, [isHydrated]);

  // Fetch Audit Logs
  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        setIsLoadingAuditLogs(true);
        const logs = await fetchAuditLogs();
        // Map backend logs to frontend AuditLog format
        const formattedLogs: AuditLog[] = logs.map((log: any) => ({
          id: log.id || `L${Date.now()}-${Math.random()}`,
          taskId: log.task_id || 'Unknown',
          action: log.action,
          role: log.role || 'System',
          time: log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'
        }));
        setAuditLogs(formattedLogs);
      } catch (error) {
        console.error('Failed to load audit logs', error);
        setAuditLogs([]);
      } finally {
        setIsLoadingAuditLogs(false);
      }
    };
    if (isHydrated) loadAuditLogs();
  }, [isHydrated]);

  // ... (rest of the component)




  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [storageStats, setStorageStats] = useState<any>({ breakdown: [], total_storage_gb: 0, used_storage_gb: 0 });
  const [apiUsageData, setApiUsageData] = useState<any[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<any[]>([]);

  // Fetch Dashboard Analytics
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [perf, storage, health] = await Promise.all([
          fetchPerformanceStats(),
          fetchStorageStats(),
          fetchSystemHealth()
        ]);

        setPerformanceData(perf.data);
        setStorageStats(storage);
        setHealthMetrics(health.metrics);
      } catch (error) {
        console.error('Failed to load dashboard analytics', error);
      }
    };

    if (isHydrated) {
      loadDashboardData();
    }
  }, [isHydrated]);

  // Removed mock timelineEvents, using recentActivity state instead


  // Removed hardcoded chartData, using performanceData state instead


  // Removed hardcoded storageData, using storageData state instead


  const quickActions = [
    {
      id: '1',
      title: 'Upload New Document',
      description: 'Start processing a new policy document',
      icon: 'CloudArrowUpIcon',
      color: 'cyan' as const,
      action: '/upload'
    },
    {
      id: '2',
      title: 'View Processing Queue',
      description: 'Monitor documents in processing',
      icon: 'QueueListIcon',
      color: 'purple' as const,
      action: '/processing'
    },
    {
      id: '3',
      title: 'Review Ambiguities',
      description: 'Resolve pending ambiguities',
      icon: 'ExclamationTriangleIcon',
      color: 'orange' as const,
      action: '/review'
    },
    {
      id: '4',
      title: 'Export Results',
      description: 'Download processed policy data',
      icon: 'ArrowDownTrayIcon',
      color: 'pink' as const,
      action: '/results'
    }];


  // Removed hardcoded apiEndpoints, using apiUsageData state instead


  const [tasks, setTasks] = useState<Task[]>([]);

  // Fetch tasks from backend
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoadingTasks(true);
        setTasksError(null);
        console.log('📥 Fetching tasks from backend...');

        const backendTasks = await fetchTasks();
        console.log('✅ Tasks received from backend:', backendTasks);

        // Convert backend tasks to frontend Task format
        const formattedTasks: Task[] = backendTasks.map((bt: BackendTask) => ({
          id: bt.task_id,
          name: bt.task_name || `${bt.policy_id} - Rule ${bt.rule_id}`,
          policyId: bt.policy_id,
          ruleId: bt.rule_id,
          status: bt.status,
          role: (bt.assigned_role as 'Admin' | 'Officer' | 'Clerk') || 'Clerk',
          deadline: bt.deadline || 'No deadline',
          escalatedTo: bt.escalated_to
        }));

        setTasks(formattedTasks);
        console.log('✅ Tasks loaded successfully:', formattedTasks.length);
      } catch (error) {
        console.error('❌ Error fetching tasks:', error);
        setTasksError('Failed to load tasks from backend. Using offline mode.');
        // Keep empty array or show error message
      } finally {
        setIsLoadingTasks(false);
      }
    };

    if (isHydrated) {
      loadTasks();
    }
  }, [isHydrated]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const metricsData = [
    {
      title: 'Total Policies',
      value: (policyStats?.total || 0).toString(),
      change: 'Real-time',
      trend: 'up' as const,
      icon: 'DocumentTextIcon',
      color: 'cyan' as const
    },
    {
      title: 'Active Tasks',
      value: tasks.length.toString(),
      change: 'Real-time',
      trend: 'up' as const,
      icon: 'ClipboardDocumentListIcon',
      color: 'purple' as const
    },
    {
      title: 'System Status',
      value: 'Online',
      change: 'Stable',
      trend: 'up' as const,
      icon: 'SignalIcon',
      color: 'green' as const
    },
    {
      title: 'Escalations',
      value: tasks.filter(t => t.status === 'ESCALATED').length.toString(),
      change: 'Needs Attention',
      trend: 'down' as const,
      icon: 'ExclamationTriangleIcon',
      color: 'pink' as const
    }];

  const systemStats = {
    totalPolicies: policyStats?.total || 0,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
    escalatedTasks: tasks.filter(t => t.status === 'ESCALATED').length,
  };

  const handleUpdateStatus = async (taskId: string, newStatus: Task['status'], newRole?: Task['role']) => {
    try {
      console.log('🔄 Updating task status...', { taskId, newStatus, newRole });

      // Determine the role to send (use current task's role if not escalating)
      const currentTask = tasks.find(t => t.id === taskId);
      const roleToSend = newRole || currentTask?.role || 'Clerk';

      // Update task status via backend API
      if (newStatus === 'ESCALATED' && newRole) {
        // Use escalate endpoint
        await escalateTask(taskId, roleToSend);
      } else {
        // Use update-status endpoint
        await updateTaskStatus(taskId, newStatus, roleToSend);
      }

      console.log('✅ Task updated successfully, refreshing task list...');

      // CRITICAL: Refresh task list after update
      setIsLoadingTasks(true);
      const backendTasks = await fetchTasks();

      const formattedTasks: Task[] = backendTasks.map((bt: BackendTask) => ({
        id: bt.task_id,
        name: bt.task_name || `${bt.policy_id} - Rule ${bt.rule_id}`,
        policyId: bt.policy_id,
        ruleId: bt.rule_id,
        status: bt.status,
        role: (bt.assigned_role as 'Admin' | 'Officer' | 'Clerk') || 'Clerk',
        deadline: bt.deadline || 'No deadline',
        escalatedTo: bt.escalated_to
      }));

      setTasks(formattedTasks);
      setIsLoadingTasks(false);

      console.log('✅ Task list refreshed successfully');

      // Add to audit log for UI feedback
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newLog: AuditLog = {
        id: `L${Date.now()}`,
        taskId: taskId,
        action: newStatus === 'ESCALATED' ? `ESCALATED to ${newRole}` : newStatus,
        role: roleToSend,
        time: timeStr
      };
      setAuditLogs(prevLogs => [newLog, ...prevLogs]);

    } catch (error) {
      console.error('❌ Error updating task:', error);
      setIsLoadingTasks(false);
      alert('Failed to update task. Please try again.');
    }
  };

  const [hasValidData, setHasValidData] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const policyId = localStorage.getItem('policyId');
      const storedResults = localStorage.getItem('processingResults');

      if (policyId && storedResults) {
        setHasValidData(true);
      } else {
        setHasValidData(false);
      }
    }
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-muted rounded-lg w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) =>
                <div key={i} className="h-32 bg-muted rounded-lg" />
              )}
            </div>
          </div>
        </div>
      </div>);
  }

  // Empty state - no policy data
  // Removed blocking check to allow system dashboard to load
  // if (!hasValidData) { ... }

  return (
    <div className="min-h-screen bg-background pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold font-orbitron text-foreground text-glow-cyan mb-2">
              Mission Control Dashboard
            </h1>
            <p className="text-muted-foreground font-inter">
              Real-time system monitoring and analytics • Last updated: {currentTime}
            </p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg elevation-subtle">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-jetbrains text-muted-foreground">60 FPS</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-sm font-jetbrains text-muted-foreground">WebGL Active</span>
          </div>
        </div>

        {/* Show upload prompt if no data, but don't block dashboard */}
        {!hasValidData && (
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="InformationCircleIcon" size={24} className="text-cyan-500" />
              <div>
                <h3 className="font-bold text-cyan-500">No Active Policy Session</h3>
                <p className="text-sm text-muted-foreground">Upload a document to see session-specific analytics. Showing system-wide data below.</p>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/upload'}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold rounded-lg transition-colors"
            >
              Upload New
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemHealthMonitor metrics={healthMetrics} />
          <ActivityTimeline events={recentActivity} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StorageUtilization
            data={storageStats.breakdown || []}
            totalStorage={`${storageStats.total_storage_gb || 0} GB`}
            usedStorage={`${storageStats.used_storage_gb || 0}`} />

          <QuickActions actions={quickActions} />
        </div>

        {isLoadingTasks ? (
          <div className="bg-card rounded-lg p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks from backend...</p>
          </div>
        ) : tasksError ? (
          <div className="bg-card rounded-lg p-8 text-center border-2 border-warning">
            <p className="text-warning mb-2">⚠️ {tasksError}</p>
            <p className="text-sm text-muted-foreground">Tasks: {tasks.length}</p>
          </div>
        ) : (
          <RoleBasedTasks tasks={tasks} onUpdateStatus={handleUpdateStatus} />
        )}

        <AuditLogView logs={auditLogs} />
      </div>
    </div>);

};

export default DashboardInteractive;
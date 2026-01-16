import axios from 'axios';

// ========================================
// NLP BACKEND API
// ========================================

// ⚠️ UPDATE THIS URL when your backend tunnel restarts!
// Current: Stable Ngrok URL (https://chiliadal-jamika-flockier.ngrok-free.dev)
const API_BASE = "https://chiliadal-jamika-flockier.ngrok-free.dev";

// Create client instance with the Ngrok Bypass header
const client = axios.create({
    baseURL: API_BASE,
    headers: {
        'ngrok-skip-browser-warning': 'true' // CRITICAL for Ngrok free tier
    },
    timeout: 300000 // 5 minutes timeout for large PDF processing
});

export interface NLPRule {
    rule_id: string;
    conditions: string[];
    action: string;
    responsible_role: string;
    ambiguity_flag: boolean;
    ambiguity_reason: string;
}

export interface NLPResponse {
    policy_id: string;
    policy_title: string;
    rules: NLPRule[];
}

export const uploadPolicy = async (file: File, policyId: string): Promise<NLPResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('policy_id', policyId);

    // Let axios/browser set the Content-Type with the correct boundary
    const response = await client.post('/api/policy/process', formData);
    return response.data;
};

export interface ClarificationData {
    policy_id: string;
    rule_id: string;
    clarified_responsible_role: string;
    clarified_deadline?: string;
    clarified_conditions?: string[];
}

export const clarifyPolicy = async (clarificationData: ClarificationData) => {
    console.log('📤 Sending clarification to NLP backend:', clarificationData);

    const response = await client.post('/api/policy/clarify', clarificationData, {
        headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Clarification response:', response.data);
    return response.data;
};

// Submit policy to sync with execution backend
export const submitPolicy = async (policyId: string) => {
    console.log('📤 Submitting policy to sync with execution backend:', policyId);

    const response = await client.post('/api/policy/submit', {
        policy_id: policyId
    }, {
        headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Policy submitted and synced to execution backend:', response.data);
    return response.data;
};

// ========================================
// BACKEND EXECUTION ENGINE API
// ========================================

// Backend base URL (separate from NLP)
const BACKEND_BASE = "https://policy-execution-backend.onrender.com";

const backendClient = axios.create({
    baseURL: BACKEND_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Task interface matching backend response
export interface BackendTask {
    task_id: string;
    policy_id: string;
    rule_id: string;
    task_name?: string;
    status: 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ESCALATED';
    assigned_role: string;  // Backend uses 'assigned_role' not 'role'
    deadline?: string;
    escalated_to?: string;
}

// Audit log interface
export interface AuditLog {
    task_id: string;
    action: string;
    role: string;
    timestamp: string;
}

// Fetch all tasks (optionally filtered by role)
export const fetchTasks = async (role?: string): Promise<BackendTask[]> => {
    console.log('📥 Fetching tasks from backend...', role ? `(role: ${role})` : '(all tasks)');

    // Don't send params at all if no role specified
    const config = role ? { params: { role } } : { params: {} };
    const response = await backendClient.get('/tasks', config);

    console.log('✅ Tasks fetched:', Array.isArray(response.data) ? response.data.length : 0);
    return Array.isArray(response.data) ? response.data : [];
};

// Update task status
export const updateTaskStatus = async (
    taskId: string,
    newStatus: string,
    role: string
): Promise<BackendTask> => {
    console.log('📤 Updating task status:', { taskId, newStatus, role });

    const response = await backendClient.post(`/tasks/${taskId}/update-status`, {
        new_status: newStatus,
        role: role
    });

    console.log('✅ Task updated:', response.data);
    return response.data;
};

// Escalate task
export const escalateTask = async (taskId: string, role: string): Promise<BackendTask> => {
    console.log('📤 Escalating task:', { taskId, role });

    const response = await backendClient.post(`/tasks/${taskId}/escalate`, {
        role: role
    });

    console.log('✅ Task escalated:', response.data);
    return response.data;
};

// Fetch audit logs
export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
    console.log('📥 Fetching audit logs from backend...');

    try {
        const response = await backendClient.get('/audit-logs');
        console.log('✅ Audit logs fetched:', response.data.length);
        return response.data;
    } catch (error) {
        console.warn('⚠️ Audit logs endpoint not available, returning empty array');
        return [];
    }
};

// Activity event interface
export interface ActivityEvent {
    id: string;
    type: 'upload' | 'processing' | 'ambiguity' | 'export' | 'approval';
    title: string;
    description: string;
    timestamp: string;
    user: string;
    status: 'completed' | 'processing' | 'failed';
}

// Fetch recent activity
export const fetchRecentActivity = async (): Promise<ActivityEvent[]> => {
    console.log('📥 Fetching recent activity from backend...');

    try {
        const response = await backendClient.get('/activity/recent');
        console.log('✅ Recent activity fetched:', response.data.length);
        return response.data;
    } catch (error) {
        console.warn('⚠️ Recent activity endpoint not available, returning empty array');
        return [];
    }
};

// Fetch policy statistics (if endpoint exists)
export const fetchPolicyStats = async () => {
    console.log('📥 Fetching policy statistics from backend...');

    try {
        const response = await backendClient.get('/policies/stats');
        console.log('✅ Policy stats fetched:', response.data);
        return response.data;
    } catch (error) {
        console.warn('⚠️ Policy stats endpoint not available, returning default');
        return { total: 0, active: 0 };
    }
};

// ========================================
// NLP RESULTS & PDF EXPORT API
// ========================================

// NLP Result interface
export interface NLPResult {
    result_id: string;
    policy_id: string;
    file_name: string;
    upload_timestamp: string;
    status: string;
    nlp_data?: any;
}

// Save NLP results to backend
export const saveNLPResults = async (policyId: string, fileName: string, nlpData: any): Promise<string> => {
    console.log('📤 Saving NLP results to backend...', { policyId, fileName });

    try {
        const response = await backendClient.post('/nlp-results/save', {
            policy_id: policyId,
            file_name: fileName,
            nlp_data: nlpData
        });

        console.log('✅ NLP results saved:', response.data.result_id);
        return response.data.result_id;
    } catch (error) {
        console.error('❌ Error saving NLP results:', error);
        throw error;
    }
};

// Fetch all NLP results
export const fetchNLPResults = async (): Promise<NLPResult[]> => {
    console.log('📥 Fetching NLP results from backend...');

    try {
        const response = await backendClient.get('/nlp-results');
        console.log('✅ NLP results fetched:', response.data.length);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching NLP results:', error);
        return [];
    }
};

// Fetch specific NLP result
export const fetchNLPResult = async (resultId: string): Promise<NLPResult | null> => {
    console.log('📥 Fetching NLP result:', resultId);

    try {
        const response = await backendClient.get(`/nlp-results/${resultId}`);
        console.log('✅ NLP result fetched');
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching NLP result:', error);
        return null;
    }
};

// Download PDF for NLP result
export const downloadNLPResultPDF = async (resultId: string, fileName?: string): Promise<void> => {
    console.log('📥 Downloading PDF for result:', resultId);

    try {
        const response = await backendClient.get(`/nlp-results/${resultId}/download-pdf`, {
            responseType: 'blob'
        });

        // Create blob URL and trigger download
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || `policy_${resultId}.pdf`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        console.log('✅ PDF downloaded successfully');
    } catch (error) {
        console.error('❌ Error downloading PDF:', error);
        throw error;
    }
};

// ========================================
// DASHBOARD ANALYTICS API
// ========================================

export const fetchPerformanceStats = async () => {
    // TODO: Replace with actual API call: GET /analytics/performance
    // const response = await api.get('/analytics/performance');
    // return response.data;

    // Mock data for now
    return {
        range: '7d',
        data: [
            { name: 'Mon', uploads: 45, processed: 42, exported: 38 },
            { name: 'Tue', uploads: 52, processed: 48, exported: 45 },
            { name: 'Wed', uploads: 61, processed: 58, exported: 54 },
            { name: 'Thu', uploads: 48, processed: 45, exported: 42 },
            { name: 'Fri', uploads: 73, processed: 70, exported: 67 },
            { name: 'Sat', uploads: 38, processed: 35, exported: 32 },
            { name: 'Sun', uploads: 29, processed: 27, exported: 24 }
        ]
    };
};

export const fetchStorageStats = async () => {
    // TODO: Replace with actual API call: GET /system/storage
    return {
        total_storage_gb: 100,
        used_storage_gb: 97.6,
        available_gb: 2.4,
        breakdown: [
            { name: 'Documents', value: 45.2, color: '#00FFFF' },
            { name: 'Processed Data', value: 28.7, color: '#8A2BE2' },
            { name: 'Exports', value: 15.3, color: '#00FF88' },
            { name: 'Cache', value: 8.4, color: '#FF6B00' },
            { name: 'Available', value: 2.4, color: '#2A2A2A' }
        ]
    };
};

export const fetchAPIUsage = async () => {
    // TODO: Replace with actual API call: GET /system/api-usage
    return {
        endpoints: [
            { name: '/api/upload', calls: 1247, avgResponse: '145ms', successRate: '99.2%', status: 'healthy' },
            { name: '/api/process', calls: 1189, avgResponse: '2.4s', successRate: '98.7%', status: 'healthy' },
            { name: '/api/extract-rules', calls: 1189, avgResponse: '1.8s', successRate: '97.3%', status: 'warning' },
            { name: '/api/export', calls: 1124, avgResponse: '320ms', successRate: '99.8%', status: 'healthy' }
        ]
    };
};

export const fetchSystemHealth = async () => {
    // TODO: Replace with actual API call: GET /system/health
    return {
        metrics: [
            { name: 'API Response Time', status: 'healthy', value: '124ms avg', icon: 'ClockIcon' },
            { name: 'Database Performance', status: 'healthy', value: '99.9% uptime', icon: 'CircleStackIcon' },
            { name: 'WebGL Rendering', status: 'healthy', value: '60 FPS', icon: 'CpuChipIcon' },
            { name: 'Memory Usage', status: 'warning', value: '78% utilized', icon: 'ServerIcon' }
        ]
    };
};

export default client;

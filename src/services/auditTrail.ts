/**
 * Audit Trail Logging Engine for StatIntel-AI.
 * Logs all authentication, report generation, and data access actions.
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'ADMIN' | 'ANALYST' | 'VIEWER';
  action: 'LOGIN' | 'LOGOUT' | 'DATA_EXPORT' | 'REPORT_GENERATION' | 'PREDICTION_RUN' | 'DATASET_UPLOAD' | 'CONFIG_UPDATE';
  resourceAccessed: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  ipAddress?: string;
  deviceInfo?: string;
}

class AuditTrailService {
  private storageKey = 'statintel_audit_trail_logs';

  public getLogs(): AuditLogEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load audit logs:', e);
    }
    return this.getInitialAuditLogs();
  }

  public logAction(
    entry: Omit<AuditLogEntry, 'id' | 'timestamp'>
  ): AuditLogEntry {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ipAddress: '10.24.88.102 (National Informatics Center NIC-VPN)',
      deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent : 'GovOS/Linux-x86_64',
    };

    const current = this.getLogs();
    const updated = [newEntry, ...current].slice(0, 100); // Keep last 100 entries

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
      } catch (e) {
        // silent
      }
    }

    console.info(`[Audit Trail] ${newEntry.userRole} ${newEntry.userName} executed ${newEntry.action} on ${newEntry.resourceAccessed}`);
    return newEntry;
  }

  private getInitialAuditLogs(): AuditLogEntry[] {
    return [
      {
        id: 'audit-001',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        userId: 'usr-admin-01',
        userName: 'Dr. Vandana Sengupta',
        userRole: 'ADMIN',
        action: 'LOGIN',
        resourceAccessed: '/api/v1/auth/digilocker-sso',
        status: 'SUCCESS',
        ipAddress: '10.24.88.102 (NIC-VPN)',
      },
      {
        id: 'audit-002',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        userId: 'usr-analyst-02',
        userName: 'Rajesh Sharma',
        userRole: 'ANALYST',
        action: 'REPORT_GENERATION',
        resourceAccessed: '/api/v1/reports/cpi-q2-executive',
        status: 'SUCCESS',
        ipAddress: '10.24.88.114',
      },
      {
        id: 'audit-003',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        userId: 'usr-analyst-02',
        userName: 'Rajesh Sharma',
        userRole: 'ANALYST',
        action: 'PREDICTION_RUN',
        resourceAccessed: '/predict/forecast [CPI_Combined]',
        status: 'SUCCESS',
        ipAddress: '10.24.88.114',
      },
      {
        id: 'audit-004',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        userId: 'usr-viewer-09',
        userName: 'External Policy Reviewer',
        userRole: 'VIEWER',
        action: 'DATA_EXPORT',
        resourceAccessed: '/api/v1/admin/restricted-raw-microdata',
        status: 'DENIED',
        ipAddress: '192.168.1.45',
      },
    ];
  }
}

export const auditTrail = new AuditTrailService();
export default auditTrail;

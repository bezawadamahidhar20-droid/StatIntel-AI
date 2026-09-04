import React, { useState, useEffect } from 'react';
import { ShieldCheck, History, UserCheck, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';
import { auditTrail, AuditLogEntry } from '../../services/auditTrail';

export const AuditTrailViewer: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  const refreshLogs = () => {
    setLogs(auditTrail.getLogs());
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              System Audit Trail & Access Telemetry
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cryptographic event log tracking user actions, RBAC enforcement, and resource access
            </p>
          </div>
        </div>

        <button
          onClick={refreshLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Log</span>
        </button>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">User & Role</th>
              <th className="py-2.5 px-3">Action Executed</th>
              <th className="py-2.5 px-3">Resource Endpoint</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => {
              const isSuccess = log.status === 'SUCCESS';
              return (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-[160px]">{log.userName}</div>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                    {log.resourceAccessed}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      isSuccess
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                    }`}>
                      {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertOctagon className="w-3 h-3" />}
                      {log.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrailViewer;

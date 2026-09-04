/**
 * Real-Time Anomaly Alert & Notification System for StatIntel-AI.
 * Dispatches simulated SMS, Email, and in-app notifications with severity tiers.
 */

export interface SystemAlert {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  metric: string;
  observedDelta: string;
  channel: 'SMS_AND_EMAIL' | 'EMAIL_ONLY' | 'IN_APP';
  dispatchedTo: string[];
}

export interface AlertThresholdConfig {
  cpiSpikeThresholdPct: number; // e.g., 5.0%
  iipDipThresholdPct: number; // e.g., 3.5%
  unemploymentJumpThresholdPct: number; // e.g., 4.0%
  autoDispatchSms: boolean;
  autoDispatchEmail: boolean;
  notificationRecipients: string[];
}

class AlertNotificationService {
  private configKey = 'statintel_alert_threshold_config';
  private alertsKey = 'statintel_recent_dispatched_alerts';

  public getThresholds(): AlertThresholdConfig {
    if (typeof window === 'undefined') {
      return this.getDefaultThresholds();
    }
    try {
      const stored = localStorage.getItem(this.configKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // fallback
    }
    return this.getDefaultThresholds();
  }

  public saveThresholds(cfg: AlertThresholdConfig): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.configKey, JSON.stringify(cfg));
      } catch (e) {
        // silent
      }
    }
  }

  public getDispatchedAlerts(): SystemAlert[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.alertsKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // silent
    }
    return this.getDefaultAlerts();
  }

  public triggerAlert(alert: Omit<SystemAlert, 'id' | 'timestamp' | 'dispatchedTo'>): SystemAlert {
    const cfg = this.getThresholds();
    const newAlert: SystemAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dispatchedTo: cfg.notificationRecipients,
    };

    const current = this.getDispatchedAlerts();
    const updated = [newAlert, ...current].slice(0, 25);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.alertsKey, JSON.stringify(updated));
      } catch (e) {
        // silent
      }
    }

    // Formatted simulated SMS/Email transmission log
    console.log(`\n🚨 [DISPATCHED ${newAlert.severity} ALERT] 🚨`);
    console.log(`Metric: ${newAlert.metric} | Delta: ${newAlert.observedDelta}`);
    console.log(`Subject: ${newAlert.title}`);
    console.log(`Message: ${newAlert.message}`);
    console.log(`Dispatched to: ${newAlert.dispatchedTo.join(', ')} via ${newAlert.channel}\n`);

    return newAlert;
  }

  private getDefaultThresholds(): AlertThresholdConfig {
    return {
      cpiSpikeThresholdPct: 5.0,
      iipDipThresholdPct: 3.5,
      unemploymentJumpThresholdPct: 4.0,
      autoDispatchSms: true,
      autoDispatchEmail: true,
      notificationRecipients: ['director.nso@mospi.gov.in', '+91 98765 43210 (NIC Gateway)'],
    };
  }

  private getDefaultAlerts(): SystemAlert[] {
    return [
      {
        id: 'alert-01',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        title: 'Critical CPI Spike Detected in UP Urban Frame',
        message: 'Food and Vegetable sub-index surged by +7.3% surpassing the 5.0% tolerance threshold.',
        severity: 'CRITICAL',
        metric: 'CPI Combined',
        observedDelta: '+7.3%',
        channel: 'SMS_AND_EMAIL',
        dispatchedTo: ['director.nso@mospi.gov.in', '+91 98765 43210'],
      },
      {
        id: 'alert-02',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        title: 'IIP Manufacturing Expansion Above Forecast Band',
        message: 'Industrial manufacturing index reached 156.5 pts exceeding the 95% upper forecast confidence boundary.',
        severity: 'WARNING',
        metric: 'IIP General',
        observedDelta: '+5.7%',
        channel: 'EMAIL_ONLY',
        dispatchedTo: ['director.nso@mospi.gov.in'],
      },
    ];
  }
}

export const alertService = new AlertNotificationService();
export default alertService;

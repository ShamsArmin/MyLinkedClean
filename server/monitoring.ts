import { Request, Response, NextFunction } from 'express';
import { logSystemEvent } from './admin-routes';
import { sql } from 'drizzle-orm';

interface SystemMetrics {
  timestamp: string;
  uptime: number;
  memoryUsage: NodeJS.MemoryUsage;
  activeConnections: number;
  errorCount: number;
  responseTime: number;
  databaseStatus: 'connected' | 'disconnected' | 'error';
}

interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  userId?: number;
  endpoint?: string;
  userAgent?: string;
  ip?: string;
}

class ApplicationMonitor {
  private static instance: ApplicationMonitor;
  private errorCount: number = 0;
  private responseTimeSum: number = 0;
  private responseTimeCount: number = 0;
  private errorLogs: ErrorLog[] = [];
  private metrics: SystemMetrics[] = [];
  private maxLogSize = 1000;
  private maxMetricsSize = 100;

  private constructor() {
    // Start metrics collection
    setInterval(() => this.collectMetrics(), 60000); // Every minute
    
    // Clean old logs every hour
    setInterval(() => this.cleanOldLogs(), 3600000); // Every hour
  }

  static getInstance(): ApplicationMonitor {
    if (!ApplicationMonitor.instance) {
      ApplicationMonitor.instance = new ApplicationMonitor();
    }
    return ApplicationMonitor.instance;
  }

  // Middleware to track response times and errors
  requestTracker = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    
    // Override res.json to track response times
    const originalJson = res.json;
    res.json = function(data: any) {
      const responseTime = Date.now() - startTime;
      ApplicationMonitor.getInstance().recordResponseTime(responseTime);
      return originalJson.call(this, data);
    };

    // Track errors
    const originalSend = res.send;
    res.send = function(data: any) {
      if (res.statusCode >= 400) {
        ApplicationMonitor.getInstance().recordError({
          timestamp: new Date().toISOString(),
          level: res.statusCode >= 500 ? 'error' : 'warning',
          message: `HTTP ${res.statusCode} - ${req.method} ${req.path}`,
          endpoint: req.path,
          userAgent: req.get('User-Agent'),
          ip: req.ip
        });
      }
      return originalSend.call(this, data);
    };

    next();
  };

  recordError(error: ErrorLog) {
    this.errorCount++;
    this.errorLogs.push(error);
    
    // Keep only recent logs
    if (this.errorLogs.length > this.maxLogSize) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogSize);
    }

    // Log critical errors to system
    if (error.level === 'error') {
      logSystemEvent('error', error.message, 'monitoring', error.userId, {
        stack: error.stack,
        endpoint: error.endpoint,
        userAgent: error.userAgent,
        ip: error.ip
      });
    }

    // Auto-alert on high error rates
    this.checkErrorThreshold();
  }

  recordResponseTime(time: number) {
    this.responseTimeSum += time;
    this.responseTimeCount++;
  }

  private async collectMetrics() {
    try {
      const metric: SystemMetrics = {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        activeConnections: 0, // Would need to track WebSocket connections
        errorCount: this.errorCount,
        responseTime: this.responseTimeCount > 0 ? this.responseTimeSum / this.responseTimeCount : 0,
        databaseStatus: await this.checkDatabaseStatus()
      };

      this.metrics.push(metric);
      
      // Keep only recent metrics
      if (this.metrics.length > this.maxMetricsSize) {
        this.metrics = this.metrics.slice(-this.maxMetricsSize);
      }

      // Reset response time tracking
      this.responseTimeSum = 0;
      this.responseTimeCount = 0;

      // Check for issues
      this.performHealthCheck(metric);
      
    } catch (error) {
      console.error('Metrics collection error:', error);
    }
  }

  private async checkDatabaseStatus(): Promise<'connected' | 'disconnected' | 'error'> {
    try {
      // Import database connection
      const { db } = await import('./db');
      await db.execute(sql`SELECT 1`);
      return 'connected';
    } catch (error) {
      return 'error';
    }
  }

  private performHealthCheck(metric: SystemMetrics) {
    const alerts: string[] = [];

    // Memory usage alert (above 80%)
    if (metric.memoryUsage.heapUsed / metric.memoryUsage.heapTotal > 0.8) {
      alerts.push('High memory usage detected');
    }

    // Slow response time alert (above 2 seconds)
    if (metric.responseTime > 2000) {
      alerts.push('Slow response times detected');
    }

    // Database connection alert
    if (metric.databaseStatus === 'error') {
      alerts.push('Database connection issues detected');
    }

    // Log alerts
    alerts.forEach(alert => {
      logSystemEvent('warning', alert, 'monitoring', undefined, metric);
    });
  }

  private checkErrorThreshold() {
    // Check error rate in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentErrors = this.errorLogs.filter(log => 
      new Date(log.timestamp) > fiveMinutesAgo
    );

    if (recentErrors.length > 10) {
      logSystemEvent('error', 'High error rate detected', 'monitoring', undefined, {
        errorCount: recentErrors.length,
        timeWindow: '5 minutes'
      });
    }
  }

  private cleanOldLogs() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.errorLogs = this.errorLogs.filter(log => 
      new Date(log.timestamp) > oneHourAgo
    );
  }

  // Public methods for monitoring dashboard
  getMetrics(): SystemMetrics[] {
    return this.metrics;
  }

  getErrorLogs(): ErrorLog[] {
    return this.errorLogs;
  }

  getCurrentStatus(): {
    status: 'healthy' | 'warning' | 'error';
    uptime: number;
    memoryUsage: number;
    responseTime: number;
    errorCount: number;
    databaseStatus: string;
  } {
    const latest = this.metrics[this.metrics.length - 1];
    if (!latest) {
      return {
        status: 'warning',
        uptime: process.uptime(),
        memoryUsage: 0,
        responseTime: 0,
        errorCount: this.errorCount,
        databaseStatus: 'unknown'
      };
    }

    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    
    // Determine status based on conditions
    if (latest.databaseStatus === 'error' || latest.memoryUsage.heapUsed / latest.memoryUsage.heapTotal > 0.9) {
      status = 'error';
    } else if (latest.responseTime > 2000 || latest.memoryUsage.heapUsed / latest.memoryUsage.heapTotal > 0.8) {
      status = 'warning';
    }

    return {
      status,
      uptime: latest.uptime,
      memoryUsage: Math.round((latest.memoryUsage.heapUsed / latest.memoryUsage.heapTotal) * 100),
      responseTime: latest.responseTime,
      errorCount: this.errorCount,
      databaseStatus: latest.databaseStatus
    };
  }
}

export const monitor = ApplicationMonitor.getInstance();
export { ApplicationMonitor };
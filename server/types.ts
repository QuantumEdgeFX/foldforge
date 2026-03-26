/**
 * Real-time progress tracking types for backtesting and optimization tasks
 */

export type TaskStatus = "QUEUED" | "RUNNING" | "PAUSED" | "COMPLETED" | "FAILED" | "CANCELLED";

export type TaskType =
  | "BACKTEST"
  | "WALK_FORWARD"
  | "MONTE_CARLO"
  | "STRESS_TEST"
  | "BAYESIAN_OPTIMIZATION"
  | "GENETIC_ALGORITHM"
  | "PARALLEL_BACKTEST";

export interface ProgressUpdate {
  taskId: string;
  taskType: TaskType;
  status: TaskStatus;
  progress: number; // 0-100
  currentIteration: number;
  totalIterations: number;
  elapsedTime: number; // milliseconds
  estimatedTimeRemaining: number; // milliseconds
  currentMetric?: string;
  currentValue?: number;
  bestValue?: number;
  message?: string;
  timestamp: Date;
}

export interface TaskMetadata {
  taskId: string;
  userId: string;
  taskType: TaskType;
  strategyName: string;
  symbol: string;
  timeframe: string;
  parameters: Record<string, unknown>;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: TaskStatus;
  result?: unknown;
  error?: string;
}

export interface ProgressStats {
  tasksQueued: number;
  tasksRunning: number;
  tasksPaused: number;
  tasksCompleted: number;
  tasksFailed: number;
  averageCompletionTime: number; // milliseconds
  totalTasksProcessed: number;
}

export interface TaskQueueItem {
  taskId: string;
  taskType: TaskType;
  priority: number; // 1-10, higher = more important
  metadata: TaskMetadata;
  status: TaskStatus;
  progress: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

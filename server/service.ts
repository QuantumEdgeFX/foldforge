/**
 * Progress Tracking Service
 * Manages real-time task progress updates and WebSocket broadcasting
 */

import { EventEmitter } from "events";
import { nanoid } from "nanoid";
import { ProgressUpdate, TaskMetadata, TaskStatus, TaskType, TaskQueueItem } from "./types";

export class ProgressTracker extends EventEmitter {
  private tasks: Map<string, TaskMetadata> = new Map();
  private progressUpdates: Map<string, ProgressUpdate> = new Map();
  private taskQueue: TaskQueueItem[] = [];
  private activeTasksLimit = 5;

  /**
   * Create a new task and add to queue
   */
  createTask(
    userId: string,
    taskType: TaskType,
    strategyName: string,
    symbol: string,
    timeframe: string,
    parameters: Record<string, unknown>
  ): string {
    const taskId = nanoid();
    const metadata: TaskMetadata = {
      taskId,
      userId,
      taskType,
      strategyName,
      symbol,
      timeframe,
      parameters,
      createdAt: new Date(),
      status: "QUEUED",
    };

    this.tasks.set(taskId, metadata);

    const queueItem: TaskQueueItem = {
      taskId,
      taskType,
      priority: 5,
      metadata,
      status: "QUEUED",
      progress: 0,
      createdAt: new Date(),
    };

    this.taskQueue.push(queueItem);
    this.emit("task:created", { taskId, metadata });

    return taskId;
  }

  /**
   * Update task progress
   */
  updateProgress(
    taskId: string,
    currentIteration: number,
    totalIterations: number,
    currentMetric?: string,
    currentValue?: number,
    bestValue?: number,
    message?: string
  ): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const progress = Math.round((currentIteration / totalIterations) * 100);
    const elapsedTime = task.startedAt ? Date.now() - task.startedAt.getTime() : 0;
    const timePerIteration = elapsedTime / Math.max(currentIteration, 1);
    const estimatedTimeRemaining = timePerIteration * (totalIterations - currentIteration);

    const update: ProgressUpdate = {
      taskId,
      taskType: task.taskType,
      status: "RUNNING",
      progress,
      currentIteration,
      totalIterations,
      elapsedTime,
      estimatedTimeRemaining,
      currentMetric,
      currentValue,
      bestValue,
      message,
      timestamp: new Date(),
    };

    this.progressUpdates.set(taskId, update);
    this.emit("progress:updated", update);
  }

  /**
   * Start a task
   */
  startTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = "RUNNING";
    task.startedAt = new Date();

    const queueItem = this.taskQueue.find((item) => item.taskId === taskId);
    if (queueItem) {
      queueItem.status = "RUNNING";
      queueItem.startedAt = new Date();
    }

    this.emit("task:started", { taskId, task });
  }

  /**
   * Complete a task
   */
  completeTask(taskId: string, result?: unknown): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = "COMPLETED";
    task.completedAt = new Date();
    task.result = result;

    const queueItem = this.taskQueue.find((item) => item.taskId === taskId);
    if (queueItem) {
      queueItem.status = "COMPLETED";
      queueItem.completedAt = new Date();
      queueItem.progress = 100;
    }

    const update = this.progressUpdates.get(taskId);
    if (update) {
      update.status = "COMPLETED";
      update.progress = 100;
    }

    this.emit("task:completed", { taskId, task, result });
  }

  /**
   * Fail a task
   */
  failTask(taskId: string, error: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = "FAILED";
    task.completedAt = new Date();
    task.error = error;

    const queueItem = this.taskQueue.find((item) => item.taskId === taskId);
    if (queueItem) {
      queueItem.status = "FAILED";
      queueItem.completedAt = new Date();
    }

    this.emit("task:failed", { taskId, task, error });
  }

  /**
   * Pause a task
   */
  pauseTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = "PAUSED";

    const queueItem = this.taskQueue.find((item) => item.taskId === taskId);
    if (queueItem) {
      queueItem.status = "PAUSED";
    }

    this.emit("task:paused", { taskId, task });
  }

  /**
   * Resume a task
   */
  resumeTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = "RUNNING";

    const queueItem = this.taskQueue.find((item) => item.taskId === taskId);
    if (queueItem) {
      queueItem.status = "RUNNING";
    }

    this.emit("task:resumed", { taskId, task });
  }

  /**
   * Cancel a task
   */
  cancelTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = "CANCELLED";
    task.completedAt = new Date();

    const queueItem = this.taskQueue.find((item) => item.taskId === taskId);
    if (queueItem) {
      queueItem.status = "CANCELLED";
      queueItem.completedAt = new Date();
    }

    this.emit("task:cancelled", { taskId, task });
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): TaskMetadata | undefined {
    return this.tasks.get(taskId);
  }

  /**
   * Get task progress
   */
  getTaskProgress(taskId: string): ProgressUpdate | undefined {
    return this.progressUpdates.get(taskId);
  }

  /**
   * Get all tasks for a user
   */
  getUserTasks(userId: string): TaskMetadata[] {
    return Array.from(this.tasks.values()).filter((task) => task.userId === userId);
  }

  /**
   * Get task queue
   */
  getTaskQueue(): TaskQueueItem[] {
    return this.taskQueue;
  }

  /**
   * Get active tasks
   */
  getActiveTasks(): TaskMetadata[] {
    return Array.from(this.tasks.values()).filter((task) => task.status === "RUNNING");
  }

  /**
   * Get queue statistics
   */
  getQueueStats() {
    const tasks = Array.from(this.tasks.values());
    const queued = tasks.filter((t) => t.status === "QUEUED").length;
    const running = tasks.filter((t) => t.status === "RUNNING").length;
    const paused = tasks.filter((t) => t.status === "PAUSED").length;
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const failed = tasks.filter((t) => t.status === "FAILED").length;

    const completedTasks = tasks.filter((t) => t.status === "COMPLETED" && t.completedAt);
    const avgCompletionTime =
      completedTasks.length > 0
        ? completedTasks.reduce((sum, t) => {
            if (!t.startedAt || !t.completedAt) return sum;
            return sum + (t.completedAt.getTime() - t.startedAt.getTime());
          }, 0) / completedTasks.length
        : 0;

    return {
      tasksQueued: queued,
      tasksRunning: running,
      tasksPaused: paused,
      tasksCompleted: completed,
      tasksFailed: failed,
      averageCompletionTime: avgCompletionTime,
      totalTasksProcessed: completed + failed,
    };
  }

  /**
   * Clear completed tasks (older than 24 hours)
   */
  clearOldTasks(): void {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    this.tasks.forEach((task, taskId) => {
      if (
        (task.status === "COMPLETED" || task.status === "FAILED") &&
        task.completedAt &&
        now - task.completedAt.getTime() > twentyFourHours
      ) {
        this.tasks.delete(taskId);
        this.progressUpdates.delete(taskId);
        this.taskQueue = this.taskQueue.filter((item) => item.taskId !== taskId);
      }
    });
  }
}

// Global progress tracker instance
export const progressTracker = new ProgressTracker();

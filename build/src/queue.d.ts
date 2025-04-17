/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import type { ApplicationService, LoggerService } from '@adonisjs/core/types';
import type { Job as BullMQJob, JobsOptions } from 'bullmq';
import { Queue } from 'bullmq';
import type { AllowedJobTypes, InferJobPayload, JobHandlerConstructor, QueueConfig } from './types/main.js';
export declare class QueueManager {
    #private;
    constructor(options: QueueConfig, logger: LoggerService, app: ApplicationService);
    actualQueueName(options: JobsOptions & {
        queueName?: string;
        concurrency?: number;
    }): string;
    dispatch<Job extends AllowedJobTypes>(job: Job, payload: Job extends JobHandlerConstructor ? InferJobPayload<Job> : Job extends Promise<infer A> ? (A extends {
        default: JobHandlerConstructor;
    } ? InferJobPayload<A['default']> : never) : never, options?: JobsOptions & {
        queueName?: string;
        concurrency?: number;
    }): Promise<BullMQJob<any, any, string>>;
    process({ queueName }: {
        queueName?: string;
    }): Promise<this | undefined>;
    get(queueName?: string): Queue<any, any, string, any, any, string> | undefined;
    getOrSet(queueName?: string): Queue<any, any, string, any, any, string>;
    clear(queueName?: string): Promise<void>;
    closeAll(): Promise<void>;
}

import { Job as BullMQJob } from 'bullmq';
import type { LoggerService } from '@adonisjs/core/types';
interface InternalToInject {
    job: BullMQJob;
    logger: LoggerService;
}
export declare abstract class Job {
    #private;
    logger: LoggerService;
    $injectInternal(internals: InternalToInject): void;
    getJob(): BullMQJob;
    getId(): string | undefined;
    getDelay(): number | undefined;
    getAttempts(): number;
    getFailedReason(): string | undefined;
    abstract handle(payload: unknown): Promise<void>;
    abstract rescue(payload: unknown, error: Error): Promise<void>;
}
export {};

/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import type { QueueConfig } from './types/main.js';
export declare function defineConfig<T extends QueueConfig>(config: T): T;

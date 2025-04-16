/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import type { ApplicationService } from '@adonisjs/core/types';
export default class QueueProvider {
    #private;
    protected app: ApplicationService;
    constructor(app: ApplicationService);
    register(): void;
    shutdown(): Promise<void>;
}

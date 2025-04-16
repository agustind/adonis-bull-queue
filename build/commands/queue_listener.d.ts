/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
export default class QueueListener extends BaseCommand {
    static commandName: string;
    static description: string;
    queue: string[];
    static options: CommandOptions;
    run(): Promise<void>;
}

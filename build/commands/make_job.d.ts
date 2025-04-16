/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import { BaseCommand } from '@adonisjs/core/ace';
import type { CommandOptions } from '@adonisjs/core/types/ace';
export default class MakeJob extends BaseCommand {
    static commandName: string;
    static description: string;
    static options: CommandOptions;
    name: string;
    run(): Promise<void>;
}

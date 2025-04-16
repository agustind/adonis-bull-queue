var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import { BaseCommand, flags } from '@adonisjs/core/ace';
export default class QueueListener extends BaseCommand {
    static commandName = 'queue:listen';
    static description = 'Listen to one or multiple queues';
    static options = {
        startApp: true,
        staysAlive: true,
    };
    async run() {
        const config = this.app.config.get('queue');
        const queue = await this.app.container.make('rlanz/queue');
        const router = await this.app.container.make('router');
        router.commit();
        let shouldListenOn = this.parsed.flags.queue;
        if (!shouldListenOn) {
            shouldListenOn = config.queueNames ?? ['default'];
        }
        await Promise.all(shouldListenOn.map((queueName) => queue.process({
            queueName,
        })));
    }
}
__decorate([
    flags.array({ alias: 'q', description: 'The queue(s) to listen on' })
], QueueListener.prototype, "queue", void 0);

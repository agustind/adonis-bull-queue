/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
export default class QueueProvider {
    app;
    #queue = null;
    constructor(app) {
        this.app = app;
    }
    register() {
        this.app.container.singleton('rlanz/queue', async () => {
            const { QueueManager } = await import('../src/queue.js');
            const config = this.app.config.get('queue');
            const logger = await this.app.container.make('logger');
            this.#queue = new QueueManager(config, logger, this.app);
            return this.#queue;
        });
    }
    async shutdown() {
        if (this.#queue) {
            await this.#queue.closeAll();
        }
    }
}

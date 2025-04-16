/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import app from '@adonisjs/core/services/app';
let queue;
await app.booted(async () => {
    queue = await app.container.make('rlanz/queue');
});
export { queue as default };

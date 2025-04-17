/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import { RuntimeException } from '@poppinss/utils';
import { isClass } from '@sindresorhus/is';
import { Queue, Worker } from 'bullmq';
export class QueueManager {
    #app;
    #logger;
    #options;
    #queues = new Map();
    constructor(options, logger, app) {
        this.#options = options;
        this.#logger = logger;
        this.#app = app;
        const computedConfig = {
            ...this.#options.queue,
        };
        if (typeof computedConfig.connection === 'undefined') {
            computedConfig.connection = this.#options.defaultConnection;
        }
        // Define the default queue
        this.#queues.set('default', new Queue('default', computedConfig));
    }
    /**
     *
     */
    async #resolveJob(job) {
        if (isClass(job)) {
            return job;
        }
        const jobClass = await job();
        return jobClass['default'];
    }
    #getJobPath(job) {
        if (!job['$$filepath'] || typeof job['$$filepath'] !== 'string') {
            throw new RuntimeException('Job handler is missing the $$filepath property');
        }
        return job['$$filepath'];
    }
    #maybeAddQueue(queueName = 'default') {
        const computedConfig = {
            ...this.#options.queue,
        };
        if (typeof computedConfig.connection === 'undefined') {
            computedConfig.connection = this.#options.defaultConnection;
        }
        if (!this.#queues.has(queueName)) {
            this.#queues.set(queueName, new Queue(queueName, computedConfig));
        }
        return this.#queues.get(queueName);
    }
    async #instantiateJob(job) {
        const { default: jobClass } = await import(job.name);
        const jobClassInstance = await this.#app.container.make(jobClass);
        jobClassInstance.$injectInternal({ job, logger: this.#logger });
        return jobClassInstance;
    }
    async dispatch(job, payload, options = {}) {
        const queueName = options.queueName || 'default';
        const queue = this.#maybeAddQueue(queueName);
        const jobClass = await this.#resolveJob(job);
        const jobPath = this.#getJobPath(jobClass);
        return queue.add(jobPath, payload, {
            ...this.#options.jobs,
            ...options,
        });
    }
    async process({ queueName }) {
        this.#logger.info(`Queue [${queueName || 'default'}] processing started...`);
        const computedConfig = {
            ...this.#options.worker,
        };
        if (typeof computedConfig.connection === 'undefined') {
            computedConfig.connection = this.#options.defaultConnection;
        }
        const queue = this.#queues.get(queueName || 'default');
        await queue?.setGlobalConcurrency(2);
        const concurrency = await queue?.getGlobalConcurrency();
        console.log(queue);
        console.log(this.#queues);
        console.log(`Queue [${queueName || 'default'}] concurrency set to ${concurrency}`);
        const worker = new Worker(queueName || 'default', async (job) => {
            let jobClassInstance;
            try {
                jobClassInstance = await this.#instantiateJob(job);
            }
            catch (e) {
                this.#logger.error(`Job ${job.name} was not able to be created`);
                this.#logger.error(e);
                return;
            }
            this.#logger.info(`Job ${job.name} started`);
            await this.#app.container.call(jobClassInstance, 'handle', [job.data]);
            this.#logger.info(`Job ${job.name} finished`);
        }, computedConfig);
        worker.on('failed', async (job, error) => {
            this.#logger.error(error.message, []);
            // If removeOnFail is set to true in the job options, job instance may be undefined.
            // This can occur if worker maxStalledCount has been reached and the removeOnFail is set to true.
            if (job && (job.attemptsMade === job.opts.attempts || job.finishedOn)) {
                // Call the failed method of the handler class if there is one
                const jobClassInstance = await this.#instantiateJob(job);
                await this.#app.container.call(jobClassInstance, 'rescue', [job.data, error]);
            }
        });
        return this;
    }
    get(queueName = 'default') {
        return this.#queues.get(queueName);
    }
    getOrSet(queueName = 'default') {
        return this.#maybeAddQueue(queueName);
    }
    async clear(queueName = 'default') {
        const queue = this.#queues.get(queueName);
        if (!queue) {
            return this.#logger.error(`Queue [${queueName}] not found`);
        }
        await queue.obliterate();
        return this.#logger.info(`Queue [${queueName}] cleared`);
    }
    async closeAll() {
        for (const [queueName, queue] of this.#queues.entries()) {
            await queue.close();
            this.#queues.delete(queueName);
        }
    }
}

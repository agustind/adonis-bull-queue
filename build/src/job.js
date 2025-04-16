export class Job {
    #bullMqJob;
    #injected = false;
    $injectInternal(internals) {
        if (this.#injected) {
            return;
        }
        this.#bullMqJob = internals.job;
        this.logger = internals.logger;
        this.#injected = true;
    }
    getJob() {
        return this.#bullMqJob;
    }
    getId() {
        return this.#bullMqJob.id;
    }
    getDelay() {
        return this.#bullMqJob.delay;
    }
    getAttempts() {
        return this.#bullMqJob.attemptsMade;
    }
    getFailedReason() {
        return this.#bullMqJob.failedReason;
    }
}

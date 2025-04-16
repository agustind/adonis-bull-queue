/**
 * @rlanz/bull-queue
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */
import { InvalidArgumentsException } from '@poppinss/utils';
export function defineConfig(config) {
    if (!config) {
        throw new InvalidArgumentsException('Invalid config. It must be a valid object');
    }
    if (!config.defaultConnection) {
        throw new InvalidArgumentsException('Invalid config. Missing property "defaultConnection" inside it');
    }
    return config;
}

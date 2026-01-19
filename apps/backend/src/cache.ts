import { RedisCacheService } from '@blazjs/cache'
import { Service } from 'typedi'
import { AppConfig } from './configs'

@Service()
export class CacheService {
    client: RedisCacheService

    constructor(config: AppConfig) {
        this.client = new RedisCacheService(config.redis)
    }
}

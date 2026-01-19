import { Service } from 'typedi'
import { CacheService } from '../../cache'
import { AppConfig } from '../../configs'
import { AuthPayload } from './auth.service'

@Service()
export class AuthCacheService {
    keys = {
        accessTokens: (userId: string, token: string) =>
            `access-tokens:${userId}:${token}`,
    }

    constructor(
        private cacheService: CacheService,
        private config: AppConfig
    ) {}

    async setAccessToken(payload: AuthPayload, token: string) {
        const key = this.keys.accessTokens(payload.userId, token)
        await this.cacheService.client.set(
            key,
            Date.now().toString(),
            this.config.jwt.accessExpiresIn
        )
    }

    async tokenExists(key: string) {
        return await this.cacheService.client.exist(key)
    }

    async removeToken(key: string) {
        return await this.cacheService.client.del(key)
    }
}

import { instanceToPlain, plainToInstance } from 'class-transformer'
import jwt from 'jsonwebtoken'
import { Inject, Service } from 'typedi'
import { AppConfig } from '../../configs'
import { Errors } from '../../utils/error'
import { AuthCacheService } from './auth-cache.service'

export class AuthPayload {
    userId: string
    walletAddress: string
    authorId: string
}

@Service()
export class AuthService {
    constructor(
        @Inject() private config: AppConfig,
        @Inject() private authCacheService: AuthCacheService
    ) {}

    async signToken(payload: AuthPayload, salt?: string) {
        const { accessSecret, accessExpiresIn } = this.config.jwt
        const jwtSecret = accessSecret + (salt ?? '')
        const sign = jwt.sign(payload, jwtSecret, {
            expiresIn: accessExpiresIn,
        })
        await this.authCacheService.setAccessToken(payload, sign)

        return sign
    }

    async verifyToken(token: string) {
        const decoded = jwt.decode(token, {
            complete: true,
        })
        if (!decoded) throw Errors.Unauthorized
        const authPayload = plainToInstance(
            AuthPayload,
            instanceToPlain(decoded.payload)
        )

        const jwtSecret = this.config.jwt.accessSecret
        try {
            jwt.verify(token, jwtSecret)
        } catch {
            throw Errors.Unauthorized
        }

        const { userId } = authPayload
        const cacheKey = this.authCacheService.keys.accessTokens(userId, token)
        const isTokenExisted = await this.authCacheService.tokenExists(cacheKey)
        if (!isTokenExisted) {
            throw Errors.Unauthorized
        }

        return authPayload
    }

    async revokeAccessToken(token: string) {
        const decoded = jwt.decode(token, {
            complete: true,
        })
        if (!decoded) throw Errors.Unauthorized
        const authPayload = plainToInstance(
            AuthPayload,
            instanceToPlain(decoded.payload)
        )
        const key = this.authCacheService.keys.accessTokens(
            authPayload.userId,
            token
        )
        await this.authCacheService.removeToken(key)
    }
}

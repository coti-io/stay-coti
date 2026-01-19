import { NextFunction, Request, Response } from 'express'
import { Inject, Service } from 'typedi'
import { Errors } from '../../utils/error'
import { AuthService } from './auth.service'

export interface AuthRequest extends Request {
    userId: string
    walletAddress: string
    accessToken: string
    authorId: string
}

@Service()
export class AuthMiddleware {
    constructor(@Inject() private authService: AuthService) {}

    async authorize(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const token = getAuthHeader(req)
            if (!token) throw Errors.Unauthorized
            const payload = await this.authService.verifyToken(token)
            req.userId = payload.userId
            req.walletAddress = payload.walletAddress
            req.accessToken = token
            req.authorId = payload.authorId
            next()
        } catch (err) {
            next(err)
        }
    }

    async authorizeIfNeeded(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const token = getAuthHeader(req)
            if (!token) return next()
            const payload = await this.authService.verifyToken(token)
            req.userId = payload.userId
            req.walletAddress = payload.walletAddress
            req.accessToken = token
            req.authorId = payload.authorId
            next()
        } catch (err) {
            next(err)
        }
    }
}

const getAuthHeader = (req: Request) => {
    const authHeader = req.headers['authorization']
    return authHeader?.split(' ')[1]
}

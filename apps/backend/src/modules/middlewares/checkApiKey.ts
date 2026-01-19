import { NextFunction, Request, Response } from 'express'
import { Service } from 'typedi'


@Service()
export class CheckApiKeyMiddleware {
    constructor() {}

    async checkApiKey(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const apiKey = req.header('x-api-key')

        if (!apiKey || apiKey !== process.env.API_KEY) {
            return res.status(403).json({
                data: null,
                error: {
                    status: 403,
                    code: 'Forbidden', 
                    message: 'Invalid API Key' 
                }
            })
        }

        next()
    }
}

import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { AuthRequest } from './auth.middleware'

export class AuthRequestDTO extends BaseRequestDTO {
    userId: string
    walletAddress: string
    authorId: string

    bind(req: AuthRequest) {
        super.bind(req)
        this.userId = req.userId
        this.walletAddress = req.walletAddress
        this.authorId = req.authorId
    }
}

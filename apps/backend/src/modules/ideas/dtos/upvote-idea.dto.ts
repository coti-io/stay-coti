import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { IsNumber, IsString } from 'class-validator'
import { AuthRequestDTO } from '../../auth/auth-request.dto'

export interface UpvoteIdeaDTO {
    ideaId: string
    userId: string
    walletAddress: string
    transactionHash: string
    authorId: string
}

export class UpvoteIdeaReqDTO extends AuthRequestDTO implements UpvoteIdeaDTO {
    @IsString()
    ideaId: string

    @IsString()
    transactionHash: string
}

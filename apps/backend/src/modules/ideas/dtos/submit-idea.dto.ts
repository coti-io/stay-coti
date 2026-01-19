import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { IsNumber, IsString } from 'class-validator'
import { AuthRequestDTO } from '../../auth/auth-request.dto'

export interface SubmitIdeaDTO {
    name: string
    description: string
    categoryId: string
    userId: string
    walletAddress: string
    authorId: string
}

export class SubmitIdeaReqDTO extends AuthRequestDTO implements SubmitIdeaDTO {
    @IsString()
    name: string

    @IsString()
    description: string

    @IsString()
    categoryId: string
}

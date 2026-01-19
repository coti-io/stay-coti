import { BaseRequestDTO, DataRequestDTO } from '@blazjs/common'
import { IsNumber, IsString } from 'class-validator'
import { AuthRequestDTO } from '../../auth/auth-request.dto'

export interface GetUserIdeasDTO {
    limit?: number
    page?: number
    orderByKey?: string
    orderByValue?: string
    authorId?: string
    search?: string
    userId: string
    walletAddress: string
}

export class GetUserIdeasReqDTO extends AuthRequestDTO implements GetUserIdeasDTO {
    @IsString()
    orderByKey: string = '_publishedAt'

    @IsString()
    orderByValue: string = 'desc'

    @IsNumber()
    limit: number = 10

    @IsNumber()
    page: number = 1  

    @IsString()
    search: string = ''
}

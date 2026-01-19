import { Request } from '@blazjs/common'
import { Service } from 'typedi'
import { AuthRequestDTO } from '../auth/auth-request.dto'
import { UserRequestSignInDTOReqDTO } from './dtos/user-request-signin.dto'
import { UserVerifySignInDTOReqDTO } from './dtos/user-verify-signin.dto'
import { UserService } from './user.service'
import { IdeaService } from '../ideas/idea.service'
import { GetUserIdeasReqDTO } from './dtos/get-user-ideas.dto'

@Service()
export class UserController {
    constructor(private userService: UserService, private ideaService: IdeaService) {}

    @Request(UserRequestSignInDTOReqDTO)
    async requestSignIn(data: UserRequestSignInDTOReqDTO) {
        return await this.userService.requestSignIn(data)
    }

    @Request(UserVerifySignInDTOReqDTO)
    async verifySignIn(data: UserVerifySignInDTOReqDTO) {
        return await this.userService.verifySignIn(data)
    }

    @Request(AuthRequestDTO)
    async getProfile(data: AuthRequestDTO) {
        return await this.userService.getProfile(data)
    }

    @Request(GetUserIdeasReqDTO)
    async getUserIdeas(data: GetUserIdeasReqDTO) {
        return await this.ideaService.getUserIdeas(data)
    }
}

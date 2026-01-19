import { TypeOrmDataSource } from '@blazjs/datasource'
import { verifyMessage } from 'ethers'
import { Inject, Service } from 'typedi'
import { AppConfig } from '../../configs'
import { INJECT_SQL } from '../../datasource'
import { Errors } from '../../utils/error'
import { getRandomString, randomID } from '../../utils/string'
import { AuthRequestDTO } from '../auth/auth-request.dto'
import { AuthService } from '../auth/auth.service'
import { UserRequestSignInDTO } from './dtos/user-request-signin.dto'
import { UserVerifySignInDTO } from './dtos/user-verify-signin.dto'
import { User } from './entities/user.entity'
import { UserRepos } from './repos/user.repos'
import { DatoCmsService } from '../datocms/datoCms.service'

const ACCESS_CODE_LENGTH = 6

@Service()
export class UserService {
    constructor(
        @Inject(INJECT_SQL) private datasource: TypeOrmDataSource,
        private userRepos: UserRepos,
        private authService: AuthService,
        private config: AppConfig,
        private datoCmsService: DatoCmsService,
    ) {}

    async requestSignIn(data: UserRequestSignInDTO) {
        const { walletAddress } = data
        const accessCode = getRandomString(ACCESS_CODE_LENGTH)
        const user = await User.findOne({
            where: {
                walletAddress,
            },
        })

        if (!user) {
            await this.createUser(data, accessCode)
        } else {
            user.accessCode = accessCode
            await user.save()
        }

        return accessCode
    }

    async verifySignIn(data: UserVerifySignInDTO) {
        const { walletAddress, signature } = data
        const user = await User.findOne({
            where: {
                walletAddress,
            },
        })
        if (!user) throw Errors.UserNotFound

        const verify = await this.verifySignature({
            message: user.accessCode,
            signature,
            publicKey: walletAddress,
        })
        if (!verify) {
            throw Errors.InvalidSignature
        }

        const accessToken = await this.authService.signToken({
            userId: user.userId,
            walletAddress,
            authorId: user.authorId,
        })

        return accessToken
    }

    async createUser(data: UserRequestSignInDTO, accessCode: string) {
        return this.datasource.transaction(async (manager) => {
            const uuid = randomID()

            const author = await this.createAuthorDatoCms({
                name: data.walletAddress,
            })

            const user = await manager.save(
                User.create({
                    userId: uuid,
                    walletAddress: data.walletAddress,
                    accessCode,
                    authorId: author.id,
                }),
            )
            return user
        })
    }

    async getProfile(data: AuthRequestDTO) {
        const { userId } = data
        return await User.findOne({
            where: {
                userId,
            },
        })
    }

    private async verifySignature(data: {
        message: string
        signature: string
        publicKey: string
    }) {
        const signerAddress = verifyMessage(data.message, data.signature)
        return signerAddress?.toLowerCase() === data.publicKey?.toLowerCase()
    }

    private async createAuthorDatoCms(data: { name: string }) {
        const name = data.name
        const uuid = randomID()
        const dataAuthor = {
            data: {
                type: 'item',
                attributes: {
                    name: name,
                    slug: uuid,
                },
                relationships: {
                    item_type: {
                        data: {
                            type: 'item_type',
                            id: this.config.datoCms.modelAuthor, // ModelID of Author
                        },
                    },
                },
            },
        }

        const author = await this.datoCmsService.requestApi(
            'POST',
            dataAuthor,
            {},
        )
        if (!author) {
            throw Errors.DatoCmsServerError
        }
        return author as any
    }
}

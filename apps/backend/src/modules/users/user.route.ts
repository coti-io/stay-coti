import { BaseRoute } from '@blazjs/common'
import { Router } from 'express'
import { Service } from 'typedi'
import { UserController } from './user.controller'
import { AuthMiddleware } from '../auth/auth.middleware'

@Service()
export class UserRoute implements BaseRoute {
    route? = 'users'
    router: Router = Router()

    constructor(
        private userController: UserController,
        private authMiddleware: AuthMiddleware,
    ) {
        this.router.post(
            '/sign-in',
            this.userController.requestSignIn.bind(this.userController),
        )

        this.router.post(
            '/sign-in/verify',
            this.userController.verifySignIn.bind(this.userController),
        )

        this.router.get(
            '/profile',
            this.authMiddleware.authorize.bind(this.authMiddleware),
            this.userController.getProfile.bind(this.userController),
        )

        this.router.get(
            '/ideas',
            this.authMiddleware.authorize.bind(this.authMiddleware),
            this.userController.getUserIdeas.bind(this.userController),
        )
    }
}

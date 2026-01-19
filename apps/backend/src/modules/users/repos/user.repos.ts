import { TypeOrmDataSource, TypeOrmRepos } from '@blazjs/datasource'
import { Inject, Service } from 'typedi'
import { INJECT_SQL } from '../../../datasource'
import { User } from '../entities/user.entity'

@Service()
export class UserRepos extends TypeOrmRepos<User> {
    constructor(@Inject(INJECT_SQL) datasource: TypeOrmDataSource) {
        super(User, datasource)
    }
}

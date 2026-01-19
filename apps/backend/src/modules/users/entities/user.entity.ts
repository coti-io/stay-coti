import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('User')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ length: 255, unique: true })
    userId: string

    @Column({ length: 255, unique: true })
    authorId: string

    @Column()
    walletAddress: string

    @Column({ length: 10 })
    accessCode: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

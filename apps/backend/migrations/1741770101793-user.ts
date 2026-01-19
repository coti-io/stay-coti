import { MigrationInterface, QueryRunner } from 'typeorm'

export class User1741770101793 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE User (
                id INT AUTO_INCREMENT PRIMARY KEY,
                userId VARCHAR(255) NOT NULL UNIQUE,
                authorId VARCHAR(255) NOT NULL UNIQUE,
                walletAddress VARCHAR(255) NOT NULL,
                accessCode VARCHAR(10) NOT NULL,
                createdAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL,
                updatedAt DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL ON UPDATE CURRENT_TIMESTAMP(6)
            );
        `)
        await queryRunner.query(`
            CREATE INDEX ix_user_accessCode ON User (accessCode);
        `)
        await queryRunner.query(`
            CREATE INDEX ix_user_walletAddress ON User (walletAddress);
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}

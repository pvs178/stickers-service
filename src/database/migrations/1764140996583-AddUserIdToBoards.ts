import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToBoards1764140996583 implements MigrationInterface {
  name = 'AddUserIdToBoards1764140996583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "boards" ADD "userId" uuid`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "boards" DROP COLUMN "userId"`);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBoardsAndStickers1764083535273 implements MigrationInterface {
    name = 'CreateBoardsAndStickers1764083535273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "boards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_606923b0b068ef262dfdcd18f44" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stickers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "boardId" uuid NOT NULL, "content" text NOT NULL, "positionX" double precision NOT NULL, "positionY" double precision NOT NULL, "color" character varying(50), "userId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e1dafa4063a5532645cc2810374" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stickers" ADD CONSTRAINT "FK_89d5a64ff4b45bccf11f2825183" FOREIGN KEY ("boardId") REFERENCES "boards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stickers" DROP CONSTRAINT "FK_89d5a64ff4b45bccf11f2825183"`);
        await queryRunner.query(`DROP TABLE "stickers"`);
        await queryRunner.query(`DROP TABLE "boards"`);
    }

}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnImageForTableTask1751528643714
  implements MigrationInterface
{
  name = 'UpdateColumnImageForTableTask1751528643714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tasks\` ADD \`image\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`image\``);
  }
}

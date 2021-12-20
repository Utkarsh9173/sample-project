import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class users1608788393127 implements MigrationInterface {
  private readonly tableName = "users";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            isNullable: true,
            isUnique: false,
          },
          {
            name: "password",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: true,
          },{
            name: "role",
            type: "varchar",
            isNullable: true,
            isUnique: false,
          },
          {
            name: "created_at",
            type: "datetime",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "datetime",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}

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
            type: "uuid",
            isPrimary: true,
            isNullable: false,
            default: "uuid_generate_v4()",
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
            name: "first_name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "last_name",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "dob",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "marketing",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "user_unique_key",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "is_verified",
            type: "varchar",
            isNullable: false,
            default: false
          },
          {
            name: "created_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamptz",
            isNullable: false,
            default: "now()",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class reminder1639999601910 implements MigrationInterface {
  private readonly tableName = "reminder";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: false,
          },

          {
            name: "status",
            type: "integer",
            isNullable: false,
            default: 0,
          },
          {
            name: "priority",
            type: "varchar",
            isNullable: false,
            default: `"Low"`,
          },
          {
            name: "type",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "user_id",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "date",
            type: "datetime",
            isNullable: false,
          },
        
          {
            name: "created_at",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "user_id_fk",
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
          }),
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

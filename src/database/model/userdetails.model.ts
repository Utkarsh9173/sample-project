import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class UserDetails {
  @PrimaryGeneratedColumn("uuid")
  public id: string;
  @Column()
  public email: string;

  @Column()
  public Name: string;

  @Column()
  public password: string;

  @Column()
  public role: string;

  @CreateDateColumn({
    select: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  public updatedAt: Date;
}

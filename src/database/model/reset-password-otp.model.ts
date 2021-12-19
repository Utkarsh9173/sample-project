import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.model";

@Entity("reset_password_otp")
export class ResetPasswordOtp {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  /**
   * email is kept to track to which email OTP was sent to
   * it is not unique just in case user has changed email
   * At this moment (MVP), user cannot change email, but doing this to keep this option open for future releases
   */
  @Column({ unique: false, nullable: false })
  public email: string;

  /**
   * association with user's account
   */
  @Column({ unique: false, nullable: false })
  public userId: string;

  @Column()
  public otp: string;

  @Column()
  public usedAt: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  public updatedAt: Date;

  @Column({ select: false })
  public deletedAt: Date;

  @OneToMany((type) => User, (user) => user.id)
  @JoinColumn({ referencedColumnName: "id", name: "user_id" })
  public user: User;
}

import { SocialPlatforms } from "@database/enum/user";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ unique: false })
  public email: string;

  @Column()
  public password: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public dob: string;

  @Column()
  public marketing: string;

  @Column()
  public userUniqueKey: string;

  @Column({
      name: "is_verified",
      type: "boolean",
      nullable: false,
      default: false
    })
  public isVerified: boolean;

  // @Column()
  // public phoneCode: string;

  // @Column()
  // public stripeCustomerId: string;

  // @Column({ type: "int" })
  // public contact: number;

  // @Column({
  //   name: "social_platform",
  //   type: "varchar",
  //   nullable: true
  // })
  // public socialPlatform: SocialPlatforms;

  // @Column({
  //   name: "social_platform_id",
  //   type: "varchar",
  //   nullable: true
  // })
  // public socialPlatformId: string;

  // // will not be null in case of apple sign-in
  // @Column({
  //   name: "identity_token",
  //   type: "varchar",
  //   nullable: true
  // })
  // public identityToken: string;

  // @Column({
  //   name: "is_account_setup",
  //   type: "boolean",
  //   default: false
  // })
  // public isAccountSetup: boolean;

  // @Column({
  //   name: "is_member_society",
  //   type: "boolean",
  //   default: false
  // })
  // public isMemberSociety: boolean;

  // @Column({
  //   name: "keyfob_serial_id",
  //   type: "varchar",
  //   nullable: true
  // })
  // public keyfobSerialId: string;

  @CreateDateColumn({
    select: false
  })
  public createdAt: Date;

  @UpdateDateColumn({
    select: false
  })
  public updatedAt: Date;
}

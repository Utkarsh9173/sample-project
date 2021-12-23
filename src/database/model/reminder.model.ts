import { integer } from "aws-sdk/clients/cloudfront";
import { DateTime } from "aws-sdk/clients/devicefarm";
import { time } from "aws-sdk/clients/frauddetector";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserDetails } from "./userdetails.model";

@Entity("reminder")
export class Reminder {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public description: string;

  @Column()
  public date: Date;


  @Column()
  public status: number;

  @Column()
  public priority: string;

  @Column()
  public type: string;

  @ManyToOne(() => UserDetails, (user) => user.id)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user: UserDetails;

  @CreateDateColumn({
    select: false,
  })
  public createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  public updatedAt: Date;
}

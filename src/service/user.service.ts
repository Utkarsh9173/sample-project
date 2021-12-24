import {
  getManager,
  DeepPartial,
  getRepository,
  ILike,
  getCustomRepository,
  createQueryBuilder,
  Connection,
} from "typeorm";
import bcrypt from "bcrypt";
import createError from "http-errors";
import i18n from "i18n";
import constant from "@config/constant";
import { v4 } from "uuid";
import {
  Signin,
  Signup,
  forgotPassword,
  updateReminder,
  getReminder,
  Reminderin,
} from "@type/user";
import { UsersDetails } from "@database/repository/UserDetails.repository";
import { ReminderRepo } from "@database/repository/reminder.repository";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@config/secret";
import { resetPassword } from "@api/validator/base.validator";
import { Reminder } from "../database/model/reminder.model";
import { time } from "console";
import { DateTime } from "aws-sdk/clients/devicefarm";
import moment from "moment";
import { response } from "express";
import { any, date } from "@hapi/joi";
import { Query } from "express-serve-static-core";

export class UserService {
  constructor() {}

  /**
   * generates a hashed string from the given string
   * @param  {string} password
   * @returns Promise for a hashed string
   */
  private async getEncryptedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(constant.SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
  }
  private async getDcryptedPassword(
    password: string,
    active: string
  ): Promise<boolean> {
    return bcrypt.compare(password, active);
  }
  public async Signup(user: Signup): Promise<any> {
    const userRepository = getManager().getCustomRepository(UsersDetails);

    user.password = await this.getEncryptedPassword(user.password);

    user.role = "Admin";
    user.id = v4();

    const activeUser = await userRepository.findUserByEmailId(user.email);
    if (activeUser) {
      throw new createError.NotFound(i18n.__("user_already _exist"));
    }

    return userRepository.save(user);
  }

  public async Signin(user: Signin): Promise<any> {
    const userRepository = getManager().getCustomRepository(UsersDetails);

    const activeUser = await userRepository.findUserByEmailId(user.email);
    console.log(activeUser.password);

    if (!activeUser) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }
    const passwordCheck = await this.getDcryptedPassword(
      user.password,
      activeUser.password
    );
    if (!passwordCheck) {
      throw new createError.NotFound(i18n.__("invalid_credentials"));
    }

    return {
      userDetails: activeUser,
      token: jwt.sign({ ...activeUser }, JWT_SECRET, {
        //expiresIn: "1d",
      }),
    };
  }
  public async forgotPassword(user: forgotPassword): Promise<any> {
    const userRepository = getManager().getCustomRepository(UsersDetails);

    const activeUser = await userRepository.findUserByEmailId(user.email);
    console.log(activeUser.email);
    if (!activeUser) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    } else {
      activeUser.password = await this.getEncryptedPassword(user.password);
      console.log("here", activeUser);
    }
    console.log(activeUser);

    return userRepository.save(activeUser);
  }

  public async setReminder(reminderInfo: Partial<any>): Promise<any> {
    let response;
    const userRepo = getManager().getCustomRepository(UsersDetails);
    const reminderRepo = getManager().getCustomRepository(ReminderRepo);
    const reminderTime: any = `${reminderInfo.date} ${reminderInfo.time}`;
    // reminderTime = moment(reminderTime, "YYYY-MM-DD hh:mm A").format();
    reminderInfo.date = moment(reminderTime, "YYYY-MM-DD hh:mm A").format();
    console.log("timeeeeeeeeeeeeee", reminderTime);

    const user = await userRepo.findOne(reminderInfo.user_id);
    if (!user) {
      console.log("no user found!!!!!!!!!!!!!!!!!!!!!!!!!");
      response = "no user found";

      throw new createError.NotFound(i18n.__("user_not_found"));
    } else {
      console.log("before activeusercheck");

      const activerem = await reminderRepo.findreminder(reminderInfo.date);
      if (activerem) {
        throw new createError.NotFound(
          i18n.__("reminder already exist at this time")
        );
      } else {
        console.log(activerem, "user dataaaaaa");

        console.log("saving reminder!!!!!!!!!!!!!!!!!!!!!!!!!", reminderInfo);
        reminderInfo.user = user;
        console.log(JSON.stringify(reminderInfo));
        response = reminderRepo.save(reminderInfo);
      }
    }

    return response;
  }

  // }
  // public async setReminder(
  //   date: Date,
  //   description: string,
  //   userId: any,
  //   type: string,
  //   priority: string,
  //   time:DateTime,
  // ): Promise<any> {
  //   const userRepo = getManager().getCustomRepository(UsersDetails);
  //   const reminderRepo = getManager().getCustomRepository(ReminderRepo);
  //   const formatterDate = moment(date).format('YYYY-MM-DD');
  //   const formattedtime = moment(time, 'HH:mm A').format('HH:mm:ss');
  //   console.log("================================timesssssss",formatterDate,"=======",formattedtime);

  //   const user = await userRepo.findOne(userId.id);
  //   if (!user) {
  //     throw new createError.NotFound(i18n.__("user_not_found"));
  //   }

  //   const activerem = await reminderRepo.findreminder(time);
  //   if (activerem) {
  //     throw new createError.NotFound(
  //       i18n.__("reminder already exist at this time")
  //     );
  //   }

  //   const id = v4();
  //   return reminderRepo.save({
  //     description,
  //     type,
  //     priority,
  //     date: formatterDate,
  //     user,
  //     id,
  //     time: formattedtime,
  //   });
  // }

  public async updateReminder(
    updatereporeminder: updateReminder
  ): Promise<any> {
    const updateRepo = getRepository(Reminder).findOne(updatereporeminder.id);
    console.log(updateRepo, "user table data=========");

    let reminderTime: any = `${updatereporeminder.date} ${updatereporeminder.time}`;
    reminderTime = moment(reminderTime, "YYYY-MM-DD hh:mm A").format();
    updatereporeminder.date = reminderTime;
    console.log(updatereporeminder, "===================heree==========");

    if (!updateRepo) {
      throw new createError.NotFound(i18n.__("Reminder_not_found"));
    }
    return getRepository(Reminder).save(updatereporeminder);
  }

  public async getReminder(status: string, reminderDate:any, userId: string): Promise<any> {
      let statusClause = 'status = 0';
      let formattedReminderDate;
      if(status) {
        statusClause = `status = ${status}`;
      }
      if(reminderDate) {
        formattedReminderDate = moment(reminderDate,'YYYY-MM-DD').format('YYYY-M-D');
      }
      const userRepository = getManager().getCustomRepository(UsersDetails);
      const reminderRepository = getManager().getCustomRepository(ReminderRepo);
      const info: any = await reminderRepository.createQueryBuilder().where(`user_id = :userId and DATE(date) = :date and ${statusClause}`, { date: formattedReminderDate, userId }).getMany();
      return info;
    }
  




/*   
if(statusinfo.length>0 && dateinfo.length>0){
       console.log("writing response 1");
       
       response = statusinfo
     }
     else if (dateinfo.length>0){
      console.log("writing response 2");
       response= dateinfo
     }else if(dateinfo && !dateinfo && !statusinfo){
      console.log("writing response 3");
      response = info
     }
     else{
      response="No Reminder Found"
     }
     */

  // public async getReminder(user: ReminderRepo): Promise<any> {
  //   let response;
  //   const userRepository = getManager().getCustomRepository(UsersDetails);
  //   const reminderRepository = getManager().getCustomRepository(ReminderRepo);
  //   console.log(user, "==============USERID");
  //   const userinfo = await userRepository.find({
  //     where: {
  //       id: user,
  //     },
  //   });
  //   console.log("heree==", { ...userinfo });
  //     if (userinfo) {
  //       console.log("entered heree");
        
  //     const searchedDate = reminderRepository.find({
  //       where: {
  //         date: date,
  //         status: ILike(status),
  //       },
  //     });
  //     console.log("number 1======",searchedDate,date,status);

      
  //     response = searchedDate;
  //   } else {

  //     const searchedDate = reminderRepository.find({
  //       where: {
  //         user_id:user
  //       },
  //     });
  //     console.log("number 2======",searchedDate,);
  //     response = searchedDate;
  //   }
  //   return response;
  // }

  public async deleteReminder(id: string): Promise<any> {
    const reminderRepo = getManager().getCustomRepository(ReminderRepo);

    const deleteRepo = await reminderRepo.findOne(id);
    if (!deleteRepo) {
      throw new createError.NotFound(i18n.__("Reminder_not_found"));
    }

    return reminderRepo.delete(id);
  }
}
function QueryDeepPartialEntity<
  T
>(): import("typeorm/query-builder/QueryPartialEntity").QueryDeepPartialEntity<
  import("../database/model/reminder.model").Reminder
> {
  throw new Error("Function not implemented.");
}

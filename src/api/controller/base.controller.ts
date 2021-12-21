import { Request, Response } from "express";
import i18n from "i18n";
import { ResponseParser } from "@util/response-parser";
import constant from "@config/constant";
import { UserService } from "@service/user.service";
import {
  Signin,
  Signup,
  forgotPassword,
  updateReminder,
  remove,
} from "@type/user";
import { getManager, getRepository, ILike } from "typeorm";
import { Reminder } from "@database/model/reminder.model";
import { ReminderRepo } from "@database/repository/reminder.repository";
import { reminder } from "@api/validator/signup.validator";
import { integer } from "aws-sdk/clients/cloudfront";
import { DateTime } from "aws-sdk/clients/devicefarm";
import moment from "moment";
import { UsersDetails } from "@database/repository/userdetails.repository";

export class BaseController {
  private responseParser: ResponseParser;
  private userService: UserService;

  constructor() {
    this.responseParser = new ResponseParser();
    this.userService = new UserService();
  }

  public Signup = async (req: Request, res: Response): Promise<void> => {
    const params: Signup = req.body;
    const response = await this.userService.Signup(params);

    return this.responseParser
      .setHttpCode(constant.HTTP_STATUS_CREATED)
      .setBody(response)
      .setMessage(i18n.__("user_created"))
      .send(res);
  };

  public Signin = async (req: Request, res: Response): Promise<void> => {
    const params: Signin = req.body;
    const response = await this.userService.Signin(params);

    return this.responseParser
      .setHttpCode(constant.HTTP_STATUS_CREATED)
      .setBody(response)
      .setMessage(i18n.__("user_created"))
      .send(res);
  };
  public forgotPassword = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const params: forgotPassword = req.body;
    const response = await this.userService.forgotPassword(params);
    // console.log(response);

    return this.responseParser
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };
  public setReminder = async (req: Request, res: Response): Promise<any> => {
    const {
      body: { date, description, type, priority },
    } = req;

    const userId = req.user.decodedToken;
    console.log(req.body.priority, "====================here================");

    const response = await this.userService.setReminder(
      date,
      description,
      userId,
      type,
      priority
    );

    return this.responseParser
      .setHttpCode(constant.HTTP_STATUS_CREATED)
      .setBody(response)
      .setMessage(i18n.__("user_created"))
      .send(res);
  };
  public updateReminder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const params: updateReminder = req.body;
    const response = await this.userService.updateReminder(params);
    // console.log(response);

    return this.responseParser
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };

  public deleteReminder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const id = String(req.query.id);
    const response = await this.userService.deleteReminder(id);
    // console.log(response);

    return this.responseParser
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };
  public getReminder = async (req: Request, res: Response): Promise<void> => {
    const user_id = req.query.user_id as string;
    const date = req.query.date as string;
    const status = JSON.parse(
      req.query.status ? req.query.status.toString() : null
    ) as number;

    console.log(typeof date, "====================typeof=============");

    const formatterDate = moment(date).format();
    const reminderRedo = getManager().getCustomRepository(ReminderRepo);
    const userrepo = getManager().getCustomRepository(UsersDetails);
    const userCheck = await userrepo.findOne(user_id);
    if (date) {
      // const datedReminder = await getRepository(Reminder)
      //   .createQueryBuilder("reminder")
      //   .where("reminder.id = : id", { id })
      //   .andWhere("reminder.date = : date", { date: formatterDate })
      //   .getMany();
      const datedReminder = await reminderRedo.find({
        where: {
          user: userCheck,
          date: formatterDate,
          status: ILike(status),
        },
      });
      if (datedReminder.length > 0) {
        console.log("=================IN ID");
        this.responseParser
          .setHttpCode(constant.HTTP_STATUS_CREATED)
          .setBody(datedReminder)
          .setMessage(i18n.__("Reminder Found"))
          .send(res);
      }
    }
    const Reminderrepo = await getRepository(Reminder).find({
      
        where:{
          user: userCheck,
          status: ILike(status)
        }
    });
    console.log("==============================checkitout==============",Reminderrepo);
    
    if (Reminderrepo.length >0) {
      console.log("=================IN adjbkcjbdkjcbskjcbsk");
      this.responseParser
        .setHttpCode(constant.HTTP_STATUS_CREATED)
        .setBody(Reminderrepo)
        .setMessage(i18n.__("Reminder Found"))
        .send(res);
    }
    else{
      this.responseParser
        .setHttpCode(constant.HTTP_STATUS_CREATED)
        .setBody(Reminderrepo)
        .setMessage(i18n.__("Reminder Not Found"))
        .send(res);
    }
  };
}

function priority(
  date: any,
  description: any,
  userId: unknown,
  type: any,
  priority: any
) {
  throw new Error("Function not implemented.");
}

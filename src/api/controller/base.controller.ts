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
  getReminder,
  Reminderin,
} from "@type/user";
import { getManager, getRepository, ILike } from "typeorm";
import { Reminder } from "@database/model/reminder.model";
import { ReminderRepo } from "@database/repository/reminder.repository";
import { reminder } from "@api/validator/signup.validator";
import { integer } from "aws-sdk/clients/cloudfront";
import { DateTime } from "aws-sdk/clients/devicefarm";
import moment from "moment";
import { UsersDetails } from "@database/repository/userdetails.repository";
import { string } from "@hapi/joi";
import { Query } from "express-serve-static-core";

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
  public setReminder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const params: Reminderin = req.body;
    const decoded: any = req.user.decodedToken;
    params.user_id = decoded.id;
    console.log(req.user.id,"====================userid");
    console.log(params,"6666666666666666666");
    
    const response = await this.userService.setReminder(params);

    // console.log(response);

    return this.responseParser
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };



//   public setReminder = async (req: Request, res: Response): Promise<any> => {
//     const {
//       body: { date, description, type, priority, time },
//     } = req;
// console.log("=============date===",date);

//     const userId = req.user.decodedToken;
//     console.log(req.body.priority, "====================here================");

//     const response = await this.userService.setReminder(
//       date,
//       description,
//       userId,
//       type,
//       priority,
//       time
//     );

//     return this.responseParser
//       .setHttpCode(constant.HTTP_STATUS_CREATED)
//       .setBody(response)
//       .setMessage(i18n.__("Reminder_Created"))
//       .send(res);
//   };
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

  public deleteCompletedReminder = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const status = String(req.query.status);
    const response = await this.userService.deleteCompletedReminder(status);
    // console.log(response);

    return this.responseParser
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };


  public getReminder = async (req: Request, res: Response): Promise<void> => {
    const decoded: any = req.user.decodedToken;
    
    console.log(decoded,"decoded token");
    
    const params: string = req.query.status as string ;
    const datedata: string = req.query.date as string ;
    const idinfo = decoded.id;

    // const date: string = req.query.date as string;
    // const status: string = req.query.status as string;
    console.log("interface data",params,datedata,"====",idinfo);
  
    const response = await this.userService.getReminder(params,datedata,idinfo);
    // console.log("hereeee=======",response);
    

    return this.responseParser
      .setHttpCode(constant.HTTP_STATUS_CREATED)
      .setBody(response)
      .setMessage(i18n.__("success"))
      .send(res);
  };

  // public getReminder = async (req: Request, res: Response): Promise<void> => {
  //   let response: any;
  //   const user_id = req.query.user_id as string;
  //   const date = req.query.date as string;
  //   const status = JSON.parse(
  //     req.query.status ? req.query.status.toString() : null
  //   ) as number;

  //   console.log(typeof date, "====================typeof=============");
  //   const formatterDate = moment(date).format();
  //   const reminderRedo = getManager().getCustomRepository(ReminderRepo);
  //   const userrepo = getManager().getCustomRepository(UsersDetails);
  //   const userCheck = await userrepo.findOne(user_id);
  //   if (date) {
  //     response = await reminderRedo.find({
  //       where: {
  //         user: userCheck,
  //         date: formatterDate,
  //         status: ILike(status),
  //       },
  //     });
  //     if (response.length > 0) {
  //       console.log("=================IN ID");
  //       //do nothing
  //     } else {
  //       response = await getRepository(Reminder).find({
  //         where:{
  //           user: userCheck,
  //           status: ILike(status),
  //         }
  //     });
  //     }
  //   } else {
  //     response = await getRepository(Reminder).find({
  //       where:{
  //         user: userCheck,
  //         status: ILike(status),
  //       }
  //   });
  //   }

  //   response = await response.map((i: { date: any; formattedDate: string; formattedTime: string; }) => {
  //     const dateTime = i.date;
  //     i['formattedDate'] = moment(dateTime).format('DD/MM/YYYY');
  //     i['formattedTime'] = moment(dateTime).format('hh:MM A');
  //     console.log(i);
  //     return i;
  //   });

  //   console.log("==============================checkitout==============",response);

  //   if (response.length > 0) {
  //     console.log("=================IN adjbkcjbdkjcbskjcbsk");
  //     this.responseParser
  //       .setHttpCode(constant.HTTP_STATUS_CREATED)
  //       .setBody(response)
  //       .setMessage(i18n.__("Reminder Found"))
  //       .send(res);
  //   }
  //   else{
  //     this.responseParser
  //       .setHttpCode(constant.HTTP_STATUS_CREATED)
  //       .setBody(response)
  //       .setMessage(i18n.__("Reminder Not Found"))
  //       .send(res);
  //   }
  // };
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

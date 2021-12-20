import { Request, Response } from "express";
import i18n from "i18n";
import { ResponseParser } from "@util/response-parser";
import constant from "@config/constant";
import { UserService } from "@service/user.service";
import {
  Signin,
  Signup,
  forgotPassword,
  reminder,
  updateReminder,
  remove,
} from "@type/user";

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
      body: { date, description },
    } = req;

    const userId = req.user.decodedToken;

    const response = await this.userService.setReminder(
      date,
      description,
      userId
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
}

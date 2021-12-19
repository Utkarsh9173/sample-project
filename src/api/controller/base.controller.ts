import { Request, Response } from "express";
import i18n from "i18n";
import { ResponseParser } from "@util/response-parser";
import constant from "@config/constant";
import { UserService } from "@service/user.service";
import { boolean } from "@hapi/joi";

export class BaseController {
  private responseParser: ResponseParser;
  private userService: UserService;

  constructor() {
    this.responseParser = new ResponseParser();
    this.userService = new UserService();
  }

  public defaultCheck = (req: Request, res: Response): void => {
    this.responseParser
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody({})
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @returns void
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    const {
      body: { email, password }
    } = req;
    const response = await this.userService.login(email, password);
    this.responseParser
      .setStatus(true)
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("login_successful"))
      .send(res);
  };

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @returns void
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    const {
      body: { email, password, firstName, lastName, dob, marketing }
    } = req;
    const response = await this.userService.register(email, password, firstName, lastName, dob, marketing);
    this.responseParser
      .setStatus(true)
      .setHttpCode(constant.HTTP_STATUS_CREATED)
      .setBody(response)
      .setMessage(i18n.__("signup_successful"))
      .send(res);
  };

  public verifyUserEmail = async(req: Request, res: Response): Promise<void> => {
    const { params: { uniqueKey } } = req;
        const response = await this.userService.verifyRegisteredUserEmail(
          uniqueKey.toString()
        );
        this.responseParser
          .setStatus(true)
          .setHttpCode(constant.HTTP_STATUS_OK)
          .setBody(response)
          .setMessage(i18n.__("email_verified"))
          .send(res);
      };

  // public resetPasswordInit = async (
  //   req: Request,
  //   res: Response
  // ): Promise<void> => {
  //   const {
  //     body: { email }
  //   } = req;
  //   const response = await this.userService.resetPasswordInit(email);
  //   this.responseParser
  //     .setStatus(true)
  //     .setHttpCode(constant.HTTP_STATUS_OK)
  //     .setBody(response)
  //     .setMessage(i18n.__("otp_sent_successfully"))
  //     .send(res);
  // };

  // public verifyResetPasswordOtp = async (
  //   req: Request,
  //   res: Response
  // ): Promise<void> => {
  //   const {
  //     query: { id: userId, otp }
  //   } = req;
  //   const response = await this.userService.verifyResetPasswordOtp(
  //     userId.toString(),
  //     otp.toString()
  //   );
  //   this.responseParser
  //     .setStatus(true)
  //     .setHttpCode(constant.HTTP_STATUS_OK)
  //     .setBody(response)
  //     .setMessage(i18n.__("otp_verified"))
  //     .send(res);
  // };

  // public updatePassword = async (
  //   req: Request,
  //   res: Response
  // ): Promise<void> => {
  //   const {
  //     body: { id, password }
  //   } = req;
  //   const response = await this.userService.updatePassword(id, password);
  //   this.responseParser
  //     .setStatus(true)
  //     .setHttpCode(constant.HTTP_STATUS_OK)
  //     .setBody(response)
  //     .setMessage(i18n.__("password_updated"))
  //     .send(res);
  // };

  // public completeUserAccount = async (
  //   req: Request,
  //   res: Response
  // ): Promise<void> => {
  //   const {
  //     user: { id: userId },
  //     body: accountData
  //   } = req;
  //   const response = await this.userService.completeUserAccount(
  //     userId as string,
  //     accountData
  //   );

  //   this.responseParser
  //     .setStatus(true)
  //     .setHttpCode(constant.HTTP_STATUS_OK)
  //     .setBody(response)
  //     .setMessage(i18n.__("user_updated"))
  //     .send(res);
  // };

  // public socialLogin = async (req: Request, res: Response): Promise<void> => {
  //   const { body: userDetails } = req;
  //   const response = await this.userService.addUserFromSocialPlatform(
  //     userDetails
  //   );
  //   this.responseParser
  //     .setStatus(true)
  //     .setHttpCode(constant.HTTP_STATUS_OK)
  //     .setBody(response)
  //     .setMessage(i18n.__("login_successful"))
  //     .send(res);
  // };

  // public getCountryCodes = (req: Request, res: Response): void => {
  //   this.responseParser
  //     .setStatus(true)
  //     .setHttpCode(constant.HTTP_STATUS_OK)
  //     .setBody(countryCodes)
  //     .setMessage(i18n.__("login_successful"))
  //     .send(res);
  // };
}

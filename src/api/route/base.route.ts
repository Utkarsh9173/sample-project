import express from "express";
import { BaseController } from "@api/controller/base.controller";
import { HttpRequestValidator } from "@middleware/http-request-validator";
import {
  accountSetup,
  login,
  register,
  resetPassword,
  socialLogin,
  updatePassword,
  verifyOtp
} from "@api/validator/base.validator";
import { AuthenticateRequest } from "@middleware/authenticate-request";

class BaseRoute {
  public router: express.Router = express.Router();
  private baseController: BaseController;
  private httpRequestValidator: HttpRequestValidator;
  private authenticate;

  constructor() {
    this.baseController = new BaseController();
    this.httpRequestValidator = new HttpRequestValidator();
    const authMiddleware = new AuthenticateRequest();
    this.authenticate = authMiddleware.validate;
    this.assign();
  }

  private assign() {

    this.router.post(
      "/register",
      this.httpRequestValidator.validate("body", register),
      this.baseController.register
    );

    this.router.get(
        "/user-email-verification/:uniqueKey",
        // this.httpRequestValidator.validate("query", verifyOtp),
        this.baseController.verifyUserEmail
      );

    this.router.post(
      "/login",
      this.authenticate,
      this.httpRequestValidator.validate("body", login),
      this.baseController.login
    );

    // this.router.post(
    //   "/reset-password",
    //   this.httpRequestValidator.validate("body", resetPassword),
    //   this.baseController.resetPasswordInit
    // );

    // this.router.get(
    //   "/otp-verifier",
    //   this.httpRequestValidator.validate("query", verifyOtp),
    //   this.baseController.verifyResetPasswordOtp
    // );

    // this.router.post(
    //   "/update-password",
    //   this.httpRequestValidator.validate("body", updatePassword),
    //   this.baseController.updatePassword
    // );

    // this.router.post(
    //   "/account-setup",
    //   this.authenticate,
    //   this.httpRequestValidator.validate("body", accountSetup),
    //   this.baseController.completeUserAccount
    // );

    // this.router.post(
    //   "/social-login",
    //   this.httpRequestValidator.validate("body", socialLogin),
    //   this.baseController.socialLogin
    // );

    // this.router.get("/country-codes", this.baseController.getCountryCodes);
    this.router.get("/", this.baseController.defaultCheck);
  }
}

export default new BaseRoute().router;

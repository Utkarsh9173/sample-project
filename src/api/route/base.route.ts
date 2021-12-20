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
  verifyOtp,
} from "@api/validator/base.validator";
import { AuthenticateRequest } from "@middleware/authenticate-request";
import { signupValidator } from "@api/validator/signup.validator";

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
      "/signup",
      this.httpRequestValidator.validate("body", signupValidator),
      this.baseController.Signup
    );
  }
}

export default new BaseRoute().router;

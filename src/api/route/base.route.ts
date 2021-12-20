import express from "express";
import { BaseController } from "@api/controller/base.controller";
import { HttpRequestValidator } from "@middleware/http-request-validator";
import { AuthenticateRequest } from "@middleware/authenticate-request";
import {
  signupValidator,
  signinValidator,
  reminder,
  updateReminder,
} from "@api/validator/signup.validator";

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
    this.router.post(
      "/signin",
      this.httpRequestValidator.validate("body", signinValidator),
      this.baseController.Signin
    );
    this.router.post("/forgotPassword", this.baseController.forgotPassword);
    this.router.post(
      "/reminder",
      this.authenticate,
      this.httpRequestValidator.validate("body",reminder),
      this.baseController.setReminder
    );
    this.router.put(
      "/updatereminder",
      this.authenticate,
      this.httpRequestValidator.validate("body",updateReminder),
      this.baseController.updateReminder
    );
  }
}

export default new BaseRoute().router;

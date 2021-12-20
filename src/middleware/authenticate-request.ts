// Copyright (C) 2019 by StudioGraphene. All rights reserved.

import { Request, Response, NextFunction } from "express";
import i18n from "i18n";
import * as jwt from "jsonwebtoken";
import createError from "http-errors";

import { ResponseParser } from "@util/response-parser";
import constant from "@config/constant";
import logger from "@core/logger";
import { JWT_SECRET } from "@config/secret";

declare module "express" {
  export interface Request {
    user: Record<string, unknown>;
  }
}

export class AuthenticateRequest {
  /**
   * Global middleware to check request is autneticated of not
   * @param req
   * @param res
   * @param next
   */
  public async validate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const token = req.header("x-auth-token");

    if (!token) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(constant.HTTP_STATUS_UNAUTHORIZED)
        .setStatus(false)
        .setResponseCode("unauthorized")
        .setMessage(i18n.__("unauthorized"))
        .setBody({})
        .send(res);
      return;
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    logger.debug(decodedToken);
    if (!decodedToken) {
      throw new createError.Unauthorized(i18n.__("invalidToken"));
    }
    req.user = JSON.parse(decodedToken.toString());

    next();
  }
}

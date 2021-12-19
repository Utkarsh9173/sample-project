// Copyright (C) 2019 by StudioGraphene. All rights reserved.

import { Request, Response, NextFunction } from "express";
import { ResponseParser } from "@util/response-parser";
import Joi from "@hapi/joi";

export class HttpRequestValidator {
  private responseParser: ResponseParser;

  constructor() {
    this.responseParser = new ResponseParser();
  }

  /**
   * Private method to validate data againt Joi schema
   *
   * @param data
   * @param schema
   */
  public validate(
    type: "body" | "params" | "query",
    schema: Joi.ObjectSchema<unknown>
  ) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const data = req[type];
      const { error } = schema.validate(data);
      console.log(error);
      if (error === undefined) {
        next();
        return;
      }
      this.handleValidationError(error);
      this.responseParser.send(res);
    };
  }

  private async handleValidationError(
    error: Joi.ValidationError
  ): Promise<void> {
    const err: Record<string, unknown>[] = [];
    error.details.forEach((element: Joi.ValidationErrorItem) => {
      err.push({
        message: element.message,
        label: element.context.key,
      });
    });
    this.responseParser
      .setHttpCode(400)
      .setStatus(false)
      .setResponseCode("validation_error")
      .setMessage("Validation Error")
      .setBody(err);
  }
}

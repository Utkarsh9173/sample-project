import { Request, Response } from "express";
import i18n from "i18n";
import { ResponseParser } from "@util/response-parser";
import constant from "@config/constant";
import { CmsService } from "@service/cms.service";

export class CmsController {
  private responseParser: ResponseParser;
  private cmsService: CmsService;

  constructor() {
    this.responseParser = new ResponseParser();
    this.cmsService = new CmsService();
  }

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @returns void
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    const {
      body: { email, password },
    } = req;
    const response = await this.cmsService.login(email, password);
    this.responseParser
      .setStatus(true)
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };

  /**
   * @param  {Request} req
   * @param  {Response} res
   * @returns void
   */
  public create = async (req: Request, res: Response): Promise<void> => {
    const {
      body: { email, password },
    } = req;
    const response = await this.cmsService.create(email, password);
    this.responseParser
      .setStatus(true)
      .setHttpCode(constant.HTTP_STATUS_OK)
      .setBody(response)
      .setMessage(i18n.__("SUCCESS"))
      .send(res);
  };

}

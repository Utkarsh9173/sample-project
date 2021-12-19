import { getManager } from "typeorm";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import createError from "http-errors";
import { Mailer } from "@util/mailer";
import { CmsUserRepo } from "@database/repository/cms-user.repository";
import { UserRepo } from "@database/repository/user.repository";
import { CmsUser } from "@database/model/cms-user.model";
import constant from "@config/constant";
import { LoggedInUser } from "@type/user";
import { JWT_SECRET } from "@config/secret";
import { TIMEZONE } from "@config/secret";
import i18n from "i18n";
import moment from "moment-timezone";
import asyncForEach from "@util/asyncForEach";

export class CmsService {
  constructor() {
    moment.tz.setDefault(TIMEZONE);
  }
  public async login(email: string, password: string): Promise<LoggedInUser> {
    const cmsUserRepo = getManager().getCustomRepository(CmsUserRepo);
    const user = await cmsUserRepo.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new createError.Unauthorized(i18n.__("incorrect_password"));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, password: user.password },
      JWT_SECRET
    );
    return { id: user.id, email: user.email, token };
  }

  /**
   * @param  {string} email user's email
   * @param  {string} password password
   * @returns Promise<CmsUser>
   */
  public async create(email: string, password: string): Promise<CmsUser> {
    const cmsUserRepo = getManager().getCustomRepository(CmsUserRepo);
    const salt = await bcrypt.genSalt(constant.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return cmsUserRepo.save({ email, password: hashedPassword });
  }


}

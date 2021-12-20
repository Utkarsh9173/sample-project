import { getManager } from "typeorm";
import bcrypt from "bcrypt";
import createError from "http-errors";
import i18n from "i18n";
import constant from "@config/constant";
import { v4 } from "uuid";
import { Signin, Signup, forgotPassword, reminder } from "@type/user";
import { UsersDetails } from "@database/repository/UserDetails.repository";
import { ReminderRepo } from "@database/repository/reminder.repository";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@config/secret";
import { resetPassword } from "@api/validator/base.validator";

export class UserService {
  constructor() {}

  /**
   * generates a hashed string from the given string
   * @param  {string} password
   * @returns Promise for a hashed string
   */
  private async getEncryptedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(constant.SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
  }
  private async getDcryptedPassword(
    password: string,
    active: string
  ): Promise<boolean> {
    return bcrypt.compare(password, active);
  }
  public async Signup(user: Signup): Promise<any> {
    const userRepository = getManager().getCustomRepository(UsersDetails);

    user.password = await this.getEncryptedPassword(user.password);

    user.role = "Admin";
    user.id = v4();

    const activeUser = await userRepository.findUserByEmailId(user.email);
    if (activeUser) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }

    return userRepository.save(user);
  }

  public async Signin(user: Signin): Promise<any> {
    const userRepository = getManager().getCustomRepository(UsersDetails);

    const activeUser = await userRepository.findUserByEmailId(user.email);
    console.log(activeUser.password);

    if (!activeUser) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }
    const passwordCheck = await this.getDcryptedPassword(
      user.password,
      activeUser.password
    );
    if (!passwordCheck) {
      throw new createError.NotFound(i18n.__("invalid_credentials"));
    }

    return {
      userDetails: activeUser,
      token: jwt.sign({ ...activeUser }, JWT_SECRET, {
        //expiresIn: "1d",
      }),
    };
  }
  public async forgotPassword(user: forgotPassword): Promise<any> {
    const userRepository = getManager().getCustomRepository(UsersDetails);

    const activeUser = await userRepository.findUserByEmailId(user.email);
    console.log(activeUser.email);
    if (!activeUser) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    } else {
      activeUser.password = await this.getEncryptedPassword(user.password);
      console.log("here", activeUser);
    }
    console.log(activeUser);

    return userRepository.save(activeUser);
  }
  public async setReminder(
    date: Date,
    description: string,
    userId: any
  ): Promise<any> {
    const userRepo = getManager().getCustomRepository(UsersDetails);
    const reminderRepo = getManager().getCustomRepository(ReminderRepo);

    const user = await userRepo.findOne(userId.id);
    if (!user) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }

    const activerem = await reminderRepo.findreminder(date);
    if (activerem) {
      throw new createError.NotFound(
        i18n.__("reminder already exist at this time")
      );
    }

    const id = v4();
    return reminderRepo.save({
      description,
      date,
      user,
      id,
    });
  }
}

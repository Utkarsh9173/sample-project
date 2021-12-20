import { getManager } from "typeorm";
import bcrypt from "bcrypt";
import createError from "http-errors";
import i18n from "i18n";
import constant from "@config/constant";
import { v4 } from "uuid";
import { Signup } from "@type/user";
import { UsersDetails } from "@database/repository/UserDetails.repository";

export class UserService {
  constructor() {}

  /**
   * generates a hashed string from the given string
   * @param  {string} password
   * @returns Promise for a hashed string
   */
  private async getEncryptedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(constant.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
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
}

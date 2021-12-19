import { getManager } from "typeorm";
import bcrypt from "bcrypt";
import createError from "http-errors";
import i18n from "i18n";
import * as jwt from "jsonwebtoken";
import moment from "moment-timezone";

import { Mailer } from "@util/mailer";
import { UserRepo } from "@database/repository/user.repository";
import { ResetPasswordOtpRepo } from "@database/repository/reset-password-otp.repository";
import { JWT_SECRET, TIMEZONE } from "@config/secret";
import constant from "@config/constant";
import { RandomKeyGenerator } from "@util/random-key-generator";
import { CommonFunctions } from "@util/commonFunctions";
import {
  AccountSetupData,
  BasicUserDetailResponse,
  LoggedInUser,
  LoggedInUserSocial,
  SocialLoginUser,
  UserProfile,
  RegisterUser,
  UserEmailVerification
} from "@type/user";
import logger from "@core/logger";
import { User } from "@database/model/user.model";
import { SocialPlatforms } from "@database/enum/user";

export class UserService {

  constructor() {
  }
  /**
   * @param  {string} email user's email
   * @param  {string} password password
   * @returns Promise<User>
   */
  public async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    dob: string,
    marketing: string
  ): Promise<RegisterUser> {
    const userRepo = getManager().getCustomRepository(UserRepo);
    const userExists = await userRepo.findOne({ email: email.toLowerCase() });
    if (userExists) {
      throw new createError.BadRequest(i18n.__("user_already_exists"));
    }

    const isVerified: boolean = false;
    const keyGen = new RandomKeyGenerator();
    const userUniqueKey = keyGen.generate(10);

    const hashedPassword = await this.getEncryptedPassword(password);
    const user = await userRepo.save({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName.toLocaleLowerCase(),
      lastName: lastName.toLocaleLowerCase(),
      dob,
      marketing,
      userUniqueKey,
      isVerified
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

    const verificationLink = `http://localhost:3001/user-email-verification/${userUniqueKey}`;

    const common = new CommonFunctions();
    const mailer = new Mailer();
      mailer.sendMail({
        to: email,
        subject: "Verify Email - Turf War",
        templateName: "registration",
        data: { userName: `${common.toTitleCase(user.firstName)} ${common.toTitleCase(user.lastName)}`, verificationLink }
      });

    return { id: user.id, email: user.email, token };
  }


  //verify registered email
  public async verifyRegisteredUserEmail(uniqueKey: string): Promise<UserEmailVerification>{
    const userRepo = getManager().getCustomRepository(UserRepo);
    const user = await userRepo.findOne({ userUniqueKey: uniqueKey });
    if (!user) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }
    await userRepo.update({ id: user.id, userUniqueKey: uniqueKey  }, { isVerified: true, updatedAt: new Date() });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return { id: user.id, email: user.email, token, message: 'Email Verified' };
  }



  /**
   * @param  {string} email
   * @param  {string} password
   * @returns Promise
   */
  public async login(email: string, password: string): Promise<LoggedInUser> {
    const userRepo = getManager().getCustomRepository(UserRepo);
    const user = await userRepo.findOne({ email: email.toLowerCase(), isVerified: true });
    if (!user) {
      throw new createError.NotFound(i18n.__("user_not_found"));
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new createError.BadRequest(i18n.__("incorrect_password"));
    }
    logger.info(user);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return {
      id: user.id,
      email: user.email,
      // stripeCustomerId: user.stripeCustomerId,
      // isAccountSetup: user.isAccountSetup,
      token
    };
  }

  

  //code to send mail
  // public async resetPasswordInit(
  //   email: string
  // ): Promise<BasicUserDetailResponse> {
  //   const userRepo = getManager().getCustomRepository(UserRepo);
  //   const user = await userRepo.findOne({ email: email.toLowerCase() });
  //   if (!user) {
  //     throw new createError.NotFound(i18n.__("user_not_found"));
  //   }
  //   const resetPasswordOtpRepo = getManager().getCustomRepository(
  //     ResetPasswordOtpRepo
  //   );
  //   await resetPasswordOtpRepo.update(
  //     {
  //       email: email.toLowerCase(),
  //       userId: user.id
  //     },
  //     { deletedAt: new Date() }
  //   );
  //   const otpGenerator = new RandomKeyGenerator();
  //   const otp = otpGenerator.generate(6, "1234567890");

  //   const mailer = new Mailer();
  //   mailer.sendMail({
  //     to: email,
  //     subject: "Reset Password - Press Wash n Go",
  //     templateName: "reset-password",
  //     data: { firstName: user.firstName, otp }
  //   });

  //   await resetPasswordOtpRepo.save({ otp, email, userId: user.id });
  //   return { email, id: user.id };
  // }

  // public async verifyResetPasswordOtp(
  //   userId: string,
  //   otp: string
  // ): Promise<{ id: string }> {
  //   const resetPasswordOtpRepo = getManager().getCustomRepository(
  //     ResetPasswordOtpRepo
  //   );
  //   const otpExists = await resetPasswordOtpRepo.verifyOtp(userId, otp);
  //   if (!otpExists) {
  //     throw new createError.NotAcceptable(i18n.__("incorrect_otp"));
  //   }
  //   return { id: otpExists.id };
  // }

  // public async updatePassword(
  //   otpId: string,
  //   password: string
  // ): Promise<BasicUserDetailResponse> {
  //   const resetPasswordOtpRepo = getManager().getCustomRepository(
  //     ResetPasswordOtpRepo
  //   );
  //   const otpExists = await resetPasswordOtpRepo.getValidOtpDetail(otpId);
  //   if (!otpExists) {
  //     throw new createError.BadRequest(i18n.__("invalid_id"));
  //   }

  //   const processStartedBefore = moment().diff(otpExists.createdAt, "minutes");
  //   logger.info(processStartedBefore);
  //   const otpExpired = otpExists.usedAt || processStartedBefore > 30;
  //   if (otpExpired) {
  //     throw new createError.BadRequest(i18n.__("otp_expired"));
  //   }

  //   const user = await getManager().transaction(async transactionManager => {
  //     const userRepo = transactionManager.getCustomRepository(UserRepo);
  //     const hashedPassword = await this.getEncryptedPassword(password);
  //     await userRepo.update(
  //       { id: otpExists.userId },
  //       { password: hashedPassword }
  //     );
  //     await transactionManager
  //       .getCustomRepository(ResetPasswordOtpRepo)
  //       .update({ id: otpId }, { usedAt: new Date() });
  //     return userRepo.findOne({ id: otpExists.userId });
  //   });
  //   return { id: user.id, email: user.email };
  // }

  // public async completeUserAccount(
  //   userId: string,
  //   accountData: AccountSetupData
  // ): Promise<UserProfile> {
  //   const userRepo = getManager().getCustomRepository(UserRepo);
  //   const user = await userRepo.findOne({ id: userId });
  //   if (!user) {
  //     throw new createError.NotFound(i18n.__("user_not_found"));
  //   }
  //   const userupdate = await userRepo.update(
  //     { id: userId },
  //     { ...accountData.profile }
  //   );

  //   if (userupdate && user.isAccountSetup == false) {
  //     const updatedDetail = await userRepo.findOne({ id: userId });
  //     const userName =
  //       updatedDetail.lastName != null
  //         ? updatedDetail.firstName + " " + updatedDetail.lastName
  //         : updatedDetail.firstName;

  //     const mailer = new Mailer();
  //     mailer.sendMail({
  //       to: user.email,
  //       subject: "Registration Successful - Press Wash n Go",
  //       templateName: "registration",
  //       data: {
  //         email: user.email,
  //         userName: userName
  //       }
  //     });

  //     return {
  //       id: updatedDetail.id,
  //       email: updatedDetail.email,
  //       firstName: updatedDetail.firstName,
  //       lastName: updatedDetail.lastName,
  //       phoneCode: updatedDetail.phoneCode,
  //       contact: updatedDetail.contact,
  //       isAccountSetup: updatedDetail.isAccountSetup,
  //       isMemberSociety: updatedDetail.isMemberSociety,
  //       keyfobSerialId: updatedDetail.keyfobSerialId
  //     };
  //   }
  // }

  /**
   * handles all the cases for login attempts from google or apple
   * @param  {SocialLoginUser} userDetails
   * @returns Promise
   */
  // public async addUserFromSocialPlatform(
  //   userDetails: SocialLoginUser
  // ): Promise<LoggedInUserSocial> {
  //   const userRepo = getManager().getCustomRepository(UserRepo);
  //   // logging in with Apple second time, we don't receive email from apple
  //   const condition =
  //     userDetails.socialPlatform === SocialPlatforms.Apple
  //       ? {
  //           socialPlatformId: userDetails.socialPlatformId
  //         }
  //       : {
  //           email: userDetails.email.toLowerCase()
  //         };
  //   let user = await userRepo.findOne(condition);
  //   let isNewUser = false;
  //   if (!user) {
  //     if (
  //       !userDetails.email &&
  //       userDetails.socialPlatform === SocialPlatforms.Apple
  //     ) {
  //       throw new createError.BadRequest(
  //         i18n.__("user_previously_registered_apple")
  //       );
  //     }
  //     // user has logged in with social platform for first time and does not exist
  //     const stripeHelper = new StripeHelper();
  //     const stripeCustomerId = await stripeHelper.createCustomer(
  //       userDetails.email.toLowerCase()
  //     );
  //     user = await userRepo.save({
  //       ...userDetails,
  //       stripeCustomerId,
  //       email: userDetails.email.toLowerCase()
  //     });

  //     // const mailer = new Mailer();
  //     // mailer.sendMail({
  //     //   to: user.email,
  //     //   subject: "Registration Successful - Press Wash n Go",
  //     //   templateName: "registration",
  //     //   data: { email: user.email }
  //     // });
  //     isNewUser = true;
  //   }
  //   // flow for ==> previously logged in or registration using email
  //   if (user) {
  //     // registered using email
  //     if (!user.socialPlatform) {
  //       throw new createError.NotFound(i18n.__("user_already_exists"));
  //     }
  //     // previosly logged in using some other social platform
  //     if (user.socialPlatform !== userDetails.socialPlatform) {
  //       throw new createError.BadRequest(
  //         i18n.__("user_previously_logged_in_from", user.socialPlatform)
  //       );
  //     }
  //     // previously logged in using same social platform taken care outside this block
  //   }

  //   const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

  //   return {
  //     id: user.id,
  //     email: user.email,
  //     stripeCustomerId: user.stripeCustomerId,
  //     isNewUser: isNewUser,
  //     isAccountSetup: user.isAccountSetup,
  //     token
  //   };
  // }

  /**
   *
   * @param  {string} id user id
   * @returns Promise returning user's basic data
   */
  // public async getUser(id: string): Promise<UserProfile> {
  //   const userRepo = getManager().getCustomRepository(UserRepo);
  //   const user = await userRepo.findOne({
  //     id
  //   });
  //   if (!user) {
  //     throw new createError.NotFound(i18n.__("user_not_found"));
  //   }
  //   const serialId = user.keyfobSerialId == null ? "" : user.keyfobSerialId;

  //   return {
  //     id: user.id,
  //     email: user.email,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     phoneCode: user.phoneCode,
  //     contact: user.contact,
  //     isAccountSetup: user.isAccountSetup,
  //     isMemberSociety: user.isMemberSociety,
  //     keyfobSerialId: serialId
  //   };
  // }

  // public async updateUser(
  //   id: string,
  //   userObj: Partial<User>
  // ): Promise<UserProfile> {
  //   const userRepo = getManager().getCustomRepository(UserRepo);
  //   const user = await userRepo.findOne({
  //     id
  //   });
  //   if (!user) {
  //     throw new createError.NotFound(i18n.__("user_not_found"));
  //   }
  //   if (!userObj.isMemberSociety && user.keyfobSerialId) {
  //     userObj.keyfobSerialId = "";
  //   }
  //   await userRepo.update({ id }, userObj);
  //   const updatedUser = await userRepo.findOne({
  //     id
  //   });
  //   return {
  //     id: updatedUser.id,
  //     email: updatedUser.email,
  //     firstName: updatedUser.firstName,
  //     lastName: updatedUser.lastName,
  //     phoneCode: updatedUser.phoneCode,
  //     contact: updatedUser.contact,
  //     isAccountSetup: updatedUser.isAccountSetup,
  //     isMemberSociety: updatedUser.isMemberSociety,
  //     keyfobSerialId: updatedUser.keyfobSerialId
  //   };
  // }

  // public async updateUserPassword(
  //   id: string,
  //   oldPassword: string,
  //   newPassword: string
  // ): Promise<void> {
  //   const userRepo = getManager().getCustomRepository(UserRepo);
  //   const user = await userRepo.findOne({
  //     id
  //   });
  //   if (!user) {
  //     throw new createError.NotFound(i18n.__("user_not_found"));
  //   }
  //   if (!user.password) {
  //     throw new createError.NotFound(i18n.__("user_password_not_present"));
  //   }
  //   const validPassword = await bcrypt.compare(oldPassword, user.password);
  //   if (!validPassword) {
  //     throw new createError.BadRequest(i18n.__("incorrect_old_password"));
  //   }
  //   const password = await this.getEncryptedPassword(newPassword);
  //   await userRepo.update({ id }, { password });
  //   return;
  // }

  /**
   * generates a hashed string from the given string
   * @param  {string} password
   * @returns Promise for a hashed string
   */
  private async getEncryptedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(constant.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  // public async deleteUserAccount(userId: string): Promise<void> {
  //   const repo = getManager().getCustomRepository(UserRepo);
  //   const userAccount = await repo.findOne({ id: userId });
  //   if (!userAccount) {
  //     throw new createError.NotFound(i18n.__("user_not_found"));
  //   }
  //   await repo.update(
  //     { id: userId },
  //     {
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       phoneCode: "",
  //       password: "",
  //       socialPlatformId: "",
  //       identityToken: "",
  //       socialPlatform: null,
  //       keyfobSerialId: null
  //     }
  //   );

  //   const carrepo = getManager().getCustomRepository(UserCarRepo);
  //   const userCardetails = await carrepo.find({ userId: userId });
  //   userCardetails.forEach(async car => {
  //     if (car.id) {
  //       await this.carService.deleteCar(car.id, userId);
  //     }
  //   });

  //   return;
  // }
}

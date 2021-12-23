import { SocialPlatforms } from "@database/enum/user";
import { UserDetails } from "@database/model/userdetails.model";
import { integer } from "aws-sdk/clients/cloudfront";
import { DateTime } from "aws-sdk/clients/devicefarm";

export interface BasicUserDetailResponse {
  email: string;
  id: string;
}

export interface LoggedInUser extends BasicUserDetailResponse {
  token: string;
  stripeCustomerId?: string;
  isAccountSetup?: boolean;
}

export interface LoggedInUserSocial extends BasicUserDetailResponse {
  token: string;
  stripeCustomerId?: string;
  isNewUser: boolean;
  isAccountSetup?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneCode: string;
  contact: number;
  isAccountSetup: boolean;
  isMemberSociety: boolean;
  keyfobSerialId: string;
}

export interface SocialLoginUser {
  email: string;
  socialPlatform: SocialPlatforms;
  socialPlatformId: string;
  identityToken?: string;
}

export interface AccountSetupData {
  profile: UserProfile;
  paymentCard: Array<unknown> | null;
}

export interface RegisterUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  token: string;
  marketing?: boolean;
  isVerified?: boolean;
}

export interface UserEmailVerification extends RegisterUser {
  message: string;
}

export interface Signup {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface Signin {
  email: string;
  password: string;
}
export interface forgotPassword extends Signin {}
export interface Reminderin {
  id: string;
  date: Date;
  user_id: string;
  description: string;
  priority: string;
  type:string;
  time: DateTime;
}

export interface updateReminder extends Reminderin{
  status: integer;
  
}

export interface remove {
  id: string;
}
export interface findReminder{
  user_id: string;
}

export interface getReminder{
  user_id: string;
  date:Date;
  time:Date;
  status: number;


  

}
import { EntityRepository, Repository } from "typeorm";
import { ResetPasswordOtp } from "@database/model/reset-password-otp.model";

@EntityRepository(ResetPasswordOtp)
export class ResetPasswordOtpRepo extends Repository<ResetPasswordOtp> {
  public verifyOtp(userId: string, otp: string): Promise<ResetPasswordOtp> {
    return this.findOne({ userId, otp, deletedAt: null });
  }

  public getValidOtpDetail(id: string): Promise<ResetPasswordOtp> {
    return this.findOne({ id, deletedAt: null });
  }
}

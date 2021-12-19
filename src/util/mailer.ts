import nodemailer, { SentMessageInfo } from "nodemailer";
import expressHandlebars from "express-handlebars";
import path from "path";
import aws from "aws-sdk";
import logger from "@core/logger";
import {
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  AWS_SES_API_VERSION,
  FROM_EMAIL,
  EMAIL_APP_PASSWORD
} from "@config/secret";

aws.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

export class Mailer {
  // private transporter = nodemailer.createTransport({
  //   SES: new aws.SES({
  //     apiVersion: AWS_SES_API_VERSION,
  //   }),
  // });
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: FROM_EMAIL,//"aman@studiographene.com",
      pass: EMAIL_APP_PASSWORD,//"zuhquvnloowxfudo",
    }
  });
  private hbs;

  constructor() {
    this.hbs = expressHandlebars.create({
      extname: ".handlebars",
      partialsDir: [`${__dirname}/../../mail-template/`],
    });
  }

  public sendMail = async ({
    to,
    subject,
    templateName,
    data,
  }: {
    to: string;
    subject: string;
    templateName: string;
    data: Record<string, unknown>;
  }): Promise<SentMessageInfo> => {
    try {
      const templatePath = path.resolve(
        __dirname,
        "../../mail-template",
        `${templateName}.handlebars`
      );
      const html = await this.hbs.render(templatePath, data);

      const mailOptions = {
        to,
        subject,
        html,
        from: FROM_EMAIL,
      };
      await new Promise((resolve, reject) => {
        // this.transporter.sendMail(
        //   mailOptions,
        //   (err: Error, info: SentMessageInfo) => {
        //     if (err) {
        //       return reject(err);
        //     }
        //     logger.info(
        //       `Mail sent to ${mailOptions.to} using template ${templateName}`
        //     );
        //     logger.info(JSON.stringify(info));
        //     return resolve(info);
        //   }
        // );
        this.transporter.sendMail(mailOptions,
            (err: Error, info: SentMessageInfo) => {
              if (err) {
                return reject(err);
              }
              logger.info(
                `Mail sent to ${mailOptions.to} using template ${templateName}`
              );
              logger.info(JSON.stringify(info));
              return resolve(info);
          });
      });
    } catch (err) {
      logger.error(err);
    }
  };
}



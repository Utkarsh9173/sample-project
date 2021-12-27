import {
  EntityRepository,
  getConnection,
  getRepository,
  Repository,
} from "typeorm";

import { Reminder } from "@database/model/reminder.model";
import moment from "moment";

@EntityRepository(Reminder)
export class ReminderRepo extends Repository<Reminder> {
  public async findreminder(date: Date): Promise<Reminder> {
    console.log(date,"coming data=============");
    
    const user = await getRepository(Reminder).findOne({
      date
    });
    return user;
  }
  
  public async updatereminder(date: Date): Promise<Reminder> {
    console.log(date,"coming data=============");
    
    const user = await getRepository(Reminder).save({
      date
    });
    return user;
  }
}




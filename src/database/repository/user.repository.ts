import { EntityRepository, Repository } from "typeorm";
import { User } from "@database/model/user.model";

@EntityRepository(User)
export class UserRepo extends Repository<User> {}

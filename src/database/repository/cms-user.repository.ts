import { EntityRepository, Repository } from "typeorm";
import { CmsUser } from "@database/model/cms-user.model";

@EntityRepository(CmsUser)
export class CmsUserRepo extends Repository<CmsUser> {}

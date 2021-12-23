import {
    EntityRepository,
    getConnection,
    getRepository,
    Repository
  } from 'typeorm';
  import { UserDetails } from '@database/model/userdetails.model';

  @EntityRepository(UserDetails)
export class UsersDetails extends Repository<UserDetails> {
    public async findUserByEmailId(email: string): Promise<UserDetails> {
        const user = await getRepository(UserDetails).findOne({
          email: email.toLowerCase()
        });
        return user;
      }
    

}
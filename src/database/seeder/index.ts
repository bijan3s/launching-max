import User from "src/app/models/user/User";
import { UserSeeder } from "./userSeeder";

export const MongoSeeder: { model: any; seeder?: any }[] = [
  {
    model: User,
    seeder: UserSeeder,
  },
];

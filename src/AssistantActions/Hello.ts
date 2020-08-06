import { User } from "../entity/User";

export default async (user: User, response: string) => {
  return response.replace("$username", String(user.username));
};
import { User } from "../entity/User";

export default async (user: User, response: string) => {
  return {
    response: response.replace("$count", String(user.followersCount))
  }
};
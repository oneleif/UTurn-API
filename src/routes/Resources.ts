import { Router } from "express";
import { auth } from "../helpers/Authentication";
import { getRepository, createQueryBuilder, getConnection, Like } from "typeorm";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";

export const resources = Router();

resources.post("/user", auth, async (req, res) => {
  const response: any = { success : true, id: req.user.id, email: req.user.email, username: req.user.username }

  return res.status(200).json(response);
}); 

resources.get("/followers/:user_id/:start", async (req, res) => {
  const userRepo = getRepository(User);

  const user = await userRepo.findOne(parseInt(req.params.user_id));

  if (!user) return res.status(400).json({ success : false, error: "Invalid User ID" });

  if (user.private) {
    if (!req.headers["authorization"]) return res.status(400).json({ success : false, error: "Missing Authorization Header" });
  
    const authHeader = req.headers["authorization"];
    const authMethod = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];

    if (!authMethod || !token) return res.status(400).json({ success : false, error: "Invalid Authorization Header" });
    if (authMethod !== "Bearer") return res.status(400).json({ success : false, error: "Invalid Auth Method" });
    
    let tokenBody;

    try {
      tokenBody = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ success : false, error: "Invalid Token", invalidate: true });
    }

    if (!tokenBody.user_id) return res.status(400).json({ success : false, error: "Invalid Token" });

    const authUser = await getRepository(User).findOne({ where: { id: tokenBody.user_id }});

    if (!authUser.sessionKey || tokenBody.sessionKey !== authUser.sessionKey) return res.status(400).json({ success : false, error: "Session Key does not match", invalidate: true });
  
    const isFollowing = await userRepo.createQueryBuilder("user")
      .leftJoinAndSelect("user.following", "targetUser")
      .where("user.id = :userId", { userId: parseInt(req.params.user_id) })
      .andWhere("targetUser.id = :targetId", { targetId: authUser.id })
      .getCount()

    if (!Boolean(isFollowing)) return res.status(400).json({ success : false, error: "Target User is private and Authenticated User is not following Target User" });
  }

  let followers;
  
  if (req.query.search) {
    followers = (await getRepository(User)
      .createQueryBuilder("user")
      .offset(parseInt(req.params.start))
      .limit(25)
      .leftJoin("user.followers", "follower", "follower.username like :username", { username: '%' + req.query.search + '%'  })
      .addSelect(["follower.username", "follower.id"])
      .where("user.id = :id", { id: parseInt(req.params.user_id) })
      .getOne()).followers
  } else {
    followers = (await getRepository(User)
      .createQueryBuilder("user")
      .offset(parseInt(req.params.start))
      .limit(25)
      .leftJoin("user.followers", "follower")
      .addSelect(["follower.username", "follower.id"])
      .where("user.id = :id", { id: parseInt(req.params.user_id) })
      .getOne()).followers
  }
  
  return res.status(200).json({ success : true, followers, count: user.followersCount });
});

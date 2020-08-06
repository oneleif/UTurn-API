import { Router } from "express";
import { getRepository, getConnection } from "typeorm";

import { User } from "../entity/User";
import { auth } from "../helpers/Authentication";

export const me = Router();

me.post("/follow/:user_id", auth, async (req, res) => {
  const userRepo = getRepository(User);
  
  const user = await userRepo.findOne({ where: { id: parseInt(req.params.user_id) }, relations: [ "followers" ] });

  if (!user) return res.status(400).json({ success : false, error: "Invalid User ID" });

  user.followers.push(req.user);

  userRepo.save(user);

  return res.status(200).json({ success : true });
});

me.get("/profile", auth, async (req, res) => {
  return res.status(200).json({ 
    success : true, 
    profile: {
      id: req.user.id,
      displayName: req.user.displayName || req.user.username,
      followerCount: req.user.followersCount,
      followingCount: req.user.followingCount,
      location: req.user.location || "",
      bio: req.user.bio || ""
    } 
  });
});

me.post("/following/:user_id", auth, async (req, res) => {
  const isFollowing = await getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.followers", "follower", "follower.id = :id", { id: parseInt(req.params.user_id)  })
    .where("user.id = :id", { id: parseInt(req.params.user_id) })
    .getCount()

  return res.status(200).json({ success : true, following: Boolean(isFollowing) });
});

me.post("/unfollow/:user_id", auth, async (req, res) => {
  const userRepo = getRepository(User);

  await userRepo.createQueryBuilder()
    .relation(User, "followers")
    .of(parseInt(req.params.user_id))
    .remove(req.user)

  return res.status(200).json({ success : true });
});
import { Router, Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";
import { request } from "http";
import { check, hash as hashPass } from "../helpers/Authentication";

export const auth = Router();

auth.post("/register", async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.username || !req.body.password || !req.body.password2) return res.status(400).json({ success : false, error: "Missing Fields on Request" });

  if (req.body.password !== req.body.password2) return res.status(400).json({ success : false, error: "Passwords do not match" });

  const userRepository = getRepository(User);
  
  const user = await userRepository.findOne({ 
    where: [
      { email: req.body.email },
      { username: req.body.username }
    ]
  });

  if (user != undefined && user.email === req.body.email) return res.status(400).json({ success : false, error: "User with this email already exists" });
  if (user != undefined && user.username === req.body.username) return res.status(400).json({ success : false, error: "User with this username already exists" });

  //no user exists with this email or username

  const hash = await hashPass(req.body.password);

  const newUser = new User();

  newUser.email = req.body.email;
  newUser.username = req.body.username;
  newUser.hash = hash;

  userRepository.save(newUser);

  return res.status(200).json({ success : true });
});

auth.post("/login", async (req: Request, res: Response) => {
  if (!req.body.username || !req.body.password) return res.status(400).json({ success : false, error: "Missing Fields on Request" });

  
  const userRepository = getRepository(User);

  const user: User = await userRepository.findOne({ where: { username: req.body.username } });

  if (!user) return res.status(400).json({ success : false, error: "Invalid Username" });

  if (!await check(req.body.password, user.hash)) return res.status(400).json({ success : false, error: "Invalid Password", invalidate: true });

  let sessionKey = user.sessionKey;

  if (!sessionKey) {
    sessionKey = `${Math.random().toString(36).substr(2, 10)}${Date.now()}`;

    await userRepository.update(user.id, { sessionKey });
  }

  //now password is correct so we generate a token for the phone to hold on to

  const token: string = jwt.sign({ user_id: user.id, sessionKey }, process.env.JWT_SECRET);

  return res.status(200).json({ success : true, token });
});

auth.post("/verify", async (req: Request, res: Response) => {
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

  const user = await getRepository(User).findOne({ where: { id: tokenBody.user_id }});

  if (!user.sessionKey || tokenBody.sessionKey !== user.sessionKey) return res.status(400).json({ success : false, error: "Session Key does not match", invalidate: true });

  if (!user) return res.status(400).json({ success : false, error: "User not found" });

  return res.status(200).json({ success : true });
});
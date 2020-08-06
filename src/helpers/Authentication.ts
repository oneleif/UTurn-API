import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entity/User"
import * as argon2 from "argon2";

export async function auth(req, res, next) {
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

  req.user = user;
  
  next()
}

export async function hash(password: string) {
  try {
    return await argon2.hash(password);
  } catch (err) {
    throw err;
  }
}

export async function check(password: string, hash: string) {
  try {
    if (await argon2.verify(hash, password)) {
      return true;
    }

    return false;
  } catch (err) {
    console.log(err);

    return false;
  }
}
import { Router } from "express";
import { auth } from "../helpers/Authentication";
import { Post } from "../entity/Post";
import { getRepository } from "typeorm";
import * as multer from 'multer';
import upload from "../helpers/Uploader";

export const content = Router();

content.post("/post", auth, async (req, res) => {
  const postRepository = getRepository(Post);

  const post = new Post();

  post.user = req.user

  postRepository.save(post);

  return res.json({ success: true });
});

content.post("/upload", multer({ dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 } }).single('upload'), auth, upload);
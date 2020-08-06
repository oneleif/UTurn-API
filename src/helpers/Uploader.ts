import * as AWS from "aws-sdk";
import * as fs from 'fs-extra';
import * as express from "express";
import * as path from "path";
import { getRepository } from "typeorm";
import { Upload } from "../entity/Upload";
import { addNew } from "./AddNew";
import * as dotenv from 'dotenv';
import { Car } from "../entity/Car";

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY
});

export default async (req: express.Request, res: express.Response) => {
  let data: AWS.S3.ManagedUpload.SendData;

  if (!req.body.carID) return res.status(400).json({ success : false, error: "Missing Fields on Request" });

  const car = await getRepository(Car).findOne(req.body.carID);

  if (!car) return res.status(400).json({ success : false, error: "Invalid Car ID" });

  const fileName: string = `${Date.now()}-${Math.random().toString(36).substr(2, 10)}${path.extname(req.file.originalname)}`;
  try {
    data = await s3.upload({
      Bucket: "uturn-bucket",
      Body: await fs.readFile(req.file.path),
      Key: fileName,
      ACL: "private"
    }).promise();  
  } catch(err) {
    console.log(err);
    return res.status(400).json({ success : false, error: "Internal Server Error" });
  }

  try {
    await fs.remove(req.file.path);
  } catch {
    return res.status(400).json({ success : false, error: "Internal Server Error" });
  }

  await addNew(Upload, {
    fileName,
    fileEndpoint: data.Location,
    user: req.user
  });

  return res.json({
    success: true
  });
};




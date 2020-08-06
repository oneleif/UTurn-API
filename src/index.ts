import { createConnection, getConnection } from 'typeorm';
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {User} from "./entity/User";
import * as dotenv from 'dotenv';
import { auth as authV1 } from "./routes/Auth";
import { resources as resourcesV1 } from "./routes/Resources";
import { content as contentV1 } from "./routes/Content";
import { cars as carsV1 } from "./routes/Cars";
import { me as meV1 } from './routes/me';
import { sof as sofV1 } from './routes/Sofia';

dotenv.config();
createConnection();

// create express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  console.log(req.path)
  next();
});

// setup express app here

//  *routes*
app.use("/v1/auth", authV1);
app.use("/v1/resources", resourcesV1);
app.use("/v1/content", contentV1);
app.use("/v1/cars", carsV1);
app.use("/v1/me", meV1);
app.use("/v1/sofia", sofV1);
// ...

// start express server
app.listen(3000);

console.log("Express server has started on port 3000.");

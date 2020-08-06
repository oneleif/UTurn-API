import { Router} from "express";
import { Car } from "../entity/Car";
import { getRepository } from "typeorm";
import { auth } from "../helpers/Authentication";
import axios from "axios";
import { Model } from "../entity/Model";
import { Make } from "../entity/Make";
import { User } from "../entity/User";

export const cars = Router();

cars.post("/make", async (req, res) => {
  const makeRepo = getRepository(Make);

  const make = new Make();

  await makeRepo.save(make);

  return res.status(200).json({ success : true });
});

cars.post("/model", async (req, res) => {
  if (!req.body.makeID) return res.status(400).json({ success: false, error: "Missing Input Fields" });
  
  const makeRepo = getRepository(Make);
  const modelRepo = getRepository(Model);

  const make = await makeRepo.findOne(req.body.makeID);
  
  if (!make) return res.status(400).json({ success : false, error: "Invalid Make ID" });

  const model = new Model();

  model.make = make;

  await modelRepo.save(model);

  console.log(model)

  return res.status(200).json({ success : true });
});

cars.post("/new", auth, async (req, res) => {
  if (!req.body.makeID || !req.body.modelID) return res.status(400).json({ success: false, error: "Missing Input Fields" });

  const carRepo = getRepository(Car);
  const makeRepo = getRepository(Make);
  const modelRepo = getRepository(Model);

  const make = await makeRepo.findOne(req.body.makeID);

  if (!make) return res.status(400).json({ success : false, error: "Invalid Car Make" });

  const model = await modelRepo.findOne(req.body.modelID, { relations: ["make"] });

  if (!model) return res.status(400).json({ success : false, error: "Invalid Car Model" });

  if (model.make.id !== req.body.makeID) return res.status(400).json({ success : false, error: "Invalid Car Make" });

  const car = new Car();

  car.make = make;
  car.model = model;
  car.user = req.user;

  await carRepo.save(car);

  return res.status(200).json({ success : true });
});

cars.get("/makes", async (req, res) => {
  const count = 100;
  let results;

  try {
    results = (await axios.get("https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json")).data.Results;
  } catch {
    return res.status(400).json({ success : false, error: "Internal Server Error" });
  }

  results = results.slice(0, count);

  return res.json({ success: true, results, count });
});

cars.post("/me", auth, async (req, res) => {
  const userRepository = getRepository(User);

  const userWithCars = await userRepository.findOne(req.user.id, { relations: ["cars", "cars.model", "cars.make"] })

  return res.status(200).json({ success : true, cars:  userWithCars.cars});
});
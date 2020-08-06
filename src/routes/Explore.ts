import { Router } from "express";
import { auth } from "../helpers/Authentication";

export const explore = Router();

explore.post("/search/:query", auth, async (req, res) => {
  return res.status(200).json({ 
    success : true,
    results: [
      {
        id: 0,
        content: "https://images.unsplash.com/photo-1542362567-b07e54358753?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      },
      {
        id: 1,
        content: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
        feature: true
      },
      {
        id: 2,
        content: "https://i.insider.com/5d0bd4b7e3ecba5d97628a02?width=1100&format=jpeg&auto=webp"
      },
      {
        id: 3,
        content: "https://carsguide-res.cloudinary.com/image/upload/f_auto,fl_lossy,q_auto,t_cg_hero_large/v1/editorial/story/hero_image/2019-Porsche-911-coupe-red-press-image-1001x565p-%281%29.jpg"
      },
      {
        id: 4,
        content: "https://img.autobytel.com/car-reviews/autobytel/11694-good-looking-sports-cars/2016-Ford-Mustang-GT-burnout-red-tire-smoke.jpg"
      },
      {
        id: 5,
        content: "https://static-ssl.businessinsider.com/image/5d9b5bff52887931e8497a36-1405/141222twnmustang.jp2"
      }
    ]
  });
});
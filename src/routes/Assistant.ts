import { Router } from "express";
import { dialogflow, actionssdk, Image, Table, Carousel } from "actions-on-google";

const assistant = Router();
const app = dialogflow({
  debug: true
});

//assistant

app.fallback((conv) => {
  conv.ask(`I couldn't understand. Can you say that again?`);
});
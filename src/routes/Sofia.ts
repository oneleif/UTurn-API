import { Router } from "express";
import dialogflow from "@google-cloud/dialogflow";
import * as uuid from "uuid";
import Actions from "../helpers/AssistantActions";
import { auth } from "../helpers/Authentication";

export const sof = Router();

sof.post("/conversate", auth, async (req, res) => {
  if (!req.body.value) return res.status(400).json({ success: false, error: "Missing Input Fields" });
  
  // A unique identifier for the given session
  const sessionId = uuid.v4();
 
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath("uturn-285604", sessionId);
 
  // The text query request.
  const request = { session: sessionPath, queryInput: { text: { text: req.body.value, languageCode: 'en-US' } } };
 
  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;

  let response = { response: result.fulfillmentText }

  if (Actions[result.intent.displayName]) {
    response = await Actions[result.intent.displayName](req.user, result.fulfillmentText);
  }

  return res.status(200).json({ success : true, ...response });
});
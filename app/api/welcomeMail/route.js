import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

import conf from "@/conf/config";
const sdk = require("node-appwrite");
const client = new sdk.Client();

const messaging = new sdk.Messaging(client);
client
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId)
  .setKey(
    "b00ec9fddadb9f6d8ce6e3a5412ad0b9097a83ddcfd2968ef1d8fc9fb821c3994d9ede4094438342ce7e43cd54c1cfe88dcd96d32e6c5a13f47936930e03f37f973bda21145571904929c10c1a56a7a55eae44fc6fff26462a296c44b71ac8dd6facf657a530298c401e8d84cd0754e79986d18562ee9c633932e45c5f81825f"
  );

export async function POST(req, res) {
  const reqBody = await req.json();
  console.log("request body", reqBody.id);
  const message = await messaging.createEmail(
    ID.unique(), // messageId
    reqBody.subject, // subject
    reqBody.content, // content
    [], // topics (optional)
    [reqBody.id], // users (optional)
    [], // targets (optional)
    [], // cc (optional)
    [],
    [], // bcc (optional)
    false, // draft (optional)
    false // html (optional)
    // scheduledAt (optional)
  );
  // const message = await messaging.createEmail(
  //   ID.unique(),
  //   "b7@bareed.ws",
  //   "Login Alert",
  //   "b7@bareed.ws"
  // );
  // const message = await messaging.createEmail(
  //   ID.unique(), // messageId
  //   "Login Alert", // subject
  //   "New Login detected", // content
  //   [], // topics (optional)
  //   [], // users (optional)
  //   ["663e085900145098a548"], // targets (optional)
  //   [], // cc (optional)
  //   [], // bcc (optional)
  //   false, // draft (optional)
  //   false, // html (optional)
  //   "" // scheduledAt (optional)
  // );
  console.log(message.body);
}

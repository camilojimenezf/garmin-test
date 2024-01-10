import { connectToDatabase } from "../db/mongo";
import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  console.log("event", event);
  const { db } = await connectToDatabase();
  const routesCollection = db.collection("routes"); // Replace with your collection name

  if (event.req.method === "POST") {
    const data = await readBody(event);
    const result = await routesCollection.insertOne(data);
    return { success: true, data: result };
  }
});

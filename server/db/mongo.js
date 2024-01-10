// server/db/mongo.js
import { MongoClient } from "mongodb";

const client = new MongoClient(
  "mongodb+srv://garminapp:tt85SIfu3JbtjCX5@cluster0.clxzx.mongodb.net/?retryWrites=true&w=majority"
);

export async function connectToDatabase() {
  if (!client.isConnected) await client.connect();
  const db = client.db("garminapp"); // Replace with your database name
  return { db, client };
}

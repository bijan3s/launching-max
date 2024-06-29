import "./../setPath";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoSeeder } from "./seeder";
import { mongoConnection } from ".";

dotenv.config();

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

const runSeeders = async () => {
  for (const { model, seeder } of MongoSeeder) {
    if (typeof seeder === "function") {
      console.log(`Seeding ${model.modelName}`);
      await seeder();
    } else {
      console.error(`Seeder for ${model.modelName} is not a function`);
    }
  }
};

const seedDatabase = async () => {
  try {
    await mongoConnection(mongoose).connectToMongo();
    console.log("Connected to MongoDB");
    await clearDatabase();
    console.log("Database cleared");
    await runSeeders();
    console.log("Database seeded");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0); // Ensure the script exits
  }
};

seedDatabase();

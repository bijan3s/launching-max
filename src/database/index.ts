import { Mongoose } from "mongoose";

export const mongoConnection = function (mongoose: Mongoose) {
  async function connectToMongo() {
    try {
      const client = await mongoose.connect(
        process.env.CONNECTION_STRING_MONGO ||
          "mongodb://127.0.0.1:27017/launchingmax"
      );
    } catch (e) {
      console.error("mongoose connection err:", e);
    }
  }

  mongoose.connection.on("connected", () => {
    console.info("Connected to MongoDB!");
  });

  mongoose.connection.on("reconnected", () => {
    console.info("MongoDB reconnected!");
  });

  mongoose.connection.on("error", (error) => {
    console.error(`Error in MongoDb connection: ${error}`);
    mongoose.disconnect();
  });

  mongoose.connection.on("disconnected", () => {
    console.error(
      `MongoDB disconnected! Reconnecting in ${
        process.env.MONGO_RECONNECT_INTERVAL
          ? Number(process.env.MONGO_RECONNECT_INTERVAL) / 1000
          : 5
      }s...`
    );
    setTimeout(
      () => connectToMongo(),
      Number(process.env.MONGO_RECONNECT_INTERVAL) / 1000 || 5000
    );
  });

  return {
    connectToMongo,
  };
};

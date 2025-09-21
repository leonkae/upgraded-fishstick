import { MONGO_URI } from "@/constants";
import mongoose from "mongoose";
import { connect } from "mongoose";

// export const connectToDatabase = () => {
//   connect(MONGO_URI)
//     .then(() => console.log("Connected to the database"))
//     .catch(() => process.exit(1));
// };

// trial fix, time out issue on db
export const connectToDatabase = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

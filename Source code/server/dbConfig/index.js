import mongoose from "mongoose";
import dns from "dns";

const dbConnection = async () => {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (err) {
    console.log(err);
  }
};
export default dbConnection;

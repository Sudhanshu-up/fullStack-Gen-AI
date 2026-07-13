import mongoose from "mongoose";
import dns from "dns"

// Force Google DNS - Windows default resolver SRV lookup fail kar raha hai
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to database!!");
  } catch (error) {
    console.log(error);
  }
}

export default connectToDB;
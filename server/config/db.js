import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect(process.env.DATABASE_URL);

    console.log("MongoDB Atlas Connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
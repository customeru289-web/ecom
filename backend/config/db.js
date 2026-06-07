import mongoose from 'mongoose';
import dns from 'dns';

// Fixes Atlas SRV lookup failures on some Windows networks
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

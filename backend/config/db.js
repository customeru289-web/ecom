import mongoose from 'mongoose';
import dns from 'dns';

if (process.platform === 'win32') {
  dns.setDefaultResultOrder('ipv4first');
}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  const conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;

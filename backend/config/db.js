import '../crypto-polyfill.js';
import mongoose from 'mongoose';
import dns from 'dns';

if (process.platform === 'win32') {
  dns.setDefaultResultOrder('ipv4first');
}

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not set');
  }

  const options = {
    serverSelectionTimeoutMS: 20000,
    family: 4,
  };

  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, options);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      lastError = err;
      console.error(`MongoDB attempt ${attempt} failed:`, err.message);
      if (attempt < 3) await new Promise((r) => setTimeout(r, 3000));
    }
  }

  throw lastError;
};

export default connectDB;

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecosync_db';
    const conn = await mongoose.connect(connStr);
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB] Database connection warning: ${error.message}`);
    console.log('[MongoDB] Backend will operate with in-memory fallback state if MongoDB is not running locally.');
  }
};

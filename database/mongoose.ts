 import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error('Please provide MONGODB_URI in the environment variables');
}

declare global {
    var mongoose: {
        conn: Mongoose | null
        promise: Promise<Mongoose> | null
    }
    var mongooseCache: {
        conn: Mongoose | null
        promise: Promise<Mongoose> | null
    }
}

    let cached=global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

    export const connectToDatabase = async () => {
        if (cached.conn) return cached.conn;
        if (!cached.promise) {
            cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands:false });
            }
        try {
            cached.conn = await cached.promise;
        } catch (e) {
            cached.promise = null;
            console.error(`MongoDB connection error. Please make sure MongoDB is running.` + e);
            throw e;
        }
        console.info('Connected to MongoDB');
        return cached.conn;
    }


import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await initializeCollections();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const initializeCollections = async () => {
  const db = mongoose.connection.db;

  // Create Users collection
  if (!(await db.listCollections({ name: 'users' }).hasNext())) {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["phoneNumber"],
          properties: {
            phoneNumber: {
              bsonType: "string",
              description: "must be a string and is required"
            },
            dataBalance: {
              bsonType: "number",
              minimum: 0,
              description: "must be a positive number"
            }
          }
        }
      }
    });
    await db.collection('users').createIndex({ phoneNumber: 1 }, { unique: true });
    console.log('Created users collection');
  }

  // Create Rides collection
  if (!(await db.listCollections({ name: 'rides' }).hasNext())) {
    await db.createCollection('rides');
    console.log('Created rides collection');
  }
};

export default connectDB;

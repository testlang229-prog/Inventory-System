const mongoose = require('mongoose');

let connectionPromise = null;

function getMongoConfig() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    const error = new Error('MONGODB_URI is required');
    error.statusCode = 500;
    throw error;
  }

  return { uri, dbName };
}

async function connectMongo() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    return connectionPromise;
  }

  const { uri, dbName } = getMongoConfig();

  connectionPromise = mongoose.connect(uri, {
    dbName: dbName || undefined,
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await connectionPromise;
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    console.error('MongoDB connection failed:', error.message);
    const connectionError = new Error('Failed to connect to MongoDB');
    connectionError.statusCode = 503;
    throw connectionError;
  }
}

async function ensureMongoConnected(req, res, next) {
  try {
    await connectMongo();
    next();
  } catch (error) {
    res.status(error.statusCode || 503).json({
      success: false,
      message: error.message || 'MongoDB connection unavailable',
    });
  }
}

module.exports = {
  connectMongo,
  ensureMongoConnected,
};

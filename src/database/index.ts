import mongoose from 'mongoose';
import config from '../config';
import { getMockDatabaseURI, closeMockDatabase } from './mock';

const connectMongoose = async () => {
  const connectionURI = config.isTesting()
    ? await getMockDatabaseURI()
    : config.databaseURL;

  return mongoose.connect(
        connectionURI!,
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        },
  )
    .then(() => {
      if (!config.isTesting()) console.log('👌  Database connection completed. 👌');
    })
    .catch((error) => {
      if (!config.isTesting()) console.log(`❌  Database connection error ${error} ❌`);
    });
};

export const connectDatabase = async () => {
  if (!config.isTesting()) {
    const db = mongoose.connection;

    db.on('connecting', () => {
      console.log('⏳  Connecting to Database... ⏳');
    });

    db.on('error', (error) => {
      console.log(`❌  Database connection error ${error} ❌`);
      mongoose.disconnect();
    });
    db.on('connected', () => {
      console.log('🆗  Database connected. 🆗');
    });
    db.once('open', () => {
      console.log('👍  Database connection opened!. 👍');
    });
    db.on('reconnected', () => {
      console.log('🤘  Database reconnected! 🤘');
    });
    db.on('disconnected', () => {
      console.log('🛑  Database disconnected. Trying to reconnect... 🛑');
      connectMongoose();
    });
  }

  return connectMongoose();
};

export const closeDatabase = async () => new Promise((resolve, reject) => {
  if (!config.isTesting()) {
    mongoose.disconnect()
      .then(() => {
        console.log('################################################\n'
                      + '     🐍  Database disconnected successfully. 🐍\n'
                      + '################################################\n');
        resolve();
      }).catch((error) => {
        console.log('################################################\n'
                      + `     ❌  Error occured when database tried to disconnect: ${error} ❌\n`
                      + '################################################\n');
        reject();
      });
  } else {
    closeMockDatabase();
  }
});

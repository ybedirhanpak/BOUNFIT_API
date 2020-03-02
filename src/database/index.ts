import mongoose from "mongoose";
import config from "../config";

const connectMongoose = () => {
    mongoose.connect(
        config.databaseURL!,
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            server: {
                auto_reconnect: true
            }
        }
    )
        .then(() => {
            console.log(`🐍  Database connection established. 🐍`);
        })
        .catch((error) => {
            console.log(`❌  Database connection error ${error} ❌`);
        });
}

export const connectDatabase = () => {
    let db = mongoose.connection;

    db.on('connecting', () => {
        console.log('Connecting to MongoDB...');
    });

    db.on('error', (error) => {
        console.error('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });
    db.on('connected', () => {
        console.log('MongoDB connected!');
    });
    db.once('open', () => {
        console.log('MongoDB connection opened!');
    });
    db.on('reconnected', () => {
        console.log('MongoDB reconnected!');
    });
    db.on('disconnected', () => {
        console.log('MongoDB disconnected!');
        connectMongoose();
    });

    connectMongoose();
}

export const closeDatabase = async () => {
    return new Promise((resolve, reject) => {
        mongoose.disconnect()
            .then(() => {
                console.log(`################################################\n` +
                    `     🐍  Database disconnected successfully. 🐍\n` +
                    `################################################\n`
                );
                resolve();
            }).catch((error) => {
                console.log(`################################################\n` +
                    `     ❌  Error occured when database tried to disconnect: ${error} ❌\n` +
                    `################################################\n`
                );
                reject();
            })
    });
}


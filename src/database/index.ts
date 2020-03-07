import mongoose from "mongoose";
import config from "../config";

const connectMongoose = () => {
    console.log("Connection URL:", config.databaseURL);

    mongoose.connect(
        config.databaseURL!,
        {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }
    )
        .then(() => {
            console.log(`👌  Database connection completed. 👌`);
        })
        .catch((error) => {
            console.log(`❌  Database connection error ${error} ❌`);
        });
}

export const connectDatabase = () => {
    let db = mongoose.connection;

    db.on('connecting', () => {
        console.log(`⏳  Connecting to Database... ⏳`);
    });

    db.on('error', (error) => {
        console.log(`❌  Database connection error ${error} ❌`);
        mongoose.disconnect();
    });
    db.on('connected', () => {
        console.log(`🆗  Database connected. 🆗`);

    });
    db.once('open', () => {
        console.log(`👍  Database connection opened!. 👍`);

    });
    db.on('reconnected', () => {
        console.log(`🤘  Database reconnected! 🤘`);

    });
    db.on('disconnected', () => {
        console.log(`🛑  Database disconnected. Trying to reconnect... 🛑`);
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


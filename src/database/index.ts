import mongoose from "mongoose";
import config from "../config";

export const connectDatabase = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(
            config.databaseURL!,
            { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }
        )
            .then(() => {
                console.log(`################################################\n` +
                    `     🐍  Database connection established. 🐍\n` +
                    `################################################\n`
                );
                resolve();
            })
            .catch((error) => {
                console.log(`################################################\n` +
                    `     ❌  Database connection error ${error} ❌\n` +
                    `################################################\n`
                );
                reject();
            });
    });
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


import mongoose from "mongoose";
import config from "../config";
import { Mockgoose } from "mockgoose";

export const connectDatabase = async () => {

    if (process.env.NODE_ENV === "test") {
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.prepareStorage()
            .then(() => {
                mongoose.connect(
                    config.databaseURL,
                    { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }
                )
                    .then(() => {
                        console.log(`################################################\n` +
                            `     🐍  Database connection established. 🐍\n` +
                            `################################################\n`
                        );
                    })
                    .catch((error) => {
                        console.log(`################################################\n` +
                            `     ❌  Database connection error ${error} ❌\n` +
                            `################################################\n`
                        );
                    })
            })
    } else {
        return mongoose.connect(
            config.databaseURL,
            { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true }
        )
            .then(() => {
                console.log(`################################################\n` +
                    `     🐍  Database connection established. 🐍\n` +
                    `################################################\n`
                );
            })
            .catch((error) => {
                console.log(`################################################\n` +
                    `     ❌  Database connection error ${error} ❌\n` +
                    `################################################\n`
                );
            })
    }

}

export const closeDatabase = async () => {
    mongoose.disconnect();
}


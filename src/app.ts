import "reflect-metadata";
import config from "./config";
import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./api";

//Create app instance
const app = express();

//Connect the database
mongoose.connect(config.databaseURL, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
    .then(() => {
        console.log(`🐍  Database connection established. 🐍`);
    })
    .catch((error) => {
        console.log("Database connection error: ", error);
    })

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Catch 400
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(400).send(`Url not found error: ${err}`);
    next();
});

//Catch 500
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    res.status(500).send(`Bad request error: ${err}`);
    next();
});

// Load API routes
app.use(config.api.prefix, routes());

const port = config.port;

app.listen(port, () => {
    console.log(`
  ################################################
  🛡️  Server listening on port: ${config.port} 🛡️ 
  ################################################
`);
});

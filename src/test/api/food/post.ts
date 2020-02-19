import { expect } from "chai";
import request from "supertest";
import app from "../../../app";
import { connectDatabase, closeDatabase } from "../../../database";
import { IFoodCreateDTO } from "../../../interfaces/food";
// const expect = require("chai");
// const request = require("supertest");
// const app = require("../../../app");
// const database = require("../../../database");
// const food = require("../../../interfaces/food");

describe("POST /foods", () => {
    before((done) => {
        connectDatabase()
            .then(() => done())
            .catch((err) => done(err));
    });

    after((done) => {
        closeDatabase()
            .then(() => done())
            .catch((err) => done(err));
    });

    it("OK, creating a food", (done) => {
        const foodCreateDTO: IFoodCreateDTO = {
            name: "trash",
            protein: 1,
            fat: 1,
            carb: 1,
            calories: 20
        }
        request(app)
            .post("/foods/create")
            .send(foodCreateDTO)
            .then((res) => {
                const body = res.body;
                console.log(body);
                done();
            })
            .catch((err) => done(err));
    })
})
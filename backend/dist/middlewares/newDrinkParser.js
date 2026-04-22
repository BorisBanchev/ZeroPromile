"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newDrinkParser = void 0;
const newDrinkSchema_1 = require("../validationSchemas/newDrinkSchema");
const newDrinkParser = (req, _res, next) => {
    try {
        newDrinkSchema_1.newDrinkSchema.parse(req.body);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.newDrinkParser = newDrinkParser;

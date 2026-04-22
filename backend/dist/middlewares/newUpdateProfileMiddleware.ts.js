"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUpdateProfileParser = void 0;
const newUpdateProfileSchema_1 = require("../validationSchemas/newUpdateProfileSchema");
const newUpdateProfileParser = (req, _res, next) => {
    try {
        newUpdateProfileSchema_1.newUpdateProfileSchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.newUpdateProfileParser = newUpdateProfileParser;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newSessionParser = void 0;
const newSessionSchema_1 = require("../validationSchemas/newSessionSchema");
const newSessionParser = (req, _res, next) => {
    try {
        newSessionSchema_1.newSessionSchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.newSessionParser = newSessionParser;

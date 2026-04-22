"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newUserParser = void 0;
const newUserEntrySchema_1 = require("../validationSchemas/newUserEntrySchema");
const newUserParser = (req, _res, next) => {
    try {
        newUserEntrySchema_1.newUserEntrySchema.parse(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.newUserParser = newUserParser;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGenderAndWeight = void 0;
const db_1 = require("../config/db");
const enums_1 = require("../generated/prisma/enums");
const appError_1 = require("../error/appError");
const setGenderAndWeight = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gender, weight } = req.body;
    if (!req.user) {
        throw new appError_1.AppError("Not authorized", 401);
    }
    const mappedGender = gender === "male" ? enums_1.Gender.MALE : enums_1.Gender.FEMALE;
    const updated = yield db_1.prisma.user.update({
        where: { id: req.user.id },
        data: { gender: mappedGender, weightKg: weight },
        select: { gender: true, weightKg: true },
    });
    return res.status(200).json({
        status: "success",
        message: "successfully updated user profile",
        data: { gender: updated.gender, weightKg: updated.weightKg },
    });
});
exports.setGenderAndWeight = setGenderAndWeight;

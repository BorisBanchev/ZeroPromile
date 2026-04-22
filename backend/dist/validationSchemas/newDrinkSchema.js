"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newDrinkSchema = void 0;
const zod_1 = require("zod");
exports.newDrinkSchema = zod_1.z.object({
    drink: zod_1.z.object({
        name: zod_1.z
            .string("Drink name must be a string")
            .min(1, "Drink name is required"),
        volumeMl: zod_1.z
            .number("Drink amount in Ml must be a positive number")
            .positive("Drink amount in Ml must be a positive number")
            .lt(2000, "Drink volume must be at most 2L"),
        abv: zod_1.z
            .number()
            .gt(0, "Drink abv must be greater than 0")
            .lte(100, "Drink abv must be at most 100"),
    }),
});

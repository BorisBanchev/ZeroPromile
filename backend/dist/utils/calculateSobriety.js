"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soberTimeToMinutes = exports.hoursToHoursAndMinutes = exports.timeUntilSober = exports.currentBAC = exports.drinkToBAC = void 0;
const ETHANOLDENSITY = 0.789;
const BETA = 0.15;
// returns promilles
const drinkToBAC = (volumeMl, abv, weightKg, r) => {
    const grams = volumeMl * (abv / 100) * ETHANOLDENSITY;
    return grams / (weightKg * r);
};
exports.drinkToBAC = drinkToBAC;
// returns current total promilles since session started
const currentBAC = (drinks, tNowMs) => {
    const HOURS_MS = 1000 * 60 * 60;
    if (!drinks.length)
        return 0;
    const events = drinks
        .map((d) => ({
        time: new Date(d.time).getTime(),
        bac: Math.max(0, d.bac),
    }))
        .sort((a, b) => a.time - b.time);
    if (!events.length)
        return 0;
    let bac = 0;
    let lastTime = events[0].time;
    for (const e of events) {
        const elapsedHours = Math.max(0, (e.time - lastTime) / HOURS_MS);
        bac = Math.max(0, bac - BETA * elapsedHours);
        bac += e.bac;
        lastTime = e.time;
    }
    const elapsedToNowHours = Math.max(0, (tNowMs - lastTime) / HOURS_MS);
    return Math.max(0, bac - BETA * elapsedToNowHours);
};
exports.currentBAC = currentBAC;
// returns time until complete sobriety in hours and minutes
const timeUntilSober = (bac) => {
    return { currentBac: bac, untilSober: (0, exports.hoursToHoursAndMinutes)(bac / BETA) };
};
exports.timeUntilSober = timeUntilSober;
const hoursToHoursAndMinutes = (time) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return { hours, minutes };
};
exports.hoursToHoursAndMinutes = hoursToHoursAndMinutes;
const soberTimeToMinutes = (time) => {
    return time.untilSober.hours * 60 + time.untilSober.minutes;
};
exports.soberTimeToMinutes = soberTimeToMinutes;

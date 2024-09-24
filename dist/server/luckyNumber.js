"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LuckyNumber {
    constructor() {
        this.luckyNumbers = {};
    }
    GetWinners(number) {
        const winners = [];
        for (let id in this.luckyNumbers) {
            if (number === this.luckyNumbers[id]) {
                winners.push(id);
            }
        }
        return winners;
    }
}
exports.default = LuckyNumber;

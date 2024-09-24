export default class LuckyNumber {
  public luckyNumbers: { [id: string]: number } = {};
  constructor() {}

  public GetWinners(number: number): string[] {
    const winners = [];
    for (let id in this.luckyNumbers) {
      if (number === this.luckyNumbers[id]) {
        winners.push(id);
      }
    }
    return winners;
  }
}

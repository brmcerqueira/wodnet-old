export type RollResult = {
  successes: number,
  dices: number[],
  isCriticalFailure: boolean
}

export type Roll = {
  amount: number,
  explosion: number,
  isCanceller: boolean
  result: RollResult
}

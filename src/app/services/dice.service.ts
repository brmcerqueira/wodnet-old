import {Injectable} from "@angular/core";
import {Roll} from "./roll";

@Injectable()
export class DiceService {
  public roll(amount: number, explosion: number, isCanceller: boolean): Roll {
    if (explosion) {
      if (explosion > 11) {
        explosion = 11;
      }
      else if (explosion < 8){
        explosion = 8;
      }
    }
    else {
      explosion = 11
    }

    let successes: number = 0;
    let dices: number[] = [];
    let isCriticalFailure: boolean = false;

    if (amount <= 0) {
      amount = 0;
      let dice = this.dice();
      if(dice == 10) {
        successes++;
        amount++;
      }
      else if(dice == 1) {
        isCriticalFailure = true;
      }
      dices.push(dice);
    }

    for(let i = 0; i < amount; i++){
      let dice = this.dice();
      if(dice >= 8) {
        successes++;
        if(dice >= explosion) {
          amount++;
        }
      }
      else if(isCanceller && dice == 1) {
        successes--;
      }
      dices.push(dice);
    }

    return { successes, dices: dices.sort((a, b) =>  b - a), explosion, isCriticalFailure };
  }

  private dice(): number {
    return Math.floor((Math.random() * 10) + 1);
  }
}

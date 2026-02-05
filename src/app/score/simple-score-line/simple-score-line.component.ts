import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatTotal, TeeBox, User } from '../../models/golf-course';
import { checkHandicapHole, getHoleHandicap, getScoreClass } from '../../utils/score-utils';
import { UserProfile } from 'shared-data';


@Component({
  selector: 'app-simple-score-line',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simple-score-line.component.html',
  styleUrl: './simple-score-line.component.scss'
})
export class SimpleScoreLineComponent {
  // 1. Inputs
  player = input<User>({} as User);
  tees = input.required<TeeBox>();

  // 2. The Data Model (Two-way sync with Parent)
  // We use Partial<StatTotal> because fields like 'putts' might be undefined
  holes = model<Partial<StatTotal>[]>([]);

  // 3. Update Logic
  // We only update the 'totalScore' field. We preserve the rest of the object
  // so we don't lose detailed stats if the user switches modes.
  updateScore(index: number, value: number) {
    this.holes.update(current => {
      const newHoles = [...current];
      newHoles[index] = { ...newHoles[index], totalScore: value };
      return newHoles;
    });
  }
  getNetScore(i: number, value: number){
    // value is the entered score
    const net = value - this.getsAPop(i);
    console.log('Net Score is ', net);
    return net;
  }
  // 4. Helper: Calculate Round Total
  getTotalScore(start: number = 0, end: number = 18): number {
    return this.holes().slice(start, end).reduce((sum, hole) => {
      return sum + (Number(hole.totalScore) || 0);
    }, 0);
  }
  getTotalNetScore(): any {
   const totalScore =  this.getTotalScore();
   const netScore= totalScore - (this.player()?.playerInfo?.handicap || 0);
   return netScore > 0 ? ` / ${netScore}` : '';
  }


  getScoreSymbol(holeIndex: number): string {
    const score = this.holes()[holeIndex]?.totalScore;
    this.holes()[holeIndex].netScore = !score ? 0 :score - this.getsAPop(holeIndex);
    const par = this.tees().holeinfo[holeIndex]?.par;
    return getScoreClass(score, par);
  }

   userInfo(){
    return `${this.player()?.displayName} - ${this.player()?.playerInfo?.handicap}`
  }

   getsAPop(holeNumber: number): number{
    const holes = this.tees().holes;
    const userHandicap = this.player()?.playerInfo?.handicap || 0;
    const holeHandicap =  getHoleHandicap(holes, holeNumber)  || 0;
    return checkHandicapHole(holeHandicap, userHandicap) ? 1 : 0;
  }
}

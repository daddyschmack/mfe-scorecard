import { AfterViewInit, Component, computed, inject, input, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HoleStat, statDisplayMap } from '../../models/hole-stat';
import { StatTotal, TeeBox, User } from '../../models/golf-course';
import { getScoreClass, checkHandicapHole, getHoleHandicap } from '../../utils/score-utils';
import { UserProfile } from 'shared-data';
import { GolfCourseService } from '../../services/golf-course.service';

@Component({
  selector: 'app-score-line',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './score-line.component.html',
  styleUrl: './score-line.component.scss'
})
export class ScoreLineComponent implements AfterViewInit{
    private golfCourseService = inject(GolfCourseService);
  // Input Signals
  player = input<User>({} as User);
  tees = input.required<TeeBox>();



  constructor(){
    console.log(' User is ', this.player);
  }

  // State: 18 holes of detailed stats
  holes = model<Partial<StatTotal>[]>(
    Array.from({ length: 18 }, (_,i) => ({
      totalScore: undefined,
      holeHandicap: undefined,
      teeShots: undefined,
      fairwayStrokes: undefined,
      totalPutts: undefined,
      totalChips: undefined,
      penaltyStrokes: undefined,
      driveInFairway: undefined,
      greenInRegulation: undefined
    }))
  );
  ngAfterViewInit(){
    console.log('ngAfterViewInit');
    console.log(this);
  }

  // --- ViewModel ---
  // This computed signal prepares the rows for the template.
  // It combines the static config (statDisplayMap) with dynamic data (playerName).
  displayRows = computed(() => {
    // 1. Get keys and sort them
    const keys = (Object.keys(statDisplayMap) as (keyof StatTotal)[]).sort((a, b) => {
      return statDisplayMap[a].cardPosition - statDisplayMap[b].cardPosition;
    });

    // 2. Map to View Objects
    return keys.map(key => {
      const isTotal = key === 'totalScore';
      return {
        key: key,
        label: isTotal ? this.userInfo() : (statDisplayMap[key]?.title || key),
        isTotalRow: isTotal,
        showCheckbox: ['greenInRegulation', 'driveInFairway'].includes(key)
      };
    });
  });

  // Helper to calculate total score for a hole based on inputs
  private calculateTotal(hole: Partial<StatTotal>): number | undefined{
    const handicapStrokes = this.getsAPop(hole.holeNumber ?? 0);
    const total = (
      (hole.teeShots || 0) +
      (hole.totalPutts || 0) +
      (hole.totalChips || 0) +
      (hole.fairwayStrokes || 0) +
      (hole.penaltyStrokes || 0) -
      (handicapStrokes|| 0)
    );
    return total === 0 ? undefined : total;
  }

  // Update a specific field for a specific hole
  updateStat(index: number, field: keyof StatTotal, value: number | boolean | undefined) {
    this.holes.update(current => {
      const newHoles = [...current];
      const updatedHole = { ...newHoles[index], [field]: value };
      updatedHole.holeHandicap = this.getHoleHandicap(index);

      // Recalculate total score whenever a stat changes
      if (field !== 'totalScore') {
        updatedHole.totalScore = this.calculateTotal(updatedHole);
      }

      newHoles[index] = updatedHole;
      return newHoles;
    });
  }

  // Replicating getScoreSymbol logic for styling (Eagle, Birdie, etc.)
  getScoreSymbol(key: string, holeIndex: number): string {
    if (key !== 'totalScore') return '';

    const total = this.holes()[holeIndex]?.totalScore;
    const par = this.tees().holeinfo[holeIndex]?.par;

    return getScoreClass(total, par);
  }



    getHoleHandicap(holeNumber: number){
     const hcap = this.tees().holes[holeNumber].handicap;
     return hcap;
  }


  // Calculates the row total (e.g. Total Putts across 18 holes)
  getTotalStat(key: string): number {
    return this.holes().reduce((sum, hole) => {
      const val = hole[key as keyof StatTotal];
      // Handle boolean for checkboxes (count true as 1)
      if (typeof val === 'boolean') {
        return sum + (val ? 1 : 0);
      }
      return sum + (Number(val) || 0);
    }, 0);
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

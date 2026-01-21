import { Component, computed, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HoleStat, statDisplayMap } from '../../models/hole-stat';
import { StatTotal, TeeBox } from '../../models/golf-course';
import { getScoreClass } from '../../utils/score-utils';

@Component({
  selector: 'app-score-line',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './score-line.component.html',
  styleUrl: './score-line.component.scss'
})
export class ScoreLineComponent {
  // Input Signals
  playerName = input<string>('Tom');
  tees = input.required<TeeBox>();

  // State: 18 holes of detailed stats
  holes = model<Partial<StatTotal>[]>(
    Array.from({ length: 18 }, () => ({
      totalScore: undefined,
      teeShots: undefined,
      fairwayStrokes: undefined,
      totalPutts: undefined,
      totalChips: undefined,
      penaltyStrokes: undefined,
      driveInFairway: undefined,
      greenInRegulation: undefined
    }))
  );

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
        label: isTotal ? this.playerName() : (statDisplayMap[key]?.title || key),
        isTotalRow: isTotal,
        showCheckbox: ['greenInRegulation', 'driveInFairway'].includes(key)
      };
    });
  });

  // Helper to calculate total score for a hole based on inputs
  private calculateTotal(hole: Partial<StatTotal>): number | undefined {
    const total = (
      (hole.teeShots || 0) +
      (hole.totalPutts || 0) +
      (hole.totalChips || 0) +
      (hole.fairwayStrokes || 0) +
      (hole.penaltyStrokes || 0)
    );
    return total === 0 ? undefined : total;
  }

  // Update a specific field for a specific hole
  updateStat(index: number, field: keyof StatTotal, value: number | boolean | undefined) {
    this.holes.update(current => {
      const newHoles = [...current];
      const updatedHole = { ...newHoles[index], [field]: value };

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
}

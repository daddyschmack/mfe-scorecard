import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GolfTeam } from '../../models/golf-course';

@Component({
  selector: 'app-team-match-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-match-row.html',
  styleUrl: './score-summary.scss' // Reuse styles from parent for now
})
export class TeamMatchRow {
  // Inputs
  team = input.required<GolfTeam>();
  opponent = input<GolfTeam>(); // Optional, needed for highlighting wins
  scoreType = input<'net' | 'gross'>('net');

  // Computed: Get the array of scores based on type (Net/Gross)
  scores = computed(() => {
    const t = this.team();
    const type = this.scoreType();
    const roundScores = t.score?.roundScore || [];

    // Map to simple array of numbers for easier iteration
    return roundScores.map(s => type === 'net' ? s.netScore : s.grossScore);
  });

  // Computed: Get opponent scores for comparison
  opponentScores = computed(() => {
    const opp = this.opponent();
    if (!opp) return [];
    const type = this.scoreType();
    const roundScores = opp.score?.roundScore || [];
    return roundScores.map(s => type === 'net' ? s.netScore : s.grossScore);
  });

  // Helper: Calculate Totals (Raw Score)
  getTotal(start: number, end: number): number {
    const s = this.scores();
    return s.slice(start, end).reduce((sum, val) => sum + (val || 0), 0);
  }

  // Helper: Calculate Holes Won in a range
  getHolesWon(start: number, end: number): number {
    let won = 0;
    for (let i = start; i < end; i++) {
      if (this.isHoleWinner(i)) won++;
    }
    return won;
  }

  // Helper: Calculate Differential (Won - Lost) in a range
  getDifferential(start: number, end: number): number {
    let diff = 0;
    for (let i = start; i < end; i++) {
      if (this.isHoleWinner(i)) diff++;
      else if (this.isHoleLoser(i)) diff--;
    }
    return diff;
  }

  // Helper: Format Differential string (+1, E, -1)
  formatDifferential(diff: number): string {
      if (diff > 0) return `+${diff}`;
      if (diff < 0) return `${diff}`;
      return 'E';
  }

  // Helper: Check if this team won the hole
  isHoleWinner(index: number): boolean {
    const myScore = this.scores()[index];
    const oppScore = this.opponentScores()[index];

    // Valid score check
    if (!myScore || !oppScore || myScore >= 100 || oppScore >= 100) return false;

    return myScore < oppScore;
  }

  // Helper: Check if this team lost the hole
  isHoleLoser(index: number): boolean {
    const myScore = this.scores()[index];
    const oppScore = this.opponentScores()[index];
    if (!myScore || !oppScore || myScore >= 100 || oppScore >= 100) return false;
    return myScore > oppScore;
  }

  // Helper: Check if hole was tied
  isHoleHalved(index: number): boolean {
    const myScore = this.scores()[index];
    const oppScore = this.opponentScores()[index];
    if (!myScore || !oppScore || myScore >= 100 || oppScore >= 100) return false;
    return myScore === oppScore;
  }
}

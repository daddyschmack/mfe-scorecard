import { Component, computed, effect, input, signal } from '@angular/core';
import { CollapsibleComponent } from '../../shared/collapsible/collapsible.component';
import { GolfTeam } from '../../models/golf-course';
import { TitleCasePipe } from '@angular/common';
import { TeamMatchRow } from './team-match-row';

export interface MatchResult {
  teamA: GolfTeam;
  teamB: GolfTeam;
  status: string;
  winner?: string;
}

@Component({
  selector: 'app-score-summary',
  imports: [CollapsibleComponent, TitleCasePipe, TeamMatchRow],
  templateUrl: './score-summary.html',
  styleUrl: './score-summary.scss',
})
export class ScoreSummary {
  teams = input<GolfTeam[]>([]);

  // State for comparison type
  comparisonType = signal<'net' | 'gross'>('net');

  // FUTURE FEATURE: Allow user to filter/select specific teams to compare (e.g., Team 1 vs Team 3 only)
  // This would involve a new signal 'selectedTeams' and filtering the loop below.

  matches = computed(() => {
    const currentTeams = this.teams();
    const results: MatchResult[] = [];

    for (let i = 0; i < currentTeams.length; i++) {
      for (let j = i + 1; j < currentTeams.length; j++) {
        const teamA = currentTeams[i];
        const teamB = currentTeams[j];

        results.push(this.calculateMatch(teamA, teamB));
      }
    }
    return results;
  });

  constructor(){
    effect(() => {
      console.log('RAW TEAMS INPUT:', this.teams());
    });
  }

  private calculateMatch(teamA: GolfTeam, teamB: GolfTeam): MatchResult {
    let ups = 0;
    const type = this.comparisonType(); // 'net' or 'gross'

    // Use 'score' property as verified in GolfTeam interface
    const scoresA = teamA.score?.roundScore || [];
    const scoresB = teamB.score?.roundScore || [];

    for (let i = 0; i < 18; i++) {
        // Dynamically access netScore or grossScore based on selection
        const scoreA = type === 'net' ? scoresA[i]?.netScore : scoresA[i]?.grossScore;
        const scoreB = type === 'net' ? scoresB[i]?.netScore : scoresB[i]?.grossScore;

        // Skip if either team hasn't played the hole (score 0 or high placeholder)
        if (!scoreA || !scoreB || scoreA >= 100 || scoreB >= 100) continue;

        if (scoreA < scoreB) ups++;
        else if (scoreB < scoreA) ups--;
    }

    let status = 'AS';
    let winner = undefined;

    if (ups > 0) {
        status = `${ups} UP`;
        winner = teamA.teamId;
    } else if (ups < 0) {
        status = `${Math.abs(ups)} UP`;
        winner = teamB.teamId;
    }

    return {
      teamA: teamA,
      teamB: teamB,
      status: status,
      winner: winner
    };
  }

  toggleComparisonType() {
      this.comparisonType.update(current => current === 'net' ? 'gross' : 'net');
  }
}

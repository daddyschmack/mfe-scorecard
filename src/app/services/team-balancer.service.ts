import { Injectable } from '@angular/core';
import { GolfTeam, GolfRound, PlayerInfo } from "../models/golf-course";
import { catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamBalancerService {

  constructor(
    private http: HttpClient
  ) { }

  // Function to create balanced golf teams based on handicaps
  createBalancedTeams(rounds: GolfRound[], numTeams: number): GolfTeam[] {
    if (!rounds || rounds.length === 0 || numTeams < 1) return [];

    // Helper to safely get handicap
    const getHandicap = (r: GolfRound) => r.golfer?.playerInfo?.handicap ?? 0;

    // 1. Initial Distribution: Create teams ensuring equal size
    // We shuffle first to avoid any bias from the input order
    const shuffledPlayers = [...rounds].sort(() => Math.random() - 0.5);
    const teams: GolfRound[][] = Array.from({ length: numTeams }, () => []);

    // Distribute players round-robin to ensure sizes are as equal as possible
    shuffledPlayers.forEach((player, index) => {
      teams[index % numTeams].push(player);
    });

    // 2. Optimization: Hill Climbing (Random Swaps)
    // We try to minimize the difference between the highest and lowest team totals.
    let currentBestTeams = this.cloneTeams(teams);
    let currentMinDiff = this.calculateMaxDiff(currentBestTeams, getHandicap);

    // Run for a set number of iterations
    const iterations = 2000;

    for (let i = 0; i < iterations; i++) {
      // Pick two random teams
      const teamAIndex = Math.floor(Math.random() * numTeams);
      let teamBIndex = Math.floor(Math.random() * numTeams);

      // Ensure we picked different teams
      if (teamAIndex === teamBIndex) continue;

      // Ensure teams have players to swap
      if (teams[teamAIndex].length === 0 || teams[teamBIndex].length === 0) continue;

      // Pick a random player from each team
      const playerAIndex = Math.floor(Math.random() * teams[teamAIndex].length);
      const playerBIndex = Math.floor(Math.random() * teams[teamBIndex].length);

      // Swap them
      const playerA = teams[teamAIndex][playerAIndex];
      const playerB = teams[teamBIndex][playerBIndex];

      teams[teamAIndex][playerAIndex] = playerB;
      teams[teamBIndex][playerBIndex] = playerA;

      // Calculate new difference
      const newDiff = this.calculateMaxDiff(teams, getHandicap);

      // If this swap improved balance (or kept it same), keep it.
      // If it made it worse, revert the swap.
      if (newDiff < currentMinDiff) {
        currentMinDiff = newDiff;
        currentBestTeams = this.cloneTeams(teams); // Save this new best state
      } else {
        // Revert swap if it didn't improve (Strict Hill Climbing)
        if (newDiff > currentMinDiff) {
             teams[teamAIndex][playerAIndex] = playerA;
             teams[teamBIndex][playerBIndex] = playerB;
        }
      }
    }

    // 3. Transform into GolfTeam objects
    return currentBestTeams.map((members, index) => {
      const totalHandicap = members.reduce((sum, p) => sum + getHandicap(p), 0);

      return {
        teamId: (index + 1).toString(),
        totalHandicap: totalHandicap,
        roster: members,
        score: {
          numberOfBalls: 2, // Default: Best 2 balls
          scoringType: 'net', // Default: Net scoring
          netScore: 0,
          grossScore: 0,
          roundTime: 0,
          roundDate: new Date(),
          roundScore: [] // Empty hole scores
        }
      };
    });
  }

  private calculateMaxDiff(teams: GolfRound[][], getHandicap: (p: any) => number): number {
    const totals = teams.map(team => team.reduce((sum, p) => sum + getHandicap(p), 0));
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    return max - min;
  }

  private cloneTeams(teams: GolfRound[][]): GolfRound[][] {
    return teams.map(team => [...team]);
  }
}

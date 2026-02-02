import { Injectable } from '@angular/core';
import { PlayerInfo } from "../models/golf-course";

@Injectable({
  providedIn: 'root'
})
export class TeamBalancerService {

  constructor() { }

  // Function to create balanced golf teams based on handicaps
  createBalancedTeams(players: PlayerInfo[], numTeams: number): PlayerInfo[][] {
    if (!players || players.length === 0 || numTeams < 1) return [];

    // Helper to safely get handicap
    const getHandicap = (p: any) => p.handicap ?? p.hcap ?? 0;

    // 1. Initial Distribution: Create teams ensuring equal size
    // We shuffle first to avoid any bias from the input order
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const teams: PlayerInfo[][] = Array.from({ length: numTeams }, () => []);

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
        // Note: We could allow equal swaps to explore, but for simple partitioning strict is usually fine.
        // Actually, let's revert if it's strictly worse. If it's equal, we keep it to shuffle things around.
        if (newDiff > currentMinDiff) {
             teams[teamAIndex][playerAIndex] = playerA;
             teams[teamBIndex][playerBIndex] = playerB;
        } else {
             // It's equal, so we keep the swap but don't update 'currentBestTeams' yet
             // This allows traversing the plateau
        }
      }
    }

    // Return the best configuration found
    return currentBestTeams;
  }

  private calculateMaxDiff(teams: PlayerInfo[][], getHandicap: (p: any) => number): number {
    const totals = teams.map(team => team.reduce((sum, p) => sum + getHandicap(p), 0));
    const max = Math.max(...totals);
    const min = Math.min(...totals);
    return max - min;
  }

  private cloneTeams(teams: PlayerInfo[][]): PlayerInfo[][] {
    return teams.map(team => [...team]);
  }
}

import { Component, inject, input, model, signal } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamBalancerService } from '../services/team-balancer.service';
import { GolfTeam, PlayerInfo, GolfRound, StatTotal } from '../models/golf-course';

@Component({
  selector: 'app-team-manager',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './team-manager.html',
  styleUrl: './team-manager.scss',
})
export class TeamManager {
  private balancer = inject(TeamBalancerService);


  // Inputs
  availablePlayers = input<Partial<PlayerInfo>[]>([]);

  //State
  selectedPlayers = signal<Partial<PlayerInfo>[]>([]);
  numTeams = signal(2);
  tolerance = signal(2);

  // The teams (Array of GolfTeam objects) - Two-way binding
  teams = model<GolfTeam[]>([]);

  togglePlayerSelection(player: Partial<PlayerInfo>, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedPlayers.update( current => {
      if (isChecked) return [...current, player];
      return current.filter(p => p.name !== player.name);
    })
  }

  autoBalance() {
    const players = this.selectedPlayers() as PlayerInfo[];
    // Convert PlayerInfo to GolfRound objects
    const rounds = players.map(p => this.createRoundForPlayer(p));
    const balanced = this.balancer.createBalancedTeams(rounds, this.numTeams());
    this.teams.set(balanced)
  }

  drop(event: CdkDragDrop<GolfRound[]>) {
    if(event.previousContainer === event.container){
     // Reorder within the same team
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      // Trigger signal update by creating a new array reference for teams
      this.teams.update(t => [...t]);
    } else {
      // Move between teams
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.teams.update(t => [...t]);
    }
  }

  getTeamTotal(team: GolfTeam): number{
    // We can use the pre-calculated total, or re-calculate if we want to be dynamic after drag-drop
    // Since drag-drop modifies the members array but doesn't update the totalHandicap property automatically,
    // we should re-calculate here to be safe for the UI.
    return team.roster.reduce((sum,p) => sum + this.getPlayerHandicap(p), 0);
  }

  getDiffFromMean(teamTotal: number): number{
    const allTeams = this.teams();
    if(allTeams.length === 0) return 0;

    // Calculate grand total of all players in all teams
    const grandTotal = allTeams.flatMap(t => t.roster)
      .reduce((sum, p) => sum + this.getPlayerHandicap(p), 0);

    const mean = grandTotal / allTeams.length;
    return teamTotal - mean;
  }

  getPlayerHandicap(p: GolfRound | Partial<PlayerInfo>): number {
    // Handle GolfRound
    if ('golfer' in p) {
      return p.golfer?.playerInfo?.handicap ?? 0;
    }
    // Handle PlayerInfo
    return (p as Partial<PlayerInfo>).handicap ?? (p as any).hcap ?? 0;
  }

  isToleranceBreached(teamTotal: number): boolean {
    return Math.abs(this.getDiffFromMean(teamTotal)) > this.tolerance();
  }

  private createRoundForPlayer(player: PlayerInfo): GolfRound {
    return {
      id: Math.random().toString(36).substring(2, 9),
      golfer: {
        email: `${player.name.replace(/\s/g, '')}@example.com`,
        password: '',
        displayName: player.name,
        photoURL: '',
        emailVerified: false,
        playerInfo: { ...player }
      },
      teeBox: {}, // Will be populated by Scorecard if needed
      round_date: new Date(),
      player_score: this.createEmptyRound(),
      summary_score: { totalScore: 0 }
    };
  }

  private createEmptyRound(): StatTotal[] {
    const scoreArray: StatTotal[] = [];
    for (let i = 0; i < 18; i ++){
      scoreArray.push({
        holeNumber: i+1,
        totalScore: 0
      });
    }
    return scoreArray;
  }

}

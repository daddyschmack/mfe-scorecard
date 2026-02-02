import { Component, inject, input, model, signal } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamBalancerService } from '../services/team-balancer.service';
import { PlayerInfo } from '../models/golf-course';

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

  // The teams (Array of Arrays) - Two-way binding
  teams = model<Partial<PlayerInfo>[][]>([]);

  togglePlayerSelection(player: Partial<PlayerInfo>, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedPlayers.update( current => {
      if (isChecked) return [...current, player];
      return current.filter(p => p.name !== player.name);
    })
  }

  autoBalance() {
    const players = this.selectedPlayers() as PlayerInfo[];
    const balanced = this.balancer.createBalancedTeams(players, this.numTeams());
    this.teams.set(balanced)
  }

  drop(event: CdkDragDrop<Partial<PlayerInfo>[]>) {
    if(event.previousContainer === event.container){
     // Reorder within the same team
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.teams.update(t => [...t]) // trigger signal update
    } else {
      // Move between teams
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.teams.update(t => [...t])
    }
  }

  getTeamTotal(team: Partial<PlayerInfo>[]): number{
    return team.reduce((sum,p) => sum + (p.handicap ||0), 0)
  }

  getDiffFromMean(teamTotal: number): number{
    const allTeams = this.teams();
    if(allTeams.length === 0) return 0;
    const grandTotal = allTeams.flat()
      .reduce((sum, p) => sum + this.getPlayerHandicap(p),0);
    const mean = grandTotal / allTeams.length
    return teamTotal - mean;
  }

    getPlayerHandicap(p: Partial<PlayerInfo>): number {
    return p.handicap ?? (p as any).hcap ?? 0;
  }

  isToleranceBreached(teamTotal: number): boolean {
    return Math.abs(this.getDiffFromMean(teamTotal)) > this.tolerance();
  }
}

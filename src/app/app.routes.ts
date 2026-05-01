import { Routes } from '@angular/router';
import { Scorecard } from './score/scorecard/scorecard';
import { TeamManager } from './team-manager/team-manager';

export const routes: Routes = [
  { path: '', component: Scorecard, pathMatch: 'full' },
  { path: 'play', component: Scorecard },
  { path: 'play-teams', component: TeamManager},
  { path: '**', component: Scorecard  } // Catch-all for debugging
];

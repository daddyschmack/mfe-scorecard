import { Routes } from '@angular/router';
import { Scorecard } from './score/scorecard/scorecard';

export const routes: Routes = [
  { path: '', component: Scorecard, pathMatch: 'full' },
  { path: 'play', component: Scorecard },
  { path: '**', component: Scorecard } // Catch-all for debugging
];

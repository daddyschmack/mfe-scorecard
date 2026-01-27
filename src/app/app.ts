import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserProfileService } from 'shared-data';
import { Scorecard } from './score/scorecard/scorecard';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Scorecard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mfe-scorecard');
  userProfileService = inject(UserProfileService );
  user = this.userProfileService.userProfile;


}

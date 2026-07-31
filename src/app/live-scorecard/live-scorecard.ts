import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GameService } from '../services/game-service';
import { GolfCourseService } from '../services/golf-course.service';

@Component({
  selector: 'app-live-scorecard',
  imports: [],
  templateUrl: './live-scorecard.html',
  styleUrl: './live-scorecard.scss',
})
export class LiveScorecard {
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private golfCourseService = inject(GolfCourseService);

  gameId = toSignal(this.route.queryParams.pipe(map(p => p['gameId'] as string)));
  teamId = toSignal(this.route.queryParams.pipe(map(p => p['teamId'] as string)));
}

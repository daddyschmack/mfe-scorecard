import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { Game, GolfRound } from '../models/golf-course';

// Modern modular Firestore imports
import {
  Firestore,
  collection,
  doc,
  addDoc,
  docData,
  collectionData,
  query,
  where,
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private firestore = inject(Firestore);

  private dbPath = 'Games';
  private roundsPath = 'Rounds';

  private currentGameSubject = new BehaviorSubject<Game | null>(null);
  public currentGame$ = this.currentGameSubject.asObservable();

  // ... [createGame and getGameStream methods here] ...

  /**
   * Fetches the rounds for a specific team once and then closes the connection.
   */
  public getTeamRounds(gameId: string, teamId: string): Observable<GolfRound[]> {
    // 1. Create collection reference
    const roundsCollectionRef = collection(this.firestore, this.roundsPath);

    // 2. Build the query using where() clauses
    const teamRoundsQuery = query(
      roundsCollectionRef,
      where('gameId', '==', gameId),
      where('teamId', '==', teamId)
    );

    // 3. collectionData replaces valueChanges()
    return (collectionData(teamRoundsQuery, { idField: 'id' }) as Observable<GolfRound[]>).pipe(
      take(1),
      catchError(error => {
        console.error('Error fetching team rounds:', error);
        return of([]); // Clean fallback to empty array
      })
    );
  }

  /**
   * Updates a specific round document directly in the /Rounds collection.
   */
  public async updatePlayerScore(roundId: string, newScoreData: Partial<GolfRound>): Promise<void> {
    try {
      // Reference the specific document in 'Rounds'
      const roundDocRef = doc(this.firestore, `${this.roundsPath}/${roundId}`);

      // updateDoc updates specific fields without overwriting the whole document
      await updateDoc(roundDocRef, newScoreData);
    } catch (error) {
      console.error(`Error updating round ${roundId}:`, error);
      throw error;
    }
  }
}

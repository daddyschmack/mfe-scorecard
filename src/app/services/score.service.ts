import { Injectable } from '@angular/core';
import { GolfRound } from "../models/golf-course";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private dbPath = '/Scores';
  scoreCollectionRef: AngularFirestoreCollection;
  public scoresSubject: Subject<Partial<GolfRound>> = new Subject<Partial<GolfRound>>();
  public score: Subject<Partial<GolfRound>> = new Subject<Partial<GolfRound>>();

  constructor( private db: AngularFirestore
  ) {
    this.scoreCollectionRef = db.collection(this.dbPath)
  }
  updateScore(id: string, roundInfo: Partial<GolfRound>){
    this.scoreCollectionRef.doc(id).update(roundInfo)
    this.scoreCollectionRef.valueChanges()
  }

  addScore(round: Partial<GolfRound>){
      return this.scoreCollectionRef.add(round);
  }

  getScores(numberOfScores?: number): AngularFirestoreCollection<Partial<GolfRound>>{
    return this.scoreCollectionRef;
  }

   checkHandicapHole(holeHandicap: number, golferHandicap: number): string{
    // we will compare the user's handicap and determine if they get a stroke(s) on the hole
     return  golferHandicap < holeHandicap  ? 'disabled' : '';
    }

}

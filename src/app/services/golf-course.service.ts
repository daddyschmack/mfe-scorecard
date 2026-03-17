import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, catchError, filter, map, Observable, of, tap } from "rxjs";
import { GolfCourse, PlayerInfo, StatTotal } from "../models/golf-course";

@Injectable({
  providedIn: 'root'
})
export class GolfCourseService {
  public statTotal: any = {
    totalScore: 0,
    teeShots: 0,
    fairwayStrokes: 0,
    totalPutts: 0,
    totalChips: 0,
    greenInRegulation: 0,
    driveInFairway: 0,
    penaltyStrokes:0,
  };
  public totalCounter = new BehaviorSubject<StatTotal[]>([]);

  constructor(private http: HttpClient) { }

  getPlayerList(): Observable<Partial<PlayerInfo>[]> {
    return this.http.get<Partial<PlayerInfo>[]>('assets/player_data/player-list.json')
    .pipe(
      catchError((error) => {
        console.error('Error loading player data:', error);
        return of([]);
      })
    )
  }

  getGolfCourse(courseName: string): Observable<GolfCourse> {
    let result: any;
    result = this.http.get(`assets/golf_course_data/${courseName}.json`);
   // result = this.http.get('assets/golf-course-nutcracker.json')
   return result
  }
  getTotalValue(targetArray: StatTotal[], property: string): number {
    if( targetArray?.length === 0 || !property){
      return 0;
    }
    let sum: number = targetArray?.map((a: any) => this.getNumberFrom(a[property])).reduce(function(a: number, b:number)
    {
      return a + b;
    });
    return sum;
  }

  getNumberFrom(val: any){
    if( val === null){
      return 0;
    } else if( isNaN(val) === false && (typeof val === 'string') ){
      return parseInt(val)
    }else if( isNaN(val) ) {
      return 0
    } else {
      return val;
    }
  }
  calculateDistance(lat1: number, lon1:number, lat2:number, lon2:number, unit: string) {
    unit = !unit ? 'Y' : unit;
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      if (unit == 'Y') { dist = dist/5280}
      return dist;
    }
  }

  totalScores(array: StatTotal[]){
    Object.keys(this.statTotal).forEach(
      key => {
        const total: number = this.getTotalValue(array, key);
        this.statTotal[key] = total;
      }
    )
  }

}

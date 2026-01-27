export function getScoreClass(score: number | undefined, par: number | undefined, holeIndex?: number | undefined): string {
  if (!score || !par) return '';

  const diff = par - score;
  if (diff > 1) return 'eagle';
  if (diff === 1) return 'birdie';
  if (diff === 0) return 'par';
  if (diff === -1) return 'bogie';
  return 'ouch'; // Double bogey or worse
}

export function  checkHandicapHole(holeHandicap: number, golferHandicap: number): boolean{
    // we will compare the user's handicap and determine if they get a stroke(s) on the hole
     return  holeHandicap <= golferHandicap;
}



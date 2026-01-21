export function getScoreClass(score: number | undefined, par: number | undefined): string {
  if (!score || !par) return '';

  const diff = par - score;
  if (diff > 1) return 'eagle';
  if (diff === 1) return 'birdie';
  if (diff === 0) return 'par';
  if (diff === -1) return 'bogie';
  return 'ouch'; // Double bogey or worse
}
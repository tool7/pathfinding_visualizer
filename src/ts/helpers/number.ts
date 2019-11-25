export function getNumberFactors(n: number): number[] {
  return Array
    .from(Array(n + 1), (_, i) => i)
    .filter(i => n % i === 0);
}

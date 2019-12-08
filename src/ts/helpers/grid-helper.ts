// Conversion from axial coordinates to array indices
export function convertAxialToArrayIndicies(q: number, r: number): { i: number, j: number } {
  let i = q + Math.floor(r / 2);
  return { i, j: r };
}

// Conversion from array indices to axial coordinates
export function convertArrayToAxialCoordinates(i: number, j: number): { q: number, r: number } {
  let q = i - Math.floor(j / 2);
  return { q, r: j };
}

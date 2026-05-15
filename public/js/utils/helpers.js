export function cloneGrid(grid) {
  return grid.map((row) => row.slice());
}

export function formatElapsed(secondsTotal) {
  const minutes = String(Math.floor(secondsTotal / 60)).padStart(2, "0");
  const seconds = String(secondsTotal % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

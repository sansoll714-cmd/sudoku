import { DEFAULT_DIFFICULTY } from "../config/constants.js";
import { puzzles } from "../data/puzzles.js";
import { cloneGrid, pickRandom } from "../utils/helpers.js";

export function createNewGame(selectedDifficulty) {
  const difficulty = selectedDifficulty || DEFAULT_DIFFICULTY;
  const puzzlePool = getPuzzlesByDifficulty(difficulty);
  const fallbackPool = getPuzzlesByDifficulty(DEFAULT_DIFFICULTY);
  const selected = pickRandom(puzzlePool.length > 0 ? puzzlePool : fallbackPool);

  return {
    difficulty: selected.difficulty,
    puzzle: cloneGrid(selected.puzzle),
    board: cloneGrid(selected.puzzle),
    solution: cloneGrid(selected.solution),
    fixed: selected.puzzle.map((row) => row.map((cell) => cell !== 0)),
    selectedCell: null,
    mistakes: 0,
    hintsUsed: 0,
    startedAt: Date.now(),
    completed: false,
    difficultyLocked: false
  };
}

export function resetGameBoard(gameState) {
  gameState.board = cloneGrid(gameState.puzzle);
  gameState.selectedCell = null;
  gameState.mistakes = 0;
  gameState.hintsUsed = 0;
  gameState.completed = false;
  gameState.startedAt = Date.now();
}

function getPuzzlesByDifficulty(difficulty) {
  return puzzles.filter((puzzle) => puzzle.difficulty === difficulty);
}

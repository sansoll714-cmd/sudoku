import { DEFAULT_DIFFICULTY, MAX_HINTS, MAX_MISTAKES } from "../config/constants.js";
import { createNewGame, resetGameBoard } from "./gameState.js";
import { formatElapsed } from "../utils/helpers.js";
import { renderBoard } from "../ui/boardView.js";
import { DifficultyMenu } from "../ui/difficultyMenu.js";

export class GameManager {
  constructor(elements) {
    this.elements = elements;
    this.gameState = null;
    this.timerId = null;
    this.difficultyMenu = new DifficultyMenu({
      trigger: elements.difficultyTrigger,
      menu: elements.difficultyMenu,
      valueLabel: elements.difficultyValue,
      options: elements.difficultyOptions
    });
  }

  init() {
    this.difficultyMenu.init({
      onChange: (difficulty) => {
        this.difficultyMenu.setValue(difficulty);
      }
    });

    this.elements.newGameBtn.addEventListener("click", () => this.startNewGame());
    this.elements.hintBtn.addEventListener("click", () => this.giveHint());
    this.elements.resetBtn.addEventListener("click", () => this.resetBoard());
    window.addEventListener("keydown", (event) => this.handleBoardKeydown(event));

    this.startNewGame();
  }

  startNewGame() {
    this.gameState = createNewGame(this.difficultyMenu.getValue() || DEFAULT_DIFFICULTY);
    this.difficultyMenu.setValue(this.gameState.difficulty);
    this.restartTimer();
    this.updateDifficultyState();
    this.updateHintState();
    this.setMessage("칸을 선택하고 숫자를 입력해보세요.");
    this.render();
    this.updateTimer();
  }

  restartTimer() {
    clearInterval(this.timerId);
    this.timerId = window.setInterval(() => this.updateTimer(), 1000);
  }

  updateTimer() {
    this.elements.timerLabel.textContent = formatElapsed(this.getElapsedSeconds());
  }

  getElapsedSeconds() {
    if (!this.gameState) {
      return 0;
    }

    return Math.floor((Date.now() - this.gameState.startedAt) / 1000);
  }

  updateDifficultyState() {
    this.difficultyMenu.setLocked(!this.gameState || this.gameState.difficultyLocked);
  }

  updateHintState() {
    if (!this.gameState) {
      this.elements.hintCountLabel.textContent = `0 / ${MAX_HINTS}`;
      this.elements.hintBtn.disabled = false;
      return;
    }

    this.elements.hintCountLabel.textContent = `${this.gameState.hintsUsed} / ${MAX_HINTS}`;
    this.elements.hintBtn.disabled =
      this.gameState.completed || this.gameState.hintsUsed >= MAX_HINTS;
  }

  setMessage(text) {
    this.elements.messageLabel.textContent = text;
  }

  render() {
    renderBoard(this.elements.board, this.gameState, (row, col) => this.selectCell(row, col));
  }

  selectCell(row, col) {
    if (this.gameState.completed || this.gameState.fixed[row][col]) {
      return;
    }

    this.gameState.selectedCell = { row, col };
    this.render();
  }

  lockDifficulty() {
    if (!this.gameState || this.gameState.difficultyLocked) {
      return;
    }

    this.gameState.difficultyLocked = true;
    this.updateDifficultyState();
  }

  handleInput(value) {
    if (!this.gameState || !this.gameState.selectedCell || this.gameState.completed) {
      return;
    }

    const { row, col } = this.gameState.selectedCell;
    if (this.gameState.fixed[row][col]) {
      return;
    }

    this.lockDifficulty();
    this.gameState.board[row][col] = value;

    if (value !== this.gameState.solution[row][col]) {
      this.gameState.mistakes += 1;
      this.setMessage("오답입니다. 다른 숫자를 시도해보세요.");

      if (this.gameState.mistakes >= MAX_MISTAKES) {
        this.gameState.completed = true;
        clearInterval(this.timerId);
        this.updateHintState();
        this.setMessage("실수 횟수를 모두 사용했습니다. 새 게임으로 다시 시작해보세요.");
      }
    } else {
      this.setMessage("좋아요. 흐름을 이어가보세요.");
    }

    this.render();
    this.checkCompletion();
  }

  eraseSelected() {
    if (!this.gameState || !this.gameState.selectedCell || this.gameState.completed) {
      return;
    }

    const { row, col } = this.gameState.selectedCell;
    if (this.gameState.fixed[row][col]) {
      return;
    }

    this.gameState.board[row][col] = 0;
    this.setMessage("선택한 칸을 비웠습니다.");
    this.render();
  }

  giveHint() {
    if (!this.gameState || this.gameState.completed) {
      return;
    }

    if (this.gameState.hintsUsed >= MAX_HINTS) {
      this.setMessage("힌트는 최대 5번까지 사용할 수 있습니다.");
      return;
    }

    const availableCells = [];
    for (let row = 0; row < 9; row += 1) {
      for (let col = 0; col < 9; col += 1) {
        if (!this.gameState.fixed[row][col] && this.gameState.board[row][col] !== this.gameState.solution[row][col]) {
          availableCells.push({ row, col });
        }
      }
    }

    if (availableCells.length === 0) {
      this.setMessage("힌트를 줄 수 있는 칸이 없습니다.");
      return;
    }

    this.lockDifficulty();
    this.gameState.hintsUsed += 1;
    const hintCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    this.gameState.board[hintCell.row][hintCell.col] = this.gameState.solution[hintCell.row][hintCell.col];
    this.gameState.selectedCell = hintCell;
    this.updateHintState();
    this.setMessage(`힌트를 사용했습니다. ${this.gameState.hintsUsed} / ${MAX_HINTS}`);
    this.render();
    this.checkCompletion();
  }

  resetBoard() {
    if (!this.gameState) {
      return;
    }

    resetGameBoard(this.gameState);
    this.restartTimer();
    this.updateHintState();
    this.setMessage("보드를 초기 상태로 되돌렸습니다.");
    this.updateTimer();
    this.render();
  }

  checkCompletion() {
    const solved = this.gameState.board.every((row, rowIndex) =>
      row.every((value, colIndex) => value === this.gameState.solution[rowIndex][colIndex])
    );

    if (!solved) {
      return;
    }

    this.finishGame();
  }

  finishGame() {
    this.gameState.completed = true;
    clearInterval(this.timerId);
    this.updateHintState();
    this.setMessage(
      `완료! ${this.gameState.difficulty} 난이도 · ${formatElapsed(this.getElapsedSeconds())} · 힌트 ${this.gameState.hintsUsed}회 사용`
    );
  }

  handleBoardKeydown(event) {
    if (!this.gameState || this.gameState.completed) {
      return;
    }

    if (event.key >= "1" && event.key <= "9") {
      this.handleInput(Number(event.key));
    }

    if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
      this.eraseSelected();
    }
  }
}

export function renderBoard(boardElement, gameState, onSelectCell) {
  boardElement.innerHTML = "";

  const selectedValue = gameState.selectedCell
    ? gameState.board[gameState.selectedCell.row][gameState.selectedCell.col]
    : 0;

  gameState.board.forEach((rowValues, row) => {
    rowValues.forEach((value, col) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);
      cell.textContent = value === 0 ? "" : String(value);

      if (gameState.fixed[row][col]) {
        cell.classList.add("fixed");
      }

      if (gameState.selectedCell && gameState.selectedCell.row === row && gameState.selectedCell.col === col) {
        cell.classList.add("selected");
      } else if (isRelatedCell(row, col, gameState.selectedCell)) {
        cell.classList.add("related");
      }

      if (selectedValue !== 0 && value === selectedValue) {
        cell.classList.add("same-number");
      }

      if (value !== 0 && value !== gameState.solution[row][col]) {
        cell.classList.add("error");
      }

      cell.addEventListener("click", () => onSelectCell(row, col));
      boardElement.appendChild(cell);
    });
  });
}

function isRelatedCell(row, col, selectedCell) {
  if (!selectedCell) {
    return false;
  }

  const sameRow = row === selectedCell.row;
  const sameCol = col === selectedCell.col;
  const sameBox =
    Math.floor(row / 3) === Math.floor(selectedCell.row / 3) &&
    Math.floor(col / 3) === Math.floor(selectedCell.col / 3);

  return sameRow || sameCol || sameBox;
}

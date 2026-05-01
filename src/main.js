import { pieces } from "./assets/utils/pieces";

const app = document.getElementById("app");
const board = document.getElementById("board");

let turn = "white";
console.log("whites turn")

board.addEventListener("dragover", (e) => {
  e.preventDefault();
});

const removeHighlights = () => {
  for (let i = 0; i < 64; i++) {
    board.children[i].classList.remove("highlight");
  }
};

const isInRangeOfBoard = (row, col) =>
  row >= 0 && col <= 7 && row <= 7 && col >= 0;

const calcRookMoves = (row, col, color) => {
  const moves = [];
  const directions = [
    { dr: -1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: 1 },
  ];

  for (const dir of directions) {
    let currRow = row + dir.dr;
    let currCol = col + dir.dc;

    while (
      isInRangeOfBoard(currRow, currCol) &&
      (!isAPieceInThisPosition(currRow * 8 + currCol) ||
        !isThisPieceInThisPositionWithTheColor(currRow * 8 + currCol, color))
    ) {
      if (
        isAPieceInThisPosition(currRow * 8 + currCol) &&
        !isThisPieceInThisPositionWithTheColor(currRow * 8 + currCol, color)
      ) {
        moves.push(currRow * 8 + currCol);
        break;
      }
      moves.push(currRow * 8 + currCol);

      currRow += dir.dr;
      currCol += dir.dc;
    }
  }
  return moves;
};

const isThisPieceInThisPositionWithTheColor = (to, color) =>
  board.children[to].childElementCount > 0 &&
  color == board.children[to].firstElementChild.getAttribute("data-color");

const isAPieceInThisPosition = (pos) => {
  return board.children[pos].childElementCount > 0;
};

let isTheFirstMoveOfTheWhiteKing = true;
let isTheFirstMoveOfTheBlackKing = true;

const firstMovesRooks = {
  white: {
    left: true,
    right: true,
  },
  black: {
    left: true,
    right: true,
  },
};

const calcBishopMoves = (row, col, color) => {
  const moves = [];
  const directions = [
    { dr: -1, dc: -1 },
    { dr: -1, dc: 1 },
    { dr: 1, dc: -1 },
    { dr: 1, dc: 1 },
  ];

  for (const dir of directions) {
    let currRow = row + dir.dr;
    let currCol = col + dir.dc;

    while (
      isInRangeOfBoard(currRow, currCol) &&
      (!isAPieceInThisPosition(currRow * 8 + currCol) ||
        !isThisPieceInThisPositionWithTheColor(currRow * 8 + currCol, color))
    ) {
      if (
        isAPieceInThisPosition(currRow * 8 + currCol) &&
        !isThisPieceInThisPositionWithTheColor(currRow * 8 + currCol, color)
      ) {
        moves.push(currRow * 8 + currCol);
        break;
      }
      moves.push(currRow * 8 + currCol);
      currRow += dir.dr;
      currCol += dir.dc;
    }
  }
  return moves;
};

const movePieceElement = (pieceFromPos, pieceToPos, color, pieceType) => {
  const currPiece = board.children[pieceFromPos].firstElementChild;
  board.children[pieceFromPos].removeChild(currPiece);

  currPiece.setAttribute("data-position", pieceToPos);
  board.children[pieceToPos].appendChild(currPiece);

  currPiece.addEventListener("dragstart", (e) => {
    currPiece.classList.add("is-dragging");
    e.dataTransfer.setData("text/plain", `${pieceToPos},${pieceType},${color}`);
  });
};

const fillBoard = () => {
  for (let i = 0; i < 64; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.setAttribute("data-position", i);
    square.addEventListener("dragover", (e) => e.preventDefault());
    square.addEventListener("drop", (e) => {
      const from = e.dataTransfer.getData("text/plain");
      const to = i;

      movePiece(from, to);
    });
    board.appendChild(square);
  }
};

const movePiece = (from, to) => {
  const [posFrom, pieceType, color] = from.split(",");
  if(turn != color) return 
  if (calculateMove(parseInt(posFrom), pieceType, color).indexOf(to) == -1) {
    return;
  }

  if (isAPieceInThisPosition(to)) {
    if (isThisPieceInThisPositionWithTheColor(to, color)) {
      console.log("La Pieza es del mismo color");
      return;
    }
    const eatenPiece = board.children[to].firstElementChild;
    board.children[to].removeChild(eatenPiece);
  }

  if (pieceType == "king") {
    if (color == "black" && isTheFirstMoveOfTheBlackKing) {
      isTheFirstMoveOfTheBlackKing = false;
      if (posFrom - to == 2) {
        movePieceElement(0, +posFrom - 1, "black", "rook");
      } else if (posFrom - to == -2) {
        movePieceElement(7, +posFrom + 1, "black", "rook");
      }
    }
    if (color == "white" && isTheFirstMoveOfTheWhiteKing) {
      isTheFirstMoveOfTheWhiteKing = false;
      if (posFrom - to == 2) {
        movePieceElement(56, posFrom - 1, "white", "rook");
      } else if (posFrom - to == -2) {
        movePieceElement(63, +posFrom + 1, "white", "rook");
      }
    }
  }
  if (pieceType == "rook") {
    if (color == "white") {
      if (posFrom == 56 && firstMovesRooks.white.left) {
        firstMovesRooks.white.left = false;
        console.log("La torre se movio");
      } else if (posFrom == 63 && firstMovesRooks.white.right)
        firstMovesRooks.white.right = false;
    } else {
      if (posFrom == 0 && firstMovesRooks.black.left)
        firstMovesRooks.black.left = false;
      else if (posFrom == 7 && firstMovesRooks.black.right)
        firstMovesRooks.black.right = false;
    }
  }
  movePieceElement(posFrom, to, color, pieceType);
  if(turn == "white"){
     turn = "black";
     console.log("black turn")
  }
  else {
    turn = "white";
    console.log("white turn")
  }
  removeHighlights();
};

const getAtrributesOfAPiece = (pos) => {
  if (isAPieceInThisPosition(pos)) {
    const pieceImg = board.children[pos].firstElementChild;
    return {
      position: pieceImg.getAttribute("data-position"),
      pieceType: pieceImg.getAttribute("data-piece"),
      color: pieceImg.getAttribute("data-color"),
    };
  }
};

const isTheKingIsOnCheck = (kingColor, kingPosition) => {
  for (let i = 0; i < 64; ++i) {
    if (isThisPieceInThisPositionWithTheColor("black")) {
      const { position, pieceType, color } = getAtrributesOfAPiece(i);
      let posibleMoves = calculateMove(position, pieceType, color);
      if (posibleMoves.indexOf(kingPosition) != -1) {
        return true;
      }
    } else {
      if (isThisPieceInThisPositionWithTheColor("white")) {
        const { position, pieceType, color } = getAtrributesOfAPiece(i);
        let posibleMoves = calculateMove(position, pieceType, color);
        if (posibleMoves.indexOf(kingPosition) != -1) {
          return true;
        }
      }
    }
  }

  return false;
};

const checkIfThisPositionIsBeingAttacked = (pos) => {
  for (let i = 0; i < 64; ++i) {
    if (turn == "white" && isThisPieceInThisPositionWithTheColor(pos,"black")) {
      const { position, pieceType, color } = getAtrributesOfAPiece(i);
      let posibleMoves = calculateMove(position, pieceType, color);
      if (posibleMoves.indexOf(kingPosition) != -1) {
        return true;
      }
    } else{
      if (isThisPieceInThisPositionWithTheColor("white")) {
        const { position, pieceType, color } = getAtrributesOfAPiece(i);
        let posibleMoves = calculateMove(position, pieceType, color);
        if (posibleMoves.indexOf(kingPosition) != -1) {
          return true;
        }
      }
    }
  }

  return false;
};

const calculateMove = (position, pieceType, pieceColor) => {
  let moves = [];

  const row = Math.floor(position / 8);
  const col = position % 8;

  console.log(`Position: ${position}, Row: ${row}, Col: ${col}`);
  if (pieceType === "pawn") {
    if (pieceColor === "white") {
      if (row === 0) return [];
      if (row === 6) {
        moves.push((row - 1) * 8 + col);
        if (
          !isAPieceInThisPosition((row - 1) * 8 + col) &&
          !isAPieceInThisPosition((row - 2) * 8 + col)
        )
          moves.push((row - 2) * 8 + col);
      } else {
        const nextPos = (row - 1) * 8 + col;
        if (!isAPieceInThisPosition(nextPos)) moves.push(nextPos);
      }
      if (
        isInRangeOfBoard(row - 1, col - 1) &&
        isAPieceInThisPosition((row - 1) * 8 + col - 1) &&
        !isThisPieceInThisPositionWithTheColor(
          (row - 1) * 8 + col - 1,
          pieceColor,
        )
      ) {
        moves.push((row - 1) * 8 + col - 1);
      }
      if (
        isInRangeOfBoard(row - 1, col + 1) &&
        isAPieceInThisPosition((row - 1) * 8 + col + 1) &&
        !isThisPieceInThisPositionWithTheColor(
          (row - 1) * 8 + col + 1,
          pieceColor,
        )
      ) {
        moves.push((row - 1) * 8 + col + 1);
      }
    } else {
      if (row === 7) return [];
      if (row === 1) {
        moves.push((row + 1) * 8 + col);
        if (
          !isAPieceInThisPosition((row + 1) * 8 + col) &&
          !isAPieceInThisPosition((row + 2) * 8 + col)
        )
          moves.push((row + 2) * 8 + col);
      } else {
        const nextPos = (row + 1) * 8 + col;
        if (!isAPieceInThisPosition(nextPos)) moves.push(nextPos);
      }
      if (
        isInRangeOfBoard(row + 1, col - 1) &&
        isAPieceInThisPosition((row + 1) * 8 + col - 1) &&
        !isThisPieceInThisPositionWithTheColor(
          (row + 1) * 8 + col - 1,
          pieceColor,
        )
      ) {
        moves.push((row + 1) * 8 + col - 1);
      }
      if (
        isInRangeOfBoard(row + 1, col + 1) &&
        isAPieceInThisPosition((row + 1) * 8 + col + 1) &&
        !isThisPieceInThisPositionWithTheColor(
          (row + 1) * 8 + col + 1,
          pieceColor,
        )
      ) {
        moves.push((row + 1) * 8 + col + 1);
      }
    }
  } else if (pieceType == "knight") {
    if (
      isInRangeOfBoard(row - 2, col - 1) &&
      !isThisPieceInThisPositionWithTheColor(
        (row - 2) * 8 + (col - 1),
        pieceColor,
      )
    )
      moves.push((row - 2) * 8 + (col - 1));
    if (
      isInRangeOfBoard(row - 2, col + 1) &&
      !isThisPieceInThisPositionWithTheColor(
        (row - 2) * 8 + (col + 1),
        pieceColor,
      )
    )
      moves.push((row - 2) * 8 + (col + 1));
    if (
      isInRangeOfBoard(row - 1, col - 2) &&
      !isThisPieceInThisPositionWithTheColor(
        (row - 1) * 8 + (col - 2),
        pieceColor,
      )
    )
      moves.push((row - 1) * 8 + (col - 2));
    if (
      isInRangeOfBoard(row - 1, col + 2) &&
      !isThisPieceInThisPositionWithTheColor(
        (row - 1) * 8 + (col + 2),
        pieceColor,
      )
    )
      moves.push((row - 1) * 8 + (col + 2));
    if (
      isInRangeOfBoard(row + 2, col - 1) &&
      !isThisPieceInThisPositionWithTheColor(
        (row + 2) * 8 + (col - 1),
        pieceColor,
      )
    )
      moves.push((row + 2) * 8 + (col - 1));
    if (
      isInRangeOfBoard(row + 2, col + 1) &&
      !isThisPieceInThisPositionWithTheColor(
        (row + 2) * 8 + (col + 1),
        pieceColor,
      )
    )
      moves.push((row + 2) * 8 + (col + 1));
    if (
      isInRangeOfBoard(row + 1, col - 2) &&
      !isThisPieceInThisPositionWithTheColor(
        (row + 1) * 8 + (col - 2),
        pieceColor,
      )
    )
      moves.push((row + 1) * 8 + (col - 2));
    if (
      isInRangeOfBoard(row + 1, col + 2) &&
      !isThisPieceInThisPositionWithTheColor(
        (row + 1) * 8 + (col + 2),
        pieceColor,
      )
    )
      moves.push((row + 1) * 8 + (col + 2));
  } else if (pieceType == "bishop") {
    moves = calcBishopMoves(row, col, pieceColor);
  } else if (pieceType == "rook") {
    moves = calcRookMoves(row, col, pieceColor);
  } else if (pieceType == "queen") {
    moves = [
      ...calcBishopMoves(row, col, pieceColor),
      ...calcRookMoves(row, col, pieceColor),
    ];
  } else if (pieceType == "king") {
    if (isInRangeOfBoard(row - 1, col - 1)) moves.push((row - 1) * 8 + col - 1);
    if (isInRangeOfBoard(row - 1, col + 1)) moves.push((row - 1) * 8 + col + 1);
    if (isInRangeOfBoard(row - 1, col)) moves.push((row - 1) * 8 + col);
    if (isInRangeOfBoard(row, col - 1)) moves.push(row * 8 + (col - 1));
    if (isInRangeOfBoard(row, col + 1)) moves.push(row * 8 + (col + 1));
    if (isInRangeOfBoard(row + 1, col + 1))
      moves.push((row + 1) * 8 + (col + 1));
    if (isInRangeOfBoard(row + 1, col - 1))
      moves.push((row + 1) * 8 + (col - 1));
    if (isInRangeOfBoard(row + 1, col)) moves.push((row + 1) * 8 + col);

    if (isTheFirstMoveOfTheWhiteKing && pieceColor == "white") {
      if (
        !isAPieceInThisPosition(row * 8 + col + 1) &&
        !isAPieceInThisPosition(row * 8 + col + 2) &&
        firstMovesRooks.white.right
      ) {
        moves.push(row * 8 + col + 1);
        moves.push(row * 8 + col + 2);
      }
      if (
        !isAPieceInThisPosition(row * 8 + col - 1) &&
        !isAPieceInThisPosition(row * 8 + col - 2) &&
        firstMovesRooks.white.left
      ) {
        moves.push(row * 8 + col - 1);
        moves.push(row * 8 + col - 2);
      }
    }
    if (isTheFirstMoveOfTheBlackKing && pieceColor == "black") {
      if (
        !isAPieceInThisPosition(row * 8 + col + 1) &&
        !isAPieceInThisPosition(row * 8 + col + 2) &&
        firstMovesRooks.black.right
      ) {
        moves.push(row * 8 + col + 1);
        moves.push(row * 8 + col + 2);
      }

      if (
        !isAPieceInThisPosition(row * 8 + col - 1) &&
        !isAPieceInThisPosition(row * 8 + col - 2) &&
        firstMovesRooks.black.left
      ) {
        moves.push(row * 8 + col - 1);
        moves.push(row * 8 + col - 2);
      }
    }
  }

  return moves;
};

let isAPieceBeingClicked = false;

const pieceActions = (pieceImg) => {
  pieceImg.addEventListener("dragstart", (e) => {
    pieceImg.classList.add("is-dragging");
    e.dataTransfer.setDragImage(pieceImg, 0, 0);
  });

  pieceImg.addEventListener("dragend", (e) => {
    pieceImg.classList.remove("is-dragging");
  });
};

let isDragging = false;

const fillFirstRow = (color = "white", offset = 0) => {
  const piecesOrder = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  for (let i = 0; i < piecesOrder.length; i++) {
    const pieceName = piecesOrder[i];
    const pieceImg = document.createElement("img");
    pieceImg.src = pieces[color][pieceName];
    pieceImg.classList.add("piece");
    pieceImg.setAttribute("data-piece", pieceName);
    pieceImg.setAttribute("data-color", color);
    pieceImg.setAttribute("data-position", offset + i);
    pieceImg.setAttribute("draggable", "true");
    board.children[offset + i].appendChild(pieceImg);
    pieceImg.addEventListener("dragstart", (e) => {
      pieceImg.classList.add("is-dragging");
      e.dataTransfer.setData(
        "text/plain",
        `${offset + i},${pieceName},${color}`,
      );
    });

    pieceImg.addEventListener("click", (e) => {
      if(turn != color) return 
      removeHighlights();
      calculateMove(
        pieceImg.getAttribute("data-position"),
        pieceName,
        color,
      ).forEach((move) => {
        board.children[move].classList.add("highlight");
      });
    });

    pieceImg.addEventListener("dragend", (e) => {
      pieceImg.classList.remove("is-dragging");
    });
  }
};

const fillPawnsRow = (color = "white", offset = 0) => {
  for (let i = 0; i < 8; ++i) {
    const pieceImg = document.createElement("img");
    pieceImg.src = pieces[color]["pawn"];
    pieceImg.classList.add("piece");
    board.children[offset + i].appendChild(pieceImg);
    pieceImg.classList.add("piece");
    pieceImg.setAttribute("data-piece", "pawn");
    pieceImg.setAttribute("data-color", color);
    pieceImg.setAttribute("data-position", offset + i);
    pieceImg.setAttribute("draggable", "true");
    pieceImg.addEventListener("dragstart", (e) => {
      pieceImg.classList.add("is-dragging");
      e.dataTransfer.setData("text/plain", `${offset + i},pawn,${color}`);
    });
    pieceImg.addEventListener("dragend", (e) => {
      pieceImg.classList.remove("is-dragging");
    });
    pieceImg.addEventListener("click", (e) => {
      if(turn != color) return 
      const possibleMoves = calculateMove(
        pieceImg.getAttribute("data-position"),
        "pawn",
        color,
      );
      removeHighlights();
      possibleMoves.forEach((move) => {
        board.children[move].classList.add("highlight");
      });
    });
  }
};

fillBoard();
fillFirstRow("black", 0);
fillPawnsRow("black", 8);
fillFirstRow("white", 56);
fillPawnsRow("white", 48);

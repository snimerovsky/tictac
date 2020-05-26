function roundHundred(value) {
  return Math.round(value / 100) * 100;
}

export const isWin = (id, isClass, allItems, winGame, winner, you, player) => {
  const win = () => {
    console.log("win", topBottom);
    winGame(winnerPlayer, you, player, blocksSuccess);
  };
  const WIN = 5;
  let topBottom = 1;
  let blocksSuccess = [allItems[id]];
  let startIdTopBottom = id - 100;
  let winnerPlayer = {};
  if (
    (winner.winner === true && you.cross === true) ||
    (winner.winner === false && you.cross === false)
  ) {
    winnerPlayer = you;
  }
  if (
    (winner.winner === true && player.cross === true) ||
    (winner.winner === false && player.cross === false)
  ) {
    winnerPlayer = player;
  }
  for (let i = 0; i < WIN; i++) {
    try {
      if (allItems[startIdTopBottom].classList.contains(isClass)) {
        topBottom += 1;
        blocksSuccess.push(allItems[startIdTopBottom]);
        startIdTopBottom -= 100;
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
  startIdTopBottom = id + 100;
  for (let i = 0; i < WIN; i++) {
    try {
      if (allItems[startIdTopBottom].classList.contains(isClass)) {
        topBottom += 1;
        blocksSuccess.push(allItems[startIdTopBottom]);
        startIdTopBottom += 100;
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
  if (topBottom >= WIN) win();
  blocksSuccess = [allItems[id]];
  topBottom = 1;
  let leftRight = 1;
  let startIdLeftBottom = id + 1;
  for (let i = 0; i < WIN; i++) {
    try {
      if (
        roundHundred(startIdLeftBottom) === roundHundred(id) &&
        allItems[startIdLeftBottom].classList.contains(isClass)
      ) {
        leftRight += 1;
        blocksSuccess.push(allItems[startIdLeftBottom]);
        startIdLeftBottom += 1;
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
  startIdLeftBottom = id - 1;
  for (let i = 0; i < WIN; i++) {
    try {
      if (
        roundHundred(startIdLeftBottom) === roundHundred(id) &&
        allItems[startIdLeftBottom].classList.contains(isClass)
      ) {
        leftRight += 1;
        blocksSuccess.push(allItems[startIdLeftBottom]);
        startIdLeftBottom -= 1;
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
  if (leftRight >= WIN) win();
  blocksSuccess = [allItems[id]];
  leftRight = 1;
  let topRight = 1;
  let startIdTopLeft = id - 99;
  for (let i = 0; i < WIN; i++) {
    try {
      if (allItems[startIdTopLeft].classList.contains(isClass)) {
        topRight += 1;
        blocksSuccess.push(allItems[startIdTopLeft]);
        startIdTopLeft -= 99;
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
  startIdTopLeft = id + 99;
  for (let i = 0; i < WIN; i++) {
    try {
      if (
        allItems[startIdTopLeft].classList.contains(isClass)
      ) {
        topRight += 1;
        blocksSuccess.push(allItems[startIdTopLeft]);
        startIdTopLeft += 99;
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
  if (topRight >= WIN) win();
  blocksSuccess = [allItems[id]];
  topRight = 1;
  let bottomRight = 1;
  let startIdbottomRight = id + 101;
  for (let i = 0; i < WIN; i++) {
    try {
      if (allItems[startIdbottomRight].classList.contains(isClass)) {
        bottomRight += 1;
        blocksSuccess.push(allItems[startIdbottomRight]);
        startIdbottomRight += 101;
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
  startIdbottomRight = id - 101;
  let startId = 100;
  for (let i = 0; i < WIN; i++) {
    try {
      if (
        roundHundred(startIdbottomRight) === roundHundred(id - startId) &&
        allItems[startIdbottomRight].classList.contains(isClass)
      ) {
        bottomRight += 1;
        blocksSuccess.push(allItems[startIdbottomRight]);
        startIdbottomRight -= 101;
        startId += 100;
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
  if (bottomRight >= WIN) win();
  blocksSuccess = [allItems[id]];
  bottomRight = 1;
};

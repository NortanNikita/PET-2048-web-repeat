// 1. Перемещение происходит только по 1 оси 
// 2. Если Это край перемещения не происходит
// 3. Если В клетке в которую ты перемещаешь есть цифра и она равна твоей они схлопываются в последней ячейке
// 4. Перемещение происходит от края в который ты свайпаешьй

const getRandomInt = (max = 3) => {
  return Math.floor(Math.random() * max);
}

function init(gameContainer = 'body', areaSize = 4) {
  const GAME_CONTAINER = document.querySelector(gameContainer); // some game container
  // ---- game props -----
  const AREA_SIZE = areaSize;
  const NUM_COLORS = {
    2: '#eee4da',
    4: '#eddfc9',
    8: '#f59563',
    16: '#f59563',
    32: '#fa7a5c',
    64: '#fb5c3c',
    128: '#f0ce6e',
    256: '#f2c770',
    512: '#efc851',
    1024: '#efc851',
    2048: '#e2bf49',
  }
  const flexCenter = `
    display: flex;
    align-items: center;
    justify-content: center;
  `
  // ---- /game props -----
  
  // ---- controls -----
  const controlsArr = ['left','right','up','down']
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = flexCenter + `
    width: 300px;
    height: 50px;
    gap: 10px;
  `;
  controlsArr.forEach((side) => {
    const button = document.createElement('button');
    button.classList.add(side)
    button.innerText = side
    buttonsContainer.appendChild(button)
  })
  GAME_CONTAINER.appendChild(buttonsContainer)
  // ---- /controls -----

  const container = document.createElement('div');
  container.classList.add('game-container');
  container.style.cssText = `
    display: grid;
    width: 300px;
    height: 300px;
    grid-template-rows: repeat(${AREA_SIZE}, 1fr);
    grid-template-columns: repeat(${AREA_SIZE}, 1fr);
    border: 5px solid #bbada0; border-radius: 5px;
  `;
  
  let cells = [];
  let looseCheck = false;
  // ---- functions -----
  
  const getRandomEmptyCell = () => {
    let pos = [getRandomInt(AREA_SIZE),getRandomInt(AREA_SIZE)];
    if(hasGameNum(pos)) {
      return getRandomEmptyCell();
    } else {
      return pos;
    }
  }
  const hasWinNum = () => {
    return cells.flatMap(item => (item)).some(item => item.num && item.num >= 2048)
  }
  const createArea = () => {
    for(var i = 0; i < AREA_SIZE; i++) {
      cells.push([]);
      for(let j = 0; j < AREA_SIZE; j++) {
        cells[i].push({});
        container.appendChild(createCell([i,j]));
      }
    }
    GAME_CONTAINER.appendChild(container);
  }
  const createCell = (position = [0, 0]) => {
    const cell = document.createElement('div');
    cell.classList.add(`cell`);
    cell.classList.add(`cell-${position[0]}-${position[1]}`);
    cell.style.cssText = flexCenter + `
      border: 5px solid #bbada0;
      background: #ccc0b3;
    `;
    return cell;
  }
  const hasCell = (position = [0, 0]) => {
    return !!cells[position[0]]?.[position[1]];
  }
  const hasGameNum = (position = [0, 0]) => {
    return !!cells[position[0]]?.[position[1]].num;
  }
  const setGameNum = (num, position = [0, 0]) => {
    const visualCell = document.querySelector(`.cell-${position[0]}-${position[1]}`);
    visualCell.innerText = num ? `${num}` : '';
    cells[position[0]][position[1]].num = num;
    visualCell.style.cssText = flexCenter + `
      border: 5px solid #bbada0;
      background: ${num ? NUM_COLORS[num] : '#ccc0b3'}`;
  }
  const getNewPosBySide = (oldPosition, swipeSide) => {
    switch(swipeSide) {
      case 'up':
        return oldPosition.map((item,index) => index === 0 ? item - 1 : item);
      case 'down':
        return oldPosition.map((item,index) => index === 0 ? item + 1 : item);
      case 'left':
        return oldPosition.map((item,index) => index === 0 ? item : item - 1);
      case 'right':
        return oldPosition.map((item,index) => index === 0 ? item : item + 1);
    }
  }
  const swipeHandler = (side) => {
    if (!side) return false;

    const cellsArray = document.querySelectorAll('.cell');
    
    let hasEmptyCell = false;
    
    for(let g = 0; g < AREA_SIZE; g++) { // ТУПО ЗАХАРДКОДИЛ, потому-что размер зоны это макс кол-во того что может схлопнуться за 1 свайп
      let cellsWithGameNum = []; // все ячейки с номерками
      cells.forEach((row, i) => {
        row.forEach((cell, j) => {
          if( hasGameNum([i,j]) ) {
            cellsWithGameNum.push({num: cell.num, position: [i,j]});
          }
        })
      })

      hasEmptyCell = !(cellsWithGameNum.length === cellsArray.length);
      
      let cellsWithGameNumBySide = (
        side === 'down' || side === 'right' ?
        cellsWithGameNum.reverse() : 
        cellsWithGameNum
      );

      cellsWithGameNumBySide.forEach(item => { // перебираю все ячейки которые заполнены
        let newPos = getNewPosBySide(item.position, side);
        let number = item.num;
        if(hasCell(newPos)) { // есть ли такая клетка
          if(hasGameNum(newPos)) { // есть ли в клетке номерок
            if(cells[newPos[0]][newPos[1]].num === number) { // равен ли номер в клетке номеру перемещаемого
              setGameNum(cells[newPos[0]][newPos[1]].num + number, newPos);
              setGameNum(null, item.position);
            } else {
              // разные номера столкнулись
            }
          } else { // в клетке в которую иду нет номера
            setGameNum(number, newPos);
            setGameNum(null, item.position);
          }
        }
      })
    }
    
    if (hasWinNum()) alert('u win');
    
    if (hasEmptyCell) {
      needLooseCheck = false;
      setGameNum(2, getRandomEmptyCell());
    } else {
      if (looseCheck) {
        alert('u loose');
      } else {
        looseCheck = true;
      }
    }
  }
  // ---- /functions -----

  // ---- create game -----
  createArea()
  setGameNum(4, [0,3])
  setGameNum(2, [2,2])
  
  document.querySelector('.up').addEventListener('click', swipeHandler.bind(null, 'up'))
  document.querySelector('.down').addEventListener('click', swipeHandler.bind(null, 'down'))
  document.querySelector('.left').addEventListener('click', swipeHandler.bind(null, 'left'))
  document.querySelector('.right').addEventListener('click', swipeHandler.bind(null, 'right'))
  // ---- /create game -----
}
init()
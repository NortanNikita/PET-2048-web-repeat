// Игровой флоу по оси Y 
// Если я делаю свайп вверх или вниз:
// 1. Перемещение происходит только по i (по строкам)
// 2. Если Это край перемещения не происходит
// 3. Если В клетке в которую ты перемещаешь есть цифра и она равна твоей они схлопываются в последней ячейке
// 4. Перемещение происходит От края в который ты свайпаешь,
//    если свайпаешь вверх то перемещение начинается с самой верхней цифры,
//    если вниз то с самой нижней

// нужна проверка есть ли пустые слоты hasEmptyCell
// Добавлять новую цифру если hasEmptyCell === true - после свайпа 
// Проверять игру на победу - если есть поле с числом 2048 после свайпа
// Проверять игру на проигрышь - hasEmptyCell === false и свайп произошел

function init(gameContainer = 'body', areaSize = 4) {
  const GAME_CONTAINER = document.querySelector(gameContainer); // some game container
  // ---- game props -----
  const AREA_SIZE = areaSize;
  // ---- /game props -----
  
  // ---- controls -----
  const controlsArr = ['left','right','up','down']
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    width: 300px;
    height: 50px;
    align-items: center;
    gap: 10px;
    justify-content: center;
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
    border: 2px solid black;border-radius: 5px;
  `;
  
  let cells = [];
  let looseCheck = false;
  // ---- functions -----
  const getRandomInt = (max = 3) => {
    return Math.floor(Math.random() * max);
  }
  const getRandomEmptyCell = () => {
    let pos = [getRandomInt(4),getRandomInt(4)];
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
    cell.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid black;
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
    switch (num) {
      case 2:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #eee4da;`;
        break;
      case 4:
        visualCell.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid black;
        background: #eddfc9;`;
        break;
      case 8:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #f59563;`;
        break;
      case 16:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #f59563;`;
        break;
      case 32:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #fa7a5c`;
        break;
      case 64:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #fb5c3c`;
        break;
      case 128:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #f0ce6e`;
        break;
      case 256:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #f2c770`;
        break;
      case 512:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #efc851`;
        break;
      case 1024:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #efc851`;
        break;
      case 2048:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #e2bf49`;
        break;
      default:
        visualCell.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid black;
          background: #ccc0b3`;
        break;
    }
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
      console.log('hasEmptyCell')
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
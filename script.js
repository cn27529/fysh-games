const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const width = 20; // 每行 20 個格子
let score = 0;

// 0 - 豆子, 1 - 牆壁, 2 - 空地
const layout = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,
    1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1,
    1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,
    1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];

const squares = [];

// 繪製地圖
function createBoard() {
    for (let i = 0; i < layout.length; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        squares.push(square);

        if (layout[i] === 1) {
            squares[i].classList.add('wall');
        } else if (layout[i] === 0) {
            squares[i].classList.add('pac-dot');
        }
    }
}
createBoard();

// 小精靈初始位置
let pacmanCurrentIndex = 21;
squares[pacmanCurrentIndex].classList.add('pac-man');

// 移動邏輯
function movePacman(e) {
    squares[pacmanCurrentIndex].classList.remove('pac-man');

    switch(e.keyCode) {
        case 37: // 左
            if(pacmanCurrentIndex % width !== 0 && !squares[pacmanCurrentIndex -1].classList.contains('wall')) 
                pacmanCurrentIndex -= 1;
            break;
        case 38: // 上
            if(pacmanCurrentIndex - width >= 0 && !squares[pacmanCurrentIndex -width].classList.contains('wall')) 
                pacmanCurrentIndex -= width;
            break;
        case 39: // 右
            if(pacmanCurrentIndex % width < width - 1 && !squares[pacmanCurrentIndex +1].classList.contains('wall')) 
                pacmanCurrentIndex += 1;
            break;
        case 40: // 下
            if(pacmanCurrentIndex + width < width * width && !squares[pacmanCurrentIndex +width].classList.contains('wall')) 
                pacmanCurrentIndex += width;
            break;
    }
    
    squares[pacmanCurrentIndex].classList.add('pac-man');
    eatDot();
}

// 吃豆子
function eatDot() {
    if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
        score++;
        scoreDisplay.innerHTML = `分數: ${score}`;
        squares[pacmanCurrentIndex].classList.remove('pac-dot');
    }
}

document.addEventListener('keydown', movePacman);
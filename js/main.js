const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const score = document.getElementById('score');
let blocksArr;

const easy = document.getElementById('easy');
const hard = document.getElementById('hard');
const impossible = document.getElementById('impossible');

easy.addEventListener('click', () => {
    GameSettings.difficulty = 'easy';
    GameSettings.blocksCount = 15; // default
    GameSettings.speed = 5;
    stats.multi = 1;
});
hard.addEventListener('click', () => {
    GameSettings.difficulty = 'hard';
    GameSettings.blocksCount = 25;
    GameSettings.speed = 7;
    stats.multi = 2;
});
impossible.addEventListener('click', () => {
    GameSettings.difficulty = 'impossible';
    GameSettings.blocksCount = 35;
    GameSettings.speed = 9;
    stats.multi = 5;
});



const startButton = document.getElementById('startButton');
startButton.addEventListener('click', handleStartButton);

window.onresize = resizePixels;
function resizePixels() {
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}
resizePixels();

const GameSettings = {
    init: false, // only init once
    status: '',
    difficulty: 'easy',
    blockColor: 'black',
    blocksCount: 15,
    blockSize: {
        width: 20,
        height: 20,
    },
    speed: 5,
    gamepiece: {
        width: 20,
        height: 20,
        color: 'blue',
        x: canvas.width / 2 - 10,
        y: canvas.height - 100,
        speed: 5
    }
}
const controller = {
    left: false,
    right: false,
    up: false,
    down: false
}
const stats = {
    multi: 1,
    score: 0,
    hits: 0
}

function Block(x, y) {
    return {
        x: x,
        y: y,
        w: GameSettings.blockSize.width,
        h: GameSettings.blockSize.height
    }
}

// create blocks


function createBlocks(qtyOfBlocks, canvasWidth, blockSize) {
    const blocksArr = [];
    for (let i = 0; i < qtyOfBlocks; i++) {
        blocksArr.push(Block(
            randomNumber(0, canvasWidth) - blockSize.width, // set random X location, betweem two numbers
            randomNumber(-700, 0 - blockSize.height),       // set random Y location between two numbers
        ))
    }
    return blocksArr;
}

function drawBlocks(blocks, ctx, undefined, color) {
    ctx.fillStyle = color;
    blocks.forEach(block => {
        ctx.fillRect(
            block.x,
            block.y,
            block.w,
            block.h
        )
    })
}

function moveBlocks(blocks, speed, canvas) {
    // for each block, increase Y value by speed

    blocks.forEach(block => {
        if (block.y > canvas.height) {
            block.x = randomNumber(0, canvas.width - block.w);
            block.y = randomNumber(-300, 0);
        }
        block.y += speed
    });
}




// Gamepiece

function drawGamePiece(ctx, gamepiece) {
    if (controller.left) {
        gamepiece.x -= gamepiece.speed;
    }
    if (controller.right) {
        gamepiece.x += gamepiece.speed;
    }
    if (controller.up) {
        gamepiece.y -= gamepiece.speed;
    }
    if (controller.down) {
        gamepiece.y += gamepiece.speed;
    }
    if (gamepiece.x > canvas.width) {
        gamepiece.x = 0 - gamepiece.width;
    }
    if (gamepiece.x + gamepiece.width < 0) {
        gamepiece.x = canvas.width;
    }
    if (gamepiece.y > canvas.height) {
        gamepiece.y = 0 - gamepiece.height;
    }
    if (gamepiece.y + gamepiece.height < 0) {
        gamepiece.y = canvas.height;
    }
    ctx.fillStyle = gamepiece.color;
    ctx.fillRect(gamepiece.x, gamepiece.y, gamepiece.width, gamepiece.height);
}
drawGamePiece(ctx, GameSettings.gamepiece);

function collisionDetection(gamepiece, blocks) {
    //check gamepiece against blocks

    const { x, y, width, h } = gamepiece;

    blocks.forEach((block, index) => {
        if (
            ((x >= block.x && x <= block.x + block.w) || (x + width >= block.x && x + width <= block.x + block.w)) &&
            (y >= block.y && y < block.y + block.h)
        ) {
            restartGame();
            // block.y = 0 - block.h;
            // block.x = randomNumber(0, canvasWidth - block.w);
            // stats.hits++;
        }
    });


}

function keyListener(e) {

    let key_state = e.type === 'keydown' ? true : false;
    switch (e.key) {
        case "ArrowRight":
            controller.right = key_state;
            break;
        case "ArrowLeft":
            controller.left = key_state;
            break;
        case "ArrowUp":
            controller.up = key_state;
            break;
        case "ArrowDown":
            controller.down = key_state;
            break;
        default:
            break;
    }
}

let loop;
function initGame() {
    GameSettings.init = true;
    GameSettings.blockColor = 'black';
    GameSettings.blockSize = {
        width: 20,
        height: 20,
    };
    GameSettings.gamepiece = {
        width: 20,
        height: 20,
        color: 'blue',
        x: canvas.width / 2,
        y: canvas.height - 100,
        speed: 5
    };
    stats.score = 0;
    blocksArr = createBlocks(GameSettings.blocksCount, canvas.clientWidth, GameSettings.blockSize);
    startGame();

}
function startGame() {
    canvas.focus({ preventScroll: true });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loop = requestAnimationFrame(startGame);
    drawBlocks(blocksArr, ctx, GameSettings.blockSize, GameSettings.blockColor);
    collisionDetection(GameSettings.gamepiece, blocksArr);
    moveBlocks(blocksArr, GameSettings.speed, canvas);
    drawGamePiece(ctx, GameSettings.gamepiece);
    updateScore();
}


window.addEventListener('keydown', keyListener);
window.addEventListener('keyup', keyListener);


// let updateScoreInterval = setInterval(updateScore, 1000);
function updateScore() {
    stats.score += (1 * stats.multi);
    if (GameSettings.difficulty === 'easy') {
        score.innerText = `Score: ${stats.score}`;
    } else {
        score.innerText = `Score: ${stats.score} X${stats.multi}`;
    }

}

function restartGame() {
    // reset everything!!!
    cancelAnimationFrame(loop);

    startButton.innerText = 'start game';
    GameSettings.status = '';
    GameSettings.init = false;
    ctx.font = '40px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'red';
    ctx.fillText(`Game Over`, canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = '#0069ed';
    ctx.fillText(`Final Score: ${stats.score}`, canvas.width / 2, canvas.height / 2 + 90);


}
function handleStartButton() {
    if (!GameSettings.init) {
        // initialize game
        initGame();
        GameSettings.init = true; //prevent initialzing more than once
        GameSettings.status = 'started';
        startButton.innerText = 'pause game';
    } else {
        changeStartButton();
    }
}
function changeStartButton() {
    if (GameSettings.status === 'started') {
        startButton.innerText = 'start game';
        GameSettings.status = 'paused';
        cancelAnimationFrame(loop);

    } else {
        startButton.innerText = 'start game';
        GameSettings.status = 'started';
        startButton.innerText = 'pause game';
        startGame();
    }
}




// CURRENT BUGS

// YOU CAN START GAME ON EASY AND THEN HIT IMPOSSIBLE TO GET THE X5 MULTIPLYER WITHOUT INCREASED BLOCKS, SPEED DOES INCREASE THOUGH!
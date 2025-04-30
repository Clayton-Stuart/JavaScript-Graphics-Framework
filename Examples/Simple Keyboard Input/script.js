var x = 50;
var y = 52;
// var floorY = 52;
var jumping = false;
var keyEvents = setInterval(executeKeyEvents,30);
var jumpHeight = 15;
var jumpDuration = 15;
var falling = false;
var gridWidth;
var gridHeight;


let manArray = [
    ["transparent", "#610091", "#610091", "#610091", "transparent"],
    ["transparent", "#610091", "#610091", "#610091", "transparent"],
    ["transparent", "#610091", "#610091", "#610091", "transparent"],
    ["transparent", "transparent", "#610091", "transparent", "transparent"],
    ["transparent", "#610091", "#610091", "#610091", "transparent"],
    ["#610091", "transparent", "#610091", "transparent", "#610091"],
    ["transparent", "transparent", "#610091", "transparent", "transparent"],
    ["transparent", "transparent", "#610091", "transparent", "transparent"],
    ["transparent", "#610091", "transparent", "#610091", "transparent"],
    ["transparent", "#610091", "transparent", "#610091", "transparent"],
    ["transparent", "#610091", "transparent", "#610091", "transparent"],
];

// let manArray = [["yellow","yellow","yellow","yellow","yellow","yellow","yellow"],["yellow","blue","blue","yellow","blue","blue","yellow"],["yellow","blue","blue","yellow","blue","blue","yellow"],["yellow","yellow","yellow","yellow","yellow","yellow","yellow"],["yellow","blue","yellow","yellow","yellow","blue","yellow"],["yellow","yellow","blue","blue","blue","yellow","yellow"],["yellow","yellow","yellow","yellow","yellow","yellow","yellow"]]


let manWidth = manArray[0].length;
let manHeight = manArray.length;

window.addEventListener("DOMContentLoaded", (event) => {
    // init("grid", [1000, 700], 130, true, false); //background 3
    init("grid", [1000, 700], 80, true, false); // backgrounds 1 and 2
    registerEntity("man", manArray);
    setBackgroundImage("grid", background2);
    drawEntity("grid", "man", x, y);
    gridWidth = returnGridSize('grid').pixelAmountWidth;
    gridHeight = returnGridSize('grid').pixelAmountHeight;
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function executeKeyEvents() {
    if (allPressedKeys.includes(' ') || allPressedKeys.includes('ArrowUp') || allPressedKeys.includes('w')) {
        jump();
    }
    if (allPressedKeys.includes('a') || allPressedKeys.includes('ArrowLeft')) {
        left();
    }
    if (allPressedKeys.includes('d') || allPressedKeys.includes('ArrowRight')) {
        right();
    }
}

function checkBelow(pixelArray, color){
    if (getColors(pixelArray).includes(color)) {
        return true;
    }
    return false;
}

async function jump() {
    if (jumping || falling) {
        return;
    }
    falling = true;
    jumping = true;
    y += 1;
    drawEntity("grid", "man", x, y);
    for (let i = 0; i < jumpHeight; i++) {
        if (checkBelow(grabBlock('grid', x+1, y-1, x-1+manWidth, y-1), 'yellowgreen')) {
            break;
        }
        revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
        if (y > 0) {
            y -= 1;
        }
        drawEntity("grid", "man", x, y);
        await sleep(jumpDuration);

    }
    while (!(checkBelow(grabBlock('grid', x+1, y, x + manWidth - 1, y + manHeight), 'yellowgreen'))) {
        revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
        y += 1;
        drawEntity("grid", "man", x, y);
        await sleep(jumpDuration);
    }
    falling = false;
    jumping = false;
}

async function left() {
    if (checkBelow(grabBlock('grid', x, y, x, y + manHeight - 1), 'yellowgreen')) {
        return 0;
    }
    revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
    if (x > 0) {
        x -= 1;
    }
    drawEntity("grid", "man", x, y);
    if (!(falling)) {
        falling = true;
        fall();
        falling = false;
    }
}

async function right() {
    if (checkBelow(grabBlock('grid', x + manWidth - 1, y, x + manWidth - 1, y + manHeight - 1), 'yellowgreen')) {
        
        return 0;
    }
    revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
    if (x < gridWidth - 1 - manWidth)  {
        x += 1;
    }
    drawEntity("grid", "man", x, y);
    if (!(falling)) {
        falling = true;
        fall();
        falling = false;
    }
}

async function fall() {
    while (!(checkBelow(grabBlock('grid', x+1, y, x + manWidth - 1, y + manHeight), 'yellowgreen')) ) {
        revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
        y += 1;
        drawEntity("grid", "man", x, y);
        await sleep(jumpDuration);
    }
}
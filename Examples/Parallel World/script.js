var x = 15;
var y = 83;
var x_save = 15;
var y_save = 83;
var jumping = false;
var jumpHeight = 15;
var jumpDuration = 20;
var falling = false;
var gridWidth;
var gridHeight;
var keyEvents = setInterval(executeKeyEvents, 30);
var colorChecker;
var manHeight;
var manWidth;
var curBackground = 0;
var world;
var spawn = [15, 83, 0]




window.addEventListener('DOMContentLoaded', (event) => {
    manWidth = man[0].length;
    manHeight = man.length;
    
    
    world = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10];
    init('grid', [900, 700], 100, true, false);
    console.log(returnGridSize('grid'));
    setBackgroundImage('grid', world[curBackground]);
    registerEntity('man', man)
    
    gridWidth = returnGridSize('grid').pixelAmountWidth;
    gridHeight = returnGridSize('grid').pixelAmountHeight;
    drawEntity("grid", "man", x, y);
    colorChecker = setInterval(checkColorContact, 30)
    fall();
    
});

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
    while (!(checkBelow(grabBlock('grid', x, y, x + manWidth - 1, y + manHeight), 'yellowgreen'))) {
        revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
        y += 1;
        drawEntity("grid", "man", x, y);
        await sleep(jumpDuration);
    }
    
    falling = false;
    jumping = false;
}

async function left() {
    if (!(getColors(grabBlock('grid', x-1, y, x-1, y + manHeight - 1)).includes('yellowgreen'))) {
        if (x > 1) {
            revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight - 1));
            x -= 1;
            drawEntity("grid", "man", x, y);
        }
        else {
            previousBackground();
        }
    }

    else {
        let wall = getColors(grabBlock('grid', x-1, y, x-1, y + manHeight - 1));
        wall.pop();

        if (!(wall.includes('yellowgreen'))) {
            if (x > 1){
                revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
                x -= 1;
                y -= 1;
                drawEntity("grid", "man", x, y);
            }
        
            else {
                previousBackground();
            }
        }
        else {
            wall.pop();
            if (!(wall.includes('yellowgreen'))) {
                if (x > 1){
                    revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
                    x -= 1;
                    y -= 2;
                    drawEntity("grid", "man", x, y);
                }
                else {
                    previousBackground();
                }
            }
        }
            
    }
    if (!(falling)) {
        falling = true;
        fall();
        falling = false;
    }

}

async function right() {
    if (!(getColors(grabBlock('grid', x + manWidth, y, x + manWidth, y + manHeight - 1)).includes('yellowgreen'))) {
        if (x < gridWidth - 1 - manWidth){
            revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
            x += 1;
            drawEntity("grid", "man", x, y);
        }
        else {
            nextBackground();
        }
    }


    else {
        let wall = getColors(grabBlock('grid', x + manWidth, y, x + manWidth, y + manHeight - 1));
        wall.pop();

        if (!(wall.includes('yellowgreen'))) {
            if (x < gridWidth - 1 - manWidth){
                revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
                x += 1;
                y -= 1;
                drawEntity("grid", "man", x, y);
            }
            else {
                nextBackground();
            }
        }
        else {
            wall.pop();
            if (!(wall.includes('yellowgreen'))) {
                if (x < gridWidth - 1 - manWidth){
                    revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
                    x += 1;
                    y -= 2;
                    drawEntity("grid", "man", x, y);
                }
                else {
                    nextBackground();
                }
            }

        }
        

    }
    if (!(falling)) {
        falling = true;
        fall();
        falling = false;
    }
    // changeBlockColor(grabBlock('grid', x + manWidth, y, x + manWidth, y + manHeight - 1), 'pink');
}

async function fall() {
    while (!(checkBelow(grabBlock('grid', x, y, x + manWidth - 1, y + manHeight), 'yellowgreen')) && (y < (gridHeight - manHeight - 1))) {
        revertBlock(grabBlock('grid', x, y, x + manWidth, y + manHeight));
        y += 1;
        drawEntity("grid", "man", x, y);
        await sleep(jumpDuration*2);
    }
}

// function checkDead() {
//     if (getColors(grabBlock('grid', x-1, y-1, x + manWidth, y + manHeight)).includes('red')) {
//         reset();
//     }
// }

function checkColorContact() {
    let box = getColors(grabBlock('grid', x, y-1, x + manWidth - 1, y + manHeight));
    if (box.includes('red')) {
        reset();
    }
    if (box.includes('yellow')) {
        spawn[0] = x;
        spawn[1] = y;
        spawn[2] = curBackground;
    }
    if (box.includes('purple')) {
        nextBackground2();
    }
}

function reset() {
    curBackground = spawn[2];
    setBackgroundImage('grid', world[curBackground]);
    x = spawn[0];
    y = spawn[1];
    drawEntity('grid','man', x, y);
}

function nextBackground() {
    if (curBackground == world.length - 1) {
        return;
    }
    x = 1;
    curBackground += 1;
    setBackgroundImage('grid', world[curBackground]);
    drawEntity('grid','man', x, y);
}

function nextBackground2() {
    if (curBackground == world.length - 1) {
        return;
    }
    curBackground += 1;
    setBackgroundImage('grid', world[curBackground]);
    drawEntity('grid','man', x, y);
}

function previousBackground() {
    if (curBackground == 0) {
        return;
    }
    x = gridWidth - manWidth - 1;
    curBackground -= 1;
    setBackgroundImage('grid', world[curBackground]);
    drawEntity('grid','man', x, y);
}
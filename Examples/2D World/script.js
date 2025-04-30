var x;
var y;
var gridWidth;
var gridHeight;
var characterWidth;
var characterHeight;
var curBackground = [0, 0];
var world;
var entityBlocks;
var keyEvents = setInterval(executeKeyEvents, 50);
var walls = [
    [0, 0, 2, 26], // top left left - 0
    [3, 0, 26, 2], // top left top - 1
    [43, 0, 69, 2], // top right top - 2
    [67, 3, 69, 26], // top right right - 3
    [67, 43, 69, 69], //bottom right right - 4 
    [43, 67, 66, 69], // bottom right bottom - 5
    [0, 43, 2, 69], // bottom left left - 6
    [3, 67, 26, 69]]; // bottom left bottom - 7

// register entities
registerEntity('rock', rock);
registerEntity('character', character);



window.addEventListener('DOMContentLoaded', (event) => {
    world = [
        [[base, start]]
    ];

    init('grid', [770, 770], 70, false, true);
    gridHeight = returnGridSize('grid').pixelAmountHeight;
    gridWidth = returnGridSize('grid').pixelAmountWidth;
    characterHeight = character.length;
    characterWidth = character[0].length;
    x = gridWidth / 2 - characterWidth / 2;
    y = gridHeight / 2 - characterHeight / 2;
    changeBackground(world[curBackground[0]][curBackground[1]][1]);
});

function changeBackground(commands) {
    entityBlocks = [];
    setBackgroundImage('grid', world[curBackground[0]][curBackground[1]][0]);
    drawEntity('grid', 'character', x, y);
    for (let i = 0; i < commands[0].length; i++) {
        drawEntity('grid', commands[0][i][0], commands[0][i][1], commands[0][i][2]);
    }
    for (let i = 0; i < commands[1].length; i++) {
        entityBlocks.push(commands[1][i]);
    }
    walls = commands[2];
}

function executeKeyEvents() {
    if (allPressedKeys.includes('w') || allPressedKeys.includes('ArrowUp')) {
        up();
    }
    if (allPressedKeys.includes('a') || allPressedKeys.includes('ArrowLeft')) {
        left();
    }
    if (allPressedKeys.includes('d') || allPressedKeys.includes('ArrowRight')) {
        right();
    }
    if (allPressedKeys.includes('s') || allPressedKeys.includes('ArrowDown')) {
        down();
    }
}

function upBackground() {
    if (curBackground[0] > 0) {
        curBackground[0]--;
    }
    setBackgroundImage('grid', world[curBackground[0]][curBackground[1]]);
}

function downBackground() {
    if (curBackground[0] < world.length - 2) {
        curBackground[0]++;
    }
    setBackgroundImage('grid', world[curBackground[0]][curBackground[1]]);
}

function leftBackground() {
    if (curBackground[1] > 0) {
        curBackground[1]--;
    }
    setBackgroundImage('grid', world[curBackground[0]][curBackground[1]]);
}

function rightBackground() {
    if (curBackground[1] < world[0].length - 2) {
        curBackground[1]++;
    }
    setBackgroundImage('grid', world[curBackground[0]][curBackground[1]]);
}

function rectanglesCollide(box1, box2) { // x1, y1, x2, y2
    let rect1 = {x: box1[0], y: box1[1], width: box1[2] - box1[0], height: box1[3] - box1[1]}
    let rect2 = {x: box2[0], y: box2[1], width: box2[2] - box2[0], height: box2[3] - box2[1]};

    if (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.height + rect1.y > rect2.y
    ) {
        return true;
    }
    return false;
    
}

function right() {
    x += 1;
    newCharRect = [x, y-1, x + characterWidth, y + characterHeight];
    let tracker = 0;
    if (
        x-1 > gridWidth - 1 - characterWidth ||
        tracker > 0 ||
        rectanglesCollide(newCharRect, walls[2]) || 
        rectanglesCollide(newCharRect, walls[3]) || 
        rectanglesCollide(newCharRect, walls[4]) || 
        rectanglesCollide(newCharRect, walls[5])){
        x -= 1
        return 0;
    }
    for (let i = 0; i < entityBlocks.length; i++) {
        tracker += rectanglesCollide(newCharRect, entityBlocks[i]);
    }
    if (tracker > 0) {
        x -= 1;
        return 0;
    }

    revertBlock(grabBlock('grid', x-1, y, x-1+characterWidth-1, y+characterHeight-1));
    drawEntity('grid', 'character', x, y);
    
}

function left() {
    x-=1;
    newCharRect = [x-1, y-1, x + characterWidth, y + characterHeight];
    let tracker = 0;
    if (
        x < 0 ||
        tracker > 0 ||
        rectanglesCollide(newCharRect, walls[0]) || 
        rectanglesCollide(newCharRect, walls[1]) || 
        rectanglesCollide(newCharRect, walls[6]) || 
        rectanglesCollide(newCharRect, walls[7])){
        x += 1
        return 0;
    }
    for (let i = 0; i < entityBlocks.length; i++) {
        tracker += rectanglesCollide(newCharRect, entityBlocks[i]);
    }
    if (tracker > 0) {
        x += 1;
        return 0;
    }
    revertBlock(grabBlock('grid', x+1, y, x+1+characterWidth-1, y+characterHeight-1));
    drawEntity('grid', 'character', x, y);
}

function down() {
    y+=1;
    newCharRect = [x-1, y-1, x + characterWidth, y + characterHeight];
    let tracker = 0;
    if (
        y > gridHeight - characterHeight ||
        rectanglesCollide(newCharRect, walls[4]) || 
        rectanglesCollide(newCharRect, walls[5]) || 
        rectanglesCollide(newCharRect, walls[6]) || 
        rectanglesCollide(newCharRect, walls[7])){
        y -= 1
        return 0;
    }
    for (let i = 0; i < entityBlocks.length; i++) {
        tracker += rectanglesCollide(newCharRect, entityBlocks[i]);
    }
    if (tracker > 0) {
        y -= 1;
        return 0;
    }
    revertBlock(grabBlock('grid', x, y-1, x+characterWidth - 1, y+characterHeight-1));
    drawEntity('grid', 'character', x, y);
}

function up() {
    y-=1;
    newCharRect = [x-1, y-1, x + characterWidth, y + characterHeight];
    let tracker = 0;
    if (
        y < 0 ||
        rectanglesCollide(newCharRect, walls[1]) || 
        rectanglesCollide(newCharRect, walls[2]) || 
        rectanglesCollide(newCharRect, walls[3]) || 
        rectanglesCollide(newCharRect, walls[4])){
        y += 1
        return 0;
    }
    for (let i = 0; i < entityBlocks.length; i++) {
        tracker += rectanglesCollide(newCharRect, entityBlocks[i]);
    }
    if (tracker > 0) {
        y += 1;
        return 0;
    }
    revertBlock(grabBlock('grid', x, y, x+characterWidth - 1, y+characterHeight));
    drawEntity('grid', 'character', x, y);
}

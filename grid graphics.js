var entityList = [];
var allPressedKeys = [];
const cellClickEvent = new CustomEvent('cellClick', { detail: null });

function HTMLCollectionToList(collection) {
    let ls = [];
    for (let i = 0; i < collection.length; i++) {
        ls.push(collection[i]);
    }
    return ls;
}


function init(id, size, gridSize, forceSquare = false, debug = false) {
    let newGrid = document.getElementById(id);
    if (newGrid.nodeName != "DIV") {
        throw new Error("Element is not a div");
    }


    newGrid.innerHTML = "";
    newGrid.setAttribute('style', '');
    newGrid.setAttribute('onclick', '');
    
    newGrid.classList.add('grid');
    

    newGrid.style.width = size[0] + 'px';
    newGrid.style.height = size[1] + 'px';
    
    for (let i = 0; i < gridSize; i++) {
        let newRow = document.createElement("div");
        let gridHeight = size[1];
        let rowHeight = gridHeight / gridSize;
        newRow.style.height = rowHeight + "px";
        if (debug) {
            if (i % 2 == 0){
                newRow.style.backgroundColor = "black";
            }
            else {
                newRow.style.backgroundColor = "grey";
            }
        }
        
        newRow.style.display = 'flex';
        newRow.style.flexDirection = 'row';
        newRow.style.justifyContent = 'left';
        newRow.style.margin = '0';
    
        newGrid.appendChild(newRow);
        
    }
    
    if (forceSquare) {
        let rows = newGrid.children;
        let pixelHeight = rows[0].offsetHeight;
        let pixelAmount = Math.trunc(rows[0].offsetWidth / pixelHeight);
        let pixelWidth = pixelHeight;
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < pixelAmount; j++) {
                let newPixel = document.createElement("div");
                newPixel.setAttribute('default-color', 'white');
                newPixel.style.width = pixelWidth + "px";
                newPixel.style.height = pixelHeight + "px";
                
                if (debug) {
                    if ((j+i) % 3 == 0) {
                        newPixel.style.backgroundColor = "red";
                    }
                    else if ((i+j) % 3 == 1) {
                        newPixel.style.backgroundColor = "green";
                    }
                    else {
                        newPixel.style.backgroundColor = "blue";
                    }
                }
                rows[i].appendChild(newPixel);
    }}}

    else {
        let rows = newGrid.children;
        let pixelHeight = rows[0].offsetHeight;
        let pixelAmount = rows[0].offsetWidth / pixelHeight;
        let pixelWidth = pixelHeight;
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < pixelAmount; j++) {
                let newPixel = document.createElement("div");
                newPixel.setAttribute('default-color', 'white');
                newPixel.style.width = pixelWidth + "px";
                newPixel.style.height = pixelHeight + "px";
                
            if (debug){
                if ((j+i) % 3 == 0) {
                    newPixel.style.backgroundColor = "red";
                }
                else if ((i+j) % 3 == 1) {
                    newPixel.style.backgroundColor = "green";
                }
                else {
                    newPixel.style.backgroundColor = "blue";
                }
            }
                rows[i].appendChild(newPixel);
}}}}


function getPressedKeys() {
    return allPressedKeys;
}


function clearGrid(id) {
    if (document.getElementById(id).nodeName!= "DIV" || !(document.getElementById(id).classList.contains('grid'))) {
        console.log("Element is not a div or not a grid");
        return 0;
    }
    let rows = document.getElementById(id).children;
    for (let i = 0; i < rows.length; i++) {
        let rows2 = rows[i].children;
        rows[i].style.backgroundColor = "";
        for (let j = 0; j < rows2.length; j++) {
            rows2[j].style.backgroundColor = "";
            rows2[j].setAttribute('default-color', 'white')

        }
    }
}


function debugGrid(id) {
    if (document.getElementById(id).nodeName!= "DIV" ||!(document.getElementById(id).classList.contains('grid'))) {
        console.log("Element is not a div or not a grid");
        return 0;
    }

    let rows = document.getElementById(id).children;
    let colors3 = ["red", "green", "blue"];
    let colors2 = ["black", "grey"];
    for (let i = 0; i < rows.length; i++) {
        let rows2 = rows[i].children;
        rows[i].style.backgroundColor = colors2[i%2];
        for (let j = 0; j < rows2.length; j++) {
            rows2[j].style.backgroundColor = colors3[(j+i) % 3];    
}}}


function grabPixel(id, x, y) {
    let grid = document.getElementById(id);
    let rows = grid.children;
    return rows[y].children[x];
}


function grabBlock(id, x1, y1, x2, y2) {
    let grid = document.getElementById(id);
    let finalArray = [];
    let vals = [];
    if (x1 <= x2) {
        vals.push(x1);
        vals.push(x2);
    }
    else {
        vals.push(x2);
        vals.push(x1);
    }
    if (y1 <= y2) {
        vals.push(y1);
        vals.push(y2);
    }
    else {
        vals.push(y2);
        vals.push(y1);
    }
    let rows = grid.children;
    for (let i = vals[2]; i <= vals[3]; i++) {
        let curRow = [];
        for (let j = vals[0]; j <= vals[1]; j++) {
            curRow.push(rows[i].children[j]);
        }
        finalArray.push(curRow);
    }
    return finalArray;

}


function revertBlock(pixelArray) {
    for (let i = 0; i < pixelArray.length; i++) {
        for (let j = 0; j < pixelArray[i].length; j++) {
            pixelArray[i][j].style.backgroundColor = pixelArray[i][j].getAttribute('default-color');
        }
    }
}



function changeBlockColor(pixelArray, color) {
    for (let i = 0; i < pixelArray.length; i++) {
        for (let j = 0; j < pixelArray[i].length; j++) {
            pixelArray[i][j].style.backgroundColor = color;
        
}}}


function registerEntity(name, colorArray) {
    let newEntity = [];
    if ((entityList.includes(name))) {
        return 0;
    }

    entityList.push(name);
    newEntity.push(colorArray.length);
    newEntity.push(colorArray[0].length);
    newEntity.push(colorArray);
    entityList.push(newEntity);
}


function deleteEntity(name) {
    let index = entityList.indexOf(name);
    if (index == -1) {
        throw new Error("Entity not found");
    }
    entityList.splice(index, 1);
    entityList.splice(index, 1);
}


function drawEntity(id, name, x, y) {
    let entity = entityList[entityList.indexOf(name) + 1];
    let colorArray = entity[2];
    let height = colorArray.length;
    let width = colorArray[0].length;

    let elements = grabBlock(id, x, y, x + width - 1, y + height - 1);
    for (let i = 0; i < elements.length; i++) {
        for (let e = 0; e < elements[i].length; e++) {
            if (colorArray[i][e] != 'transparent') {
            elements[i][e].style.backgroundColor = colorArray[i][e];
            }
        }
    }
}

function getColors(pixelArray) {
    let colors = []
    for (let i = 0; i < pixelArray.length; i++) {
        for (let j = 0; j < pixelArray[i].length; j++) {
            colors.push(pixelArray[i][j].style.backgroundColor);
        }
    }
    return colors;

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

function returnGridSize(id) {
    return {
        gridWidth: document.getElementById(id).offsetWidth,
        gridHeight: document.getElementById(id).offsetHeight,
        pixelWidth: document.getElementById(id).children[0].children[0].offsetWidth,
        pixelHeight: document.getElementById(id).children[0].offsetHeight,
        pixelAmountWidth: document.getElementById(id).children[0].children.length,
        pixelAmountHeight: document.getElementById(id).children.length

    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function setBackgroundColor(id, color) {
    let grid = document.getElementById(id)
    let rows = grid.children;
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].children.length; j++) {
            rows[i].children[j].style.backgroundColor = color;
            rows[i].children[j].setAttribute("default-color", color);
        }
    }
}

function setBackgroundImage(id, colorArray) {
    let grid = document.getElementById(id)
    let rows = grid.children;
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[i].children.length; j++) {
            if (colorArray[i][j]!= 'transparent') {
            rows[i].children[j].style.backgroundColor = colorArray[i][j];
            rows[i].children[j].setAttribute("default-color", colorArray[i][j]);
            }
            else {
            rows[i].children[j].style.backgroundColor = "white";
            rows[i].children[j].setAttribute("default-color", "white");
            }
        }
    }
}


document.addEventListener("keydown", (event) => {
    if (!(allPressedKeys.includes(event.key))) {
    allPressedKeys.push(event.key);
    }
});

document.addEventListener("keyup", (event) => {
    while (allPressedKeys.includes(event.key)) {
        allPressedKeys.splice(allPressedKeys.indexOf(event.key), 1);
    }
});
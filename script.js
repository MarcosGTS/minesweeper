const DIFFICULTY = 20;
const MINE_SIZE = 10;
const NUMBER_OF_BOMBS = parseInt((DIFFICULTY / 100) * (MINE_SIZE ** 2));

let GRID = document.querySelector(".grid");
let MENU = document.querySelector(".menu");

let startBtn = document.querySelector(".start");

startBtn.addEventListener("click", startGame);

// update copyright to current year
let yearTags = document.querySelectorAll(".current-year");

function setCurrentYear(tag) {
    const currentDate = new Date();

    tag.innerText = `Copyright © ${currentDate.getFullYear()} MarcosGTS`;
}

yearTags.forEach((tag) => setCurrentYear(tag));


class Cell {
    constructor (value) {
        this.value = value;
    }

    isBomb () {
        return this.value < 0;
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }
}

class Minesweeper {
    constructor (height, width) {
        this.height = height;
        this.width = width;

        this.field = Array(height).fill().map(() => Array(width));
    }

    generateBombs (num) {
        /*
            num -> number of bombs
            return a matrix of with random positioned bombs
        */
        let { width, height } = this;
        let { field } = this;

        for (let bombs = 0; bombs < num;) {

            let [x, y] = this.getRandomPosition(width, height);
            let cell = field[y][x];
            
            if (cell) continue;
   
            field[y][x] = new Cell(-1);
            bombs++
        }
    }

    fillCells () {
        /* If not a bomb change a the value of a cell */

        let { width, height} = this;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let crr = this.field[y][x];

                //check if is a bomb
                if (crr && crr.isBomb()) continue;

                let bombs = this.countBombs(x, y)
                this.field[y][x] = new Cell(bombs);
            }
        }
    }

    getRandomPosition (max1, max2) {
    
        let x = this.getRandomNumber (max1);
        let y = this.getRandomNumber (max2);

        return [x, y]
    }

    getRandomNumber (max, min = 0) {
        return Math.floor(Math.random() * (max - min) + min) 
    }

    getMine () {
        return [... this.field];
    }

    countBombs(x, y, radius = 1) {
        let adjancents = [];
        let start = Math.max(x - radius, 0);  
        let len = x + radius + 1;
        
        for (let  i = -radius; i <=  radius; i++) {
            let line = this.field[y + i]
            
            if (!line) continue;
    
            let lineSection = line.slice(start, len);
            adjancents = adjancents.concat(lineSection);
        }

        return adjancents
        .filter(el => el)
        .filter(el => el.isBomb()).length;
    }
}

//Renderer
function showGameover() {
    for (let cellEl of GRID.childNodes) {
        cellEl.classList.remove("hide");
    }
}

function spreadNone(node) {
    if (!node) return;
    if (!node.classList.contains("hide")) return;

    let cellsList = [...GRID.children];
    let index = cellsList.indexOf(node);
    let [x, y] = [index % MINE_SIZE, parseInt(index/MINE_SIZE)];
    
    node.classList.remove("hide");
    
    if (node.innerText != "") return; 
    
    if (x + 1 < MINE_SIZE) {
        spreadNone(cellsList[index + 1]);
        spreadNone(cellsList[index - MINE_SIZE + 1]);
        spreadNone(cellsList[index + MINE_SIZE + 1]);
    }

    if (x - 1 >= 0) {
        spreadNone(cellsList[index - 1]);
        spreadNone(cellsList[index - MINE_SIZE - 1]);
        spreadNone(cellsList[index + MINE_SIZE - 1]);
    }
    
    spreadNone(cellsList[index - MINE_SIZE]);
    spreadNone(cellsList[index + MINE_SIZE]);
}

function addFlag(e) {
    e.preventDefault();
    this.classList.toggle("flag");
}

function checkVictory() {
    let discovered = [...GRID.children]
        .filter(el => el.classList.contains("hide"))

    if (discovered.length == NUMBER_OF_BOMBS) {
        MENU.classList.remove("invisible");
    }
}

function renderMine(mineField) {
    GRID.innerHTML = "";
    for (let line of mineField) {
        for (let cell of line) {
    
            let cellEl = document.createElement("div");
            
            cellEl.classList.add("cell"); 
            cellEl.classList.add("hide");
            
            cellEl.addEventListener("contextmenu", addFlag);

            if (cell.isBomb()) {
                cellEl.classList.add("bomb");
                cellEl.addEventListener("click", showGameover);
            }
                
            if (cell.getValue() > 0) 
                cellEl.innerText = cell.getValue();

            cellEl.addEventListener("click", () => spreadNone(cellEl));

            cellEl.addEventListener("click", checkVictory)
            GRID.appendChild(cellEl);
        }
    }
}

function startGame() {
    MENU.classList.add("invisible");

    const mine = new Minesweeper(MINE_SIZE, MINE_SIZE);
    mine.generateBombs(NUMBER_OF_BOMBS);
    mine.fillCells();
    renderMine(mine.getMine());
}

startGame();
//console.log(mine.getMine().map(el => el.map(cell => cell.getValue())))
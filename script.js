const MINE_SIZE = 10;
const DIFICULT = 0.1 * (MINE_SIZE**2);

let GRID = document.querySelector(".grid");

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

        do {
            let [x, y] = this.getRandomPosition(width, height);
            let cell = field[y][x];
            
            if (cell) continue;
            
            // Creating a bomb
            field[y][x] = new Cell(-1);
            num--;

        } while (num > 0)
    }

    fillCells () {
        /*
            if not a bomb change a the value of a cell
        */
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
    let index = cellsList.indexOf(node)
    let [x, y] = [index % MINE_SIZE, parseInt(index/MINE_SIZE)]
    
    node.classList.remove("hide");
    
    if (node.innerText != "") return; 
    
    if (x + 1 < MINE_SIZE) spreadNone(cellsList[index + 1]);
    if (x - 1 >= 0) spreadNone(cellsList[index - 1]);
    
    spreadNone(cellsList[index - MINE_SIZE]);
    spreadNone(cellsList[index + MINE_SIZE]);
}

function renderMine(mineField) {
    
    for (let line of mineField) {
        for (let cell of line) {
    
            let cellEl = document.createElement("div");
            
            cellEl.classList.add("cell"); 
            cellEl.classList.add("hide");

            if (cell.isBomb()) {
                cellEl.classList.add("bomb");
                cellEl.addEventListener("click", showGameover)
            }
                
            if (cell.getValue() > 0) 
                cellEl.innerText = cell.getValue();

            cellEl.addEventListener("click", () => spreadNone(cellEl))

            GRID.appendChild(cellEl);
        }
    }
}

const mine = new Minesweeper(MINE_SIZE, MINE_SIZE);
mine.generateBombs(DIFICULT);
mine.fillCells()
renderMine(mine.getMine())

//console.log(mine.getMine().map(el => el.map(cell => cell.getValue())))


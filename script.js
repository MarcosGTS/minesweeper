class Cell {
    constructor (value) {
        this.value = value;
    }

    isBomb () {
        return this.value < 0;
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

        let { x, y } = this;

        for (let i = 0; i < y; i++) {
            for (let j = 0; j < x; j++) {

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

    countBombs(x, y, r = 1) {
        let { field } = this;
        let adjancents = [];
        
        for (let  i = (y - r); i <= (y + r); i++) {
            let line = field[i].splice(x - 1, 3);
            adjancents = adjancents.concat(line);
        }
        
        console.log(adjancents);
    }
}

const mine = new Minesweeper(5,5);
mine.generateBombs(3);
mine.countBombs(1,1);


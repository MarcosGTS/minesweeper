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
    
                let bombs = this.countBombs(x, y);
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
        let test  = this.field.map(el => [...el])
        let adjancents = [];
        let start = Math.max(x - radius, 0);  
        let len = 2 * radius + 1;
        
        for (let  i = -radius; i <=  radius; i++) {
            let line = test[y + i]
            
            //check existahce
            if (!line) continue;
    
            let lineSection = line.splice(start, len);
            adjancents = adjancents.concat(lineSection);
        }
        
        return adjancents
        .filter(el => el)
        .filter(el => el.isBomb()).length;
    }
}

const mine = new Minesweeper(5,5);
mine.generateBombs(3);
mine.fillCells();
console.log(mine.getMine());


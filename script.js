/**
 * Rules for building generations
 * 
 * 1. Any living cell with less than 2 live neighbors dies
 * 2. Any living cell with 2 or 3 live neighbors continues to be alive
 * 3. Any dead cell with three live neighbors becomes a live cell
 * 4. Any live cell with more than 3 live neighbors dies
 */

let main_canvas = document.getElementById("main-canvas")
let start_sim = document.getElementById("start")
let ctx = main_canvas.getContext("2d")

// [rows, columns]
size = [11,11]//You will be able to zoom in our out using the size feature in a later implementation.
ts = 20//Tile size
editing_allowed = true
building = false
board = []

class Cell {
    constructor(x,y,life = 0) {
        this.x = x
        this.y = y
        this.life = life
    }

    make() {
        if(this.life == 0) {//Draw two different things depending on if the cell is alive or not.
            ctx.shadowBlur = 0
            ctx.strokeStyle = "rgb(94, 94, 94)"
            ctx.strokeRect(this.x,this.y,ts,ts)
        }else {
            ctx.shadowBlur = 5 //Add the white "glow effect" around each box
            ctx.shadowColor = "white"
            ctx.fillStyle = "rgb(255,255,255)"
            ctx.fillRect(this.x,this.y,ts,ts)
        }  
    }
}

function createGrid() {
    for(let i = 0; i < size[1]; i++){
        let row = []
        for(let i2 = 0; i2 < size[0]; i2++){
            let cell = new Cell(i*ts,i2*ts)//each time i call create board 
            row.push(cell)
        }
        board.push(row)
    }
}

function drawGrid() {//We need to split the drawing from the creation of the grid so that we can modify values in between.
    for(let i = 0; i < board.length; i++){
        for(let i2 = 0; i2 < board[0].length; i2++){
            board[i][i2].make()
        }
    }
}

test_cell = new Cell(100,100)
createGrid()//build our 2d array as such:
/*
board = [
[Cell, Cell, Cell, ...],
[Cell, Cell, Cell, ...],
[Cell, Cell, Cell, ...],
[Cell, Cell, Cell, ...],
...
]
*/

function buildNextGeneration(x,y) {//Takes in a Cell object
    cell = board[x][y]
    //Create 2 arrayrs around a given cell that tell you how many living vs dead cells surround you.
    living_cells_surrounding = []

    if(x == 0 && y == 0) {//The upper left hand corner of the grid
        for(i = 0; i < 3; i++) {//Create a 3x3 grid around the active cell to be able to see if they're living or not
            for(i2 = 0; i2 < 3; i2++){
                surrounding_cell = board[(x)+i][(y)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x != 0 && x != size[0]-1 && y == 0) {//in between the two top corners
        for(i = 0; i < 3; i++) {//Create a 3x3 grid around the active cell to be able to see if they're living or not
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x-1)+i][y+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x == size[0]-1 && y == size[1]-1){ //bottom right hand corner
        for(i = 0; i < 2; i++) {//Create a 3x3 grid around the active cell to be able to see if they're living or not
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x-1)+i][(y)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }

    }else if(x == size[0]-1 && y != size[1]-1 && y != 0){//right side
        for(i = 0; i < 2; i++) {//Create a 3x3 grid around the active cell to be able to see if they're living or not
            for(i2 = 0; i2 < 3; i2++){
                surrounding_cell = board[(x-1)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x == 0 && y != 0 && y != size[1]-1){//left side
        for(i = 0; i < 2; i++) {//Create a 3x3 grid around the active cell to be able to see if they're living or not
            for(i2 = 0; i2 < 3; i2++){
                surrounding_cell = board[(x)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x == 0 && y == size[1]-1) {//The bottom left hand corner
        for(i = 0; i < 2; i++) {//Create a 3x3 grid around the active cell to be able to see if they're living or not
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x != 0 && x != size[0]-1 && y == size[1]-1) {//in between two bottom corners
        for(i = 0; i < 3; i++) {//Create a 3x3 grid around the active cell to be able to see if they're living or not
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x-1)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else {
        for(i = 0; i < 3; i++) {//Create a 3x3 grid around the active cell to be able to see if they're living or not
            for(i2 = 0; i2 < 3; i2++){
                surrounding_cell = board[(x-1)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }
    
    if(cell.life == 1) {
        living_cells_surrounding.pop()//If the original cell was living, don't count that in the living cells array. 
        if(living_cells_surrounding.length < 2) {
            cell.life = 0
        }else if(living_cells_surrounding.length > 3) { 
            cell.life = 0

        }else if(living_cells_surrounding.length == 2 || living_cells_surrounding.length == 3) {
            cell.life = 1
        }
    }else {
        if(living_cells_surrounding.length == 3) {
            cell.life = 1
        }

    }
    
    console.log(living_cells_surrounding.length)
    //Now we use those array values to tell if a cell will survive or die
    
}

//click events to be able to edit the first generation
main_canvas.addEventListener("click", (event) => {
    let coors = [event.clientX, event.clientY]//store the user's x,y coordinate in an array
    for(let i = 0; i < board.length; i++) {
        for(let i2 = 0; i2 < board[0].length; i2++) {
            if(coors[0] > board[i][i2].x && coors[0] < board[i][i2].x + ts && coors[1] > board[i][i2].y && coors[1] < board[i][i2].y + ts) {//test if the user is clicking on a square
                //if the tile was dead before, bring it to life
                if(board[i][i2].life == 0) { 
                    board[i][i2].life = 1
                //if it was living before, kill it.
                }else if(board[i][i2].life == 1) {
                    board[i][i2].life = 0
                }
            }
        }
    }

  // buildNextGeneration(5,10)
})

start_sim.addEventListener("click", () => {
    if(!building) {
        building = true
        console.log("Building simulation!")
    }else {
        building = false
        console.log("Stopping the building!")
    }
})

for(let i = 0; i < board.length; i++) {
    for(let i2 = 0; i2 < board[0].length; i2++) {
       console.log(i + ": " + i2 )
    }
}

//board[5][10].life = 1
function draw() {//the draw loop which we'll run our main animation through.
    ctx.clearRect(0, 0, 1000, 1000); // make sure to clear the grid so that old generations disappear.
    if(building) { 
       for(let i = 0; i < board.length; i++){
           for(let i2 = 0; i2 < board[0].length; i2++){
              buildNextGeneration(i,i2)
           }
       }
    }
    drawGrid()
    window.requestAnimationFrame(draw)
}
window.requestAnimationFrame(draw)
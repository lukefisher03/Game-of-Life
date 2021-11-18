//Conway's Game of Life
//By Luke Fisher

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
let get_random = document.getElementById("random")

// [rows, columns]
let size = [150,220]//You will be able to zoom in our out using the size feature in a later implementation.
let ts = 7//Tile size
let editing_allowed = true
let building = false
let random_colors = false


/*
board = [
[Cell, Cell, Cell, ...],
[Cell, Cell, Cell, ...],
[Cell, Cell, Cell, ...],
[Cell, Cell, Cell, ...],
...
]
*/
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
            if(random_colors) { 
                ctx.fillStyle = "rgb("+ Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ")"
            }else {
                ctx.fillStyle = "white"
            }
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

function buildNextGeneration(x,y) {//Takes in a Cell object
    let cell = board[x][y]
    let new_board = []
    //Create 2 arrayrs around a given cell that tell you how many living vs dead cells surround you.
    let living_cells_surrounding = []

    /* 
    * The game depends on counting living and dead cells around a given cell to determine it's "destiny". 
    * However, at the edges and corners of the grid there's a different number of cells surrounding one. For example: normally a cell will have
    * 8 surrounding cells. But, at the edges it will have 5. And in the corners, it will have 3. These conditionals check for the position of the
    * selected cell and adjust accordingly.
    */

    if(x == 0 && y == 0) {//The upper left hand corner of the grid
        for(i = 0; i < 2; i++) {
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x)+i][(y)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x != 0 && x != size[1]-1 && y == 0) {//in between the two top corners
        for(i = 0; i < 3; i++) {
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x-1)+i][y+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x == size[1]-1 && y == size[0]-1){ //bottom right hand corner
        for(i = 0; i < 2; i++) {
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x-1)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }

    }else if(x == size[1]-1 && y != size[0]-1 && y != 0){//right side
        for(i = 0; i < 2; i++) {
            for(i2 = 0; i2 < 3; i2++){
                surrounding_cell = board[(x-1)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x == 0 && y != 0 && y != size[0]-1){//left side
        for(i = 0; i < 2; i++) {
            for(i2 = 0; i2 < 3; i2++){
                surrounding_cell = board[(x)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x == 0 && y == size[0]-1) {//The bottom left hand corner
        for(i = 0; i < 2; i++) {
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x != 0 && x != size[1]-1 && y == size[0]-1) {//in between two bottom corners
        for(i = 0; i < 3; i++) {
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x-1)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else if(x == size[1]-1 && y == 0) {//The upper right hand corner of the grid
        for(i = 0; i < 2; i++) {
            for(i2 = 0; i2 < 2; i2++){
                surrounding_cell = board[(x-1)+i][(y)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }else {
        for(i = 0; i < 3; i++) {//everything else
            for(i2 = 0; i2 < 3; i2++){
                surrounding_cell = board[(x-1)+i][(y-1)+i2]
                if(surrounding_cell.life == 1) {
                    living_cells_surrounding.push(surrounding_cell)
                }
            }
        }
    }

    //If the cell that's being tested for the rules is alive, don't count it as a live surrounding cell.
    if(cell.life == 1){
        living_cells_surrounding.pop()
    }

    //In the end all we care about is how many cells are alive or dead around a given cell. In this case, that's all we return.
    return living_cells_surrounding.length
}

//click events to be able to edit the first generation
main_canvas.addEventListener("click", (event) => {
    console.log(main_canvas.getBoundingClientRect().top)
    let coors = [event.clientX - main_canvas.getBoundingClientRect().left, event.clientY - main_canvas.getBoundingClientRect().top]//store the user's x,y coordinate in an array
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

  // buildNextGeneration(3,3)
})

start_sim.addEventListener("click", () => {//Mechanics behind the start/stop button
    if(!building) {
        building = true
        console.log("Building simulation!")
        start_sim.innerText = "Stop Generation"
    }else {
        building = false
        console.log("Stopping the building!")
        start_sim.innerText = "Start Generation"
    }
})

createGrid()//build our 2d array as such:
get_random.addEventListener("click", (event) => {
    ctx.clearRect(0, 0, main_canvas.clientWidth, main_canvas.clientHeight); // make sure to clear the grid so that old generations disappear.
    for(let i = 0; i < board.length; i++) {
        for(let i2 = 0; i2 < board[0].length; i2++) {
            console.log(Math.floor(Math.random()*2))
            board[i][i2].life = Math.floor(Math.random()*2)
        }
    }
})

function draw() {//the draw loop which we'll run our main animation through.
    cells_to_resurrect = []
    cells_to_kill = []
    ctx.clearRect(0, 0, main_canvas.clientWidth, main_canvas.clientHeight); // make sure to clear the grid so that old generations disappear.
    
    //Process the game rules here:
    if(building) { //Make sure the start generation button is enabled.
       for(let i = 0; i < board.length; i++){
           for(let i2 = 0; i2 < board[0].length; i2++){//loop through each cell
                this_cell = board[i][i2]
                cell_count = buildNextGeneration(i,i2)//find out how many cells are surrounding the given cell.
                if(this_cell.life == 1) {//if it's alive, process the rules below.
                        if(cell_count < 2) {
                            cells_to_kill.push(this_cell)
                        }else if(cell_count > 3) { 
                            cells_to_kill.push(this_cell)
                        }
                }else {
                    if(cell_count == 3) {
                        cells_to_resurrect.push(this_cell)
                    }
                }
            }
        }
    }

    /* The game is structured so that all of the changes are made AFTER the processing of what cells live or die. 
    * If the loop is checking cell A and sees that it should die, the death of cell A shouldn't affect the life or death of
    * cell B until the next generation. This is a crucial part of the rules, and why I don't just kill the cell in the code above.
    */
    for (let i = 0; i < cells_to_resurrect.length; i++) {
        cells_to_resurrect[i].life = 1
    }
    
    for (let i = 0; i < cells_to_kill.length; i++) {
        cells_to_kill[i].life = 0
    }

    drawGrid()//Drawing the grid comes AFTER everything else.
    window.requestAnimationFrame(draw)
}

window.requestAnimationFrame(draw)
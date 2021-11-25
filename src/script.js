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

/**
 * Change the cell generation to 1's and 0's
 * create a grid of 1's and 0's
 */

let main_canvas = document.getElementById("main-canvas");
let start_sim = document.getElementById("start");
let ctx = main_canvas.getContext("2d");
let get_random = document.getElementById("random");
let clear_canvas = document.getElementById("clear");
let ts_slider = document.getElementById("ts_slider");
let ts_label = document.getElementById("ts_label")

// // [width, height]
let c_dimensions = [window.innerWidth - 100, window.innerHeight * (0.75)]
main_canvas.width = c_dimensions[0]
main_canvas.height = c_dimensions[1]

let ts = 4; //Tile size
//Width will be -> ts 
let size = [(c_dimensions[0] / ts) + (5*ts), (c_dimensions[1] / ts) + (5*ts)]; //You will be able to zoom in our out using the size feature in a later implementation.
let color = "white";
let editing_allowed = true;
let building = false;
let random_colors = false;

class Cell {
    constructor(x, y, life = 0) {
        this.x = x
        this.y = y
        this.life = life
    };
};

class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    }
    values = []
    makeGrid() {
        for (let i = 0; i < this.rows; i++) { //create a 2d array representing the grid.
            let row = [];
            for (let i2 = 0; i2 < this.cols; i2++) {
                row[i2] = 0 //append 0's to the 2d array.
            };
            this.values.push(row);
        };
    }

    makeRandomGrid() {
        ctx.clearRect(0, 0, main_canvas.clientWidth, main_canvas.clientHeight); // make sure to clear the grid so that old generations disappear.
        for (let i = 0; i < this.rows; i++) {
            for (let i2 = 0; i2 < this.cols; i2++) {
                this.values[i][i2] = Math.floor(Math.random() * 2)
            };
        };
        return this.values
    }
}

ctx.shadowBlur = 5 //Add the white "glow effect" around each box
ctx.shadowColor = color
function drawGrid(grid) {
    for (let i = 0; i < grid.rows; i++) {
        for (let j = 0; j < grid.cols; j++) {
            let cell = new Cell(i * ts, j * ts, grid.values[i][j])
            if(grid.values[i][j] == 1) {
                ctx.fillStyle = color
                ctx.fillRect(cell.x, cell.y, ts, ts)
            }
        }
    }
}

function analyzeCell(x, y, grid) { //Takes in a Cell object
    let living_cells_surrounding = 0;
    for (i = 0; i < 3; i++) { //everything else
        for (i2 = 0; i2 < 3; i2++) {
            try {
                surrounding_cell = grid.values[(x - 1) + i][(y - 1) + i2]
                if (surrounding_cell == 1) {
                    living_cells_surrounding++;
                };
            } catch (err) {
                surrounding_cell = "cell not found";
            };
        };
    };
    if (grid.values[x][y] == 1) {
        living_cells_surrounding -= 1;
    };
    return living_cells_surrounding;
}

let mainGrid = new Grid(size[0], size[1])
mainGrid.makeGrid();
mainGrid.makeRandomGrid();

start_sim.addEventListener("click", () => { //Mechanics behind the start/stop button
    if (!building) {
        building = true;
        console.log("Building simulation!");
        start_sim.innerText = "Stop Generation";
    } else {
        building = false;
        console.log("Stopping the building!");
        start_sim.innerText = "Start Generation";
    };
});

function buildNextGrid(grid) {
    let cell_count;
    let newGrid = new Grid(size[0], size[1]);
    newGrid.makeGrid();
    for (let i = 0; i < grid.rows; i++) {
        for (let j = 0; j < grid.cols; j++) {
            let thisCell = grid.values[i][j];
            cell_count = analyzeCell(i, j, grid);
            if (thisCell == 1) { //if it's alive, process the rules below.
                if (cell_count < 2) {
                    newGrid.values[i][j] = 0;
                } else if (cell_count > 3) {
                    newGrid.values[i][j] = 0;
                } else {
                    newGrid.values[i][j] = 1;
                }
            } else {
                if (cell_count == 3) {
                    newGrid.values[i][j] = 1;
                };
            };
        }
    }
    grid.values = newGrid.values
    return grid
}

function draw() { //the draw loop which we'll run our main animation through. Anything in this function gets looped every ms or as fast as it can update.
    ctx.clearRect(0, 0, main_canvas.clientWidth, main_canvas.clientHeight); // make sure to clear the grid so that old generations disappear.
    //Process the game rules here:
    if (building) { //Make sure the start generation button is enabled.
        buildNextGrid(mainGrid)
    };
    drawGrid(mainGrid)
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
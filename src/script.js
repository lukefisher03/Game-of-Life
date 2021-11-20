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

let main_canvas = document.getElementById("main-canvas");
let start_sim = document.getElementById("start");
let ctx = main_canvas.getContext("2d");
let get_random = document.getElementById("random");
let clear_canvas = document.getElementById("clear");
let ts_slider = document.getElementById("ts_slider");
let ts_label = document.getElementById("ts_label")

// [height, width]
let c_dimensions = [window.innerWidth - 100, window.innerHeight * (0.75)]
let ts = ts_slider.value; //Tile size
//Width will be -> ts 
let size = [(c_dimensions[1] / ts), (c_dimensions[0] / ts)]; //You will be able to zoom in our out using the size feature in a later implementation.
let color = "white";
let editing_allowed = true;
let building = false;
let random_colors = false;

/*
a probably faster way to do things is to use 1's and 0's as "on" or "off" states. 
My program loops through and reads a massive list of objects which is much less efficient.

board = [
[Cell, Cell, Cell, ...],
[Cell, Cell, Cell, ...],
[Cell, Cell, Cell, ...],
[Cell, Cell, Cell, ...],
...
]
*/

class Cell {
    constructor(x, y, life = 0) {
        this.x = x
        this.y = y
        this.life = life
    };

    make() {
        if (this.life == 0) { //Draw two different things depending on if the cell is alive or not.
            ctx.shadowBlur = 0
            ctx.strokeStyle = "rgb(94, 94, 94)"
            ctx.strokeRect(this.x, this.y, ts, ts)
        } else {
            ctx.shadowBlur = 5 //Add the white "glow effect" around each box
            ctx.shadowColor = color
            if (random_colors) {
                ctx.fillStyle = "rgb(" + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ", " + Math.floor(Math.random() * 255) + ")"
            } else {
                ctx.fillStyle = color
            };

            ctx.fillRect(this.x, this.y, ts, ts)
        };
    };
};

function createGrid() {
    for (let i = 0; i < size[1]; i++) {
        let row = [];
        for (let i2 = 0; i2 < size[0]; i2++) {
            let cell = new Cell(i * ts, i2 * ts); //each time i call create board 
            row.push(cell);
        };
        board.push(row);
    };
};

function init() {
    c_dimensions = [window.innerWidth - 100, window.innerHeight * (0.75)];
    main_canvas.width = c_dimensions[0];
    main_canvas.height = c_dimensions[1];
    ts_label.innerHTML = `Tile Size: ${ts_slider.value}`;
    ts = ts_slider.value; //Tile size
    size = [(c_dimensions[1] / ts), (c_dimensions[0] / ts)];
    board = [];
    createGrid();
}

init();
ts_slider.oninput = function() {
    init();
}

function drawGrid() { //We need to split the drawing from the creation of the grid so that we can modify values in between.
    for (let i = 0; i < board.length; i++) {
        for (let i2 = 0; i2 < board[0].length; i2++) {
            board[i][i2].make();
        };
    };
};

function buildNextGeneration(x, y) { //Takes in a Cell object
    let cell = board[x][y];
    let new_board = [];
    //Create 2 arrayrs around a given cell that tell you how many living vs dead cells surround you.
    let living_cells_surrounding = 0;

    /* 
     * The game depends on counting living and dead cells around a given cell to determine it's "destiny". 
     * However, at the edges and corners of the grid there's a different number of cells surrounding one. For example: normally a cell will have
     * 8 surrounding cells. But, at the edges it will have 5. And in the corners, it will have 3. These conditionals check for the position of the
     * selected cell and adjust accordingly.
     */

    for (i = 0; i < 3; i++) { //everything else
        for (i2 = 0; i2 < 3; i2++) {
            try {
                surrounding_cell = board[(x - 1) + i][(y - 1) + i2]
                if (surrounding_cell.life == 1) {
                    living_cells_surrounding++;
                };
            } catch (err) {
                surrounding_cell = "cell not found";
            };
        };
    };

    //If the cell that's being tested for the rules is alive, don't count it as a live surrounding cell.
    if (cell.life == 1) {
        living_cells_surrounding -= 1;
    };

    //In the end all we care about is how many cells are alive or dead around a given cell. In this case, that's all we return.
    return living_cells_surrounding;
}

//click events to be able to edit the first generation
main_canvas.addEventListener("click", (event) => {
    
    let coors = [event.clientX - main_canvas.getBoundingClientRect().left, event.clientY - main_canvas.getBoundingClientRect().top] //store the user's x,y coordinate in an array
    for (let i = 0; i < board.length; i++) {
        for (let i2 = 0; i2 < board[0].length; i2++) {
            if(coors[0] > board[i][i2].x && coors[0] < board[i][i2].x + ts && coors[1] > board[i][i2].y && coors[1] < board[i][i2].y + ts) { //test if the user is clicking on a square
                clicked_cell = board[i][i2];
            };
        };
    };

    //if the tile was dead before, bring it to life
    if (clicked_cell.life == 0) {
        clicked_cell.life = 1;
        //if it was living before, kill it.
    } else if (clicked_cell.life == 1) {
        clicked_cell.life = 0;
    };

});

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

function get_random_layout() {
    ctx.clearRect(0, 0, main_canvas.clientWidth, main_canvas.clientHeight); // make sure to clear the grid so that old generations disappear.
    for (let i = 0; i < board.length; i++) {
        for (let i2 = 0; i2 < board[0].length; i2++) {
            board[i][i2].life = Math.floor(Math.random() * 2);
        };
    };
};
get_random_layout();

get_random.addEventListener("click", () => {
    get_random_layout();
});

clear_canvas.addEventListener("click", () => {
    for (let i = 0; i < board.length; i++) {
        for (let i2 = 0; i2 < board[0].length; i2++) {
            board[i][i2].life = 0;
        };
    };
});


function draw() { //the draw loop which we'll run our main animation through.
    cells_to_resurrect = [];
    cells_to_kill = [];
    ctx.clearRect(0, 0, main_canvas.clientWidth, main_canvas.clientHeight); // make sure to clear the grid so that old generations disappear.

    //Process the game rules here:
    if (building) { //Make sure the start generation button is enabled.
        for (let i = 0; i < board.length; i++) {
            for (let i2 = 0; i2 < board[0].length; i2++) { //loop through each cell
                this_cell = board[i][i2];
                cell_count = buildNextGeneration(i, i2); //find out how many cells are surrounding the given cell.
                if (this_cell.life == 1) { //if it's alive, process the rules below.
                    if (cell_count < 2) {
                        cells_to_kill.push(this_cell);
                    } else if (cell_count > 3) {
                        cells_to_kill.push(this_cell);
                    }
                } else {
                    if (cell_count == 3) {
                        cells_to_resurrect.push(this_cell);
                    };
                };
            };
        };
    };

    /* The game is structured so that all of the changes are made AFTER the processing of what cells live or die. 
     * If the loop is checking cell A and sees that it should die, the death of cell A shouldn't affect the life or death of
     * cell B until the next generation. This is a crucial part of the rules, and why I don't just kill the cell in the code above.
     */
    for (let i = 0; i < cells_to_resurrect.length; i++) {
        cells_to_resurrect[i].life = 1;
    };

    for (let i = 0; i < cells_to_kill.length; i++) {
        cells_to_kill[i].life = 0;
    };

    drawGrid();//Drawing the grid comes AFTER everything else.
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);
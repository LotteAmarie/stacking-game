const config = {
    cols: 7,
    rows: 7,
    gameSpeed: 500, // in ms
    gameDuration: 150000 // in ms
};

var score = 0;
const board = createBoard(config.cols, config.rows);

const matchedElements = {};
let time = 0;
let gameInterval;

var currentArray = [];
const numIcons = 15;
for (var i = 0; i < numIcons; i++)
{
    var chosenIcons = Math.floor(Math.random() * storeArray.length);
    currentArray[i] = storeArray[chosenIcons];
    storeArray.splice(chosenIcons, 1);
}

/**
 * Game entry point
 */
function startGame() {
    addEvents();
    createCurrent();

    gameInterval = setInterval(() => {
        if (canFall()) { // Falling State
            fall();
        } else { // When landing
            const matchedSlots = match(current.position.row, current.position.col);
            
            if (matchedSlots) {
                if(!matchedElements[current.name]) {
                    addToShoppingBag(current.img);

                    // Creates an attribute in matched elements with the current name
                    matchedElements[current.name] = true;
                }

                // TODO: This really should be moved into the clearMatches() function.
                // Empties current cell
                const { col, row } = current.position;
                
                emptyCell(getCell(row, col));
                
                board[row][col] = null;

                console.log('matches:', matchedSlots);
                
                clearMatches(matchedSlots);
            }
    
            // Creates new "current"
            createCurrent();
        }
    
        time = time + config.gameSpeed; // TODO: display this in seconds?


        document.getElementById('stackingtime').innerHTML = time + " milliseconds";
    
        if (time === config.gameDuration) {
            stopGame();
        }

    }, config.gameSpeed);
}

/**
 * Function to check if the space below the current game space is empty and the
 * piece can safely fall without colliding.
 * 
 * @returns {boolean} returns true if the row under the current piece is null
 */
function canFall() {
    const { row, col } = current.position;
    return row !== 6 && board[row + 1][col] === null; // TODO: row !== 6?
}

/**
 * Function to move the current game piece down one row.
 */
function fall() {
    // Gets current position
    const { row, col } = current.position;
    
    // Empties cell position
    board[row][col] = null;

    // Updates HTML to remove image
    getCell(row, col).style.backgroundImage = '';

    // Updates HTML to insert image in next row
    getCell(row+1, col).style.backgroundImage = `url(${current.img})`;
    getCell(row+1, col).style.backgroundSize = `contain`; 
    getCell(row+1, col).style.backgroundRepeat = `no-repeat`;
    getCell(row+1, col).style.backgroundPosition = `center`;
    // Moves current to next row
    board[row + 1][col] = current;

    // Updates current position data
    current.position.row++;
}

/**
 * Function to return the HTML div element corresponding to the given row and
 * column.
 * 
 * @param {Number} row row position on the game board
 * @param {Number} col column position on the game board
 * 
 * @returns {Element} HTML div returned
 */
function getCell(row, col) { // TODO: not found case?
    return document.querySelector(`#pos${row * 7 + col}`);
}

/**
 * Function to return all the empty HTML div elements within the shopping bag.
 */
function getShoppingBag() {
    return document.querySelectorAll("div.logo.empty");
}

/**
 * Function which places the given image into the shopping bag.
 * 
 * @param {String} img path of the image to be displayed in the shopping bag
 */
function addToShoppingBag(img) {
    let bag = getShoppingBag();

    bag[bag.length-1].style.backgroundImage = `url(${img})`;
    bag[bag.length-1].classList.remove('empty');

    if (bag.length === 1) {
        stopGame();
    }
}

/**
 * Function to check for potential matches at the given row and column on the 
 * game board.
 * 
 * @param {Number} row 
 * @param {Number} col column position of the game piece
 * 
 * @returns {boolean} false if no matches were found
 * @returns {Object[]} an array containing any valid matches
 */
function match(row, col) {
    //Array for the matches icons to show on the shopping cart
    const matches = [];

    let name; 
    if (board[row][col] !== null) {
        name = board[row][col].name;
    }

    const right = board[row][col+1];
    const left = board[row][col-1];
    const down = row < config.rows - 1 && board[row + 1][col];

    // Match on right
    if(right && name == right.name) {
        matches.push({
            row: row,
            col: col + 1
        });

        score += 5;
    }
    // Match on left
    if(left && name == left.name) {
        matches.push({
            row: row,
            col: col-1
        });

        score += 5;
    }
    // Match on bottom
    if(down && name == down.name) {
        matches.push({
            row: row + 1,
            col: col
        });

        score += 5;
    }

    drawScore();

    if(matches.length === 0) {
        return false;
    } else {
        return matches;
    }
}

/**
 * Function to clear any matching game pieces upon a game piece landing.
 *  
 * @param {Object[]} matches matching game pieces to be cleared
 */
function clearMatches(matches) {
    matches.forEach(m => {
        console.log("clearing", m);

        let cell = getCell(m.row, m.col);

        emptyCell(cell);
        board[m.row][m.col] = null;

        // Moves images from to to bottom
        let currentRow = m.row - 1;
        let previousCell = cell;
                    
        while(board[currentRow][m.col] !== null) {
            const currentCell = getCell(currentRow, m.col);
                        
            // Updates images
            previousCell.style.backgroundImage = currentCell.style.backgroundImage;
            emptyCell(currentCell);
                      
            // Updates current cell and current row
            previousCell = currentCell;
            board[currentRow+1][m.col] = board[currentRow][m.col];
            board[currentRow][m.col] = null;

            // Check for matches
            let matches = match(currentRow + 1, m.col);
            if (matches) {
                emptyCell(getCell(currentRow + 1, m.col));
                board[currentRow + 1][m.col] = null;

                clearMatches(matches);
            }

            currentRow--;
        }
    });
}

/**
 * Function to create the initial state of the 2d game board.
 *  
 * @param {Number} cols number of columns
 * @param {Number} rows number of rows
 */
function createBoard(cols, rows) {
    var arr = new Array(cols).fill(null);

    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(null);
    }

    return arr;
}

/**
 * Function to create the current controllable game piece. The logo is pulled 
 * at random from a pool of twelve.
 */
function createCurrent() {
    const randomElementIndex = Math.floor(Math.random() * currentArray.length);
    const current = currentArray[randomElementIndex];
    //Positionates the element in a ramdom column
    const randomColumn = Math.floor(Math.random() * config.cols);
    //preview row position
    current.position = {
        col: randomColumn,
        row: 0
    };;

    if (board[0][randomColumn] !== null) { 
        // TODO: We can have the game have a bias against spawning blocks rows that would cause a game over to lower difficulty
        console.log(`Game Over: ${randomColumn} was filled`);
        stopGame();
    }

    // Creates a global variable with the new object
    window.current = current;

    // Shows in first line
    getCell(current.position.row, current.position.col).style.backgroundImage = `url(${current.img})`;
    getCell(current.position.row, current.position.col).style.backgroundSize = `contain`; 
    getCell(current.position.row, current.position.col).style.backgroundRepeat = `no-repeat`;
    getCell(current.position.row, current.position.col).style.backgroundPosition = `center`;
}

/**
 * Function which stops the game by clearing the game interval.
 */
function stopGame() {
    clearInterval(gameInterval);
    localStorage.setItem('score', score);
    window.location.href= "../stacking-game/game_end_stacking.html";
}

/**
 * Function to clear the corresponding HTML Element of a game piece through CSS
 * Styles.
 * 
 * @param {Element} cell 
 */
function emptyCell(cell) { // TODO: Also clear location in board array?
    cell.style.backgroundImage = '';
}

/**
 * Function to add the event listeners used for interacting with the game.
 */
function addEvents () {
    document.body.addEventListener('keydown', function(event) {
        const { key } = event;

        switch(key) {
            case 'ArrowRight':
                moveRight();
                break;
                
            case 'ArrowLeft':
                moveLeft();
                break;
        }
    });

    document.querySelector('.arrow-left').addEventListener('click', moveLeft);
    document.querySelector('.arrow-right').addEventListener('click', moveRight);
}

function moveLeft() {
    if(!canFall() || !canMove('left')) {
        return;
    }

    const { row, col } = current.position;

    emptyCell(getCell(row, col));
    board[row][col] = null;
    board[row][col-1] = current;
    getCell(row, col-1).style.backgroundImage = `url(${current.img})`;
    getCell(row, col-1).style.backgroundSize = `contain`; 
    getCell(row, col-1).style.backgroundRepeat = `no-repeat`;
    getCell(row, col-1).style.backgroundPosition = `center`;
    current.position.col--;
}

function moveRight() {
    // Avoids moving when reached the bottom
    if(!canFall() || !canMove('right')) {
        return;
    }

    const { row, col } = current.position;

    emptyCell(getCell(row, col));
    board[row][col] = null;
    board[row][col+1] = current;
    getCell(row, col+1).style.backgroundImage = `url(${current.img})`;
    getCell(row, col+1).style.backgroundSize = `contain`; 
    getCell(row, col+1).style.backgroundRepeat = `no-repeat`;
    getCell(row, col+1).style.backgroundPosition = `center`;
    current.position.col++;
}

/**
 * Function to check if the current game piece is able to move left or right
 * or if it will collide with an existing piece.
 * 
 * @param {String} direction 
 */
function canMove(direction) {
    const { row, col } = current.position;

    if(direction === 'left') {
        return col > 0 && board[row][col - 1] === null;
    }
    
    if(direction === 'right') {
        return col < config.cols - 1 && board[row][col + 1] === null;
    }
}

/**
 * Function to draw the score onto the HTML Element "stackingscore."
 */
function drawScore() {
    let scoreElement = document.getElementById("stackingscore");
    scoreElement.innerHTML = `Score: ${score}`;
}

startGame(); // TODO: Add this to the HTML's body onload

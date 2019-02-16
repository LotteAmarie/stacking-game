//Arrays with brand icons to ramdomly select them at a given level (1,2,or 3)
var firstArray = [
    {
        'name' : 'Burrito Beach',
        'img' : 'img/stacking-images/stacking1.png'
    },
    {
        'name' : 'American Dog',
        'img' : 'img/stacking-images/stacking2.png'
    },
    {
        'name' : 'Anntie Anne',
        'img' : 'img/stacking-images/stacking3.png'
    },
    {
        'name' : 'Barbaras',
        'img' : 'img/stacking-images/stacking4.png'
    },
    {
        'name' : 'Berghoff Cafe',
        'img' : 'img/stacking-images/stacking5.png'
    },
    {
        'name' : 'Brighton',
        'img' : 'img/stacking-images/stacking6.png'
    },
    {
        'name' : 'Brooks Brothers',
        'img' : 'img/stacking-images/stacking7.png'
    },
    {
        'name' : 'Brookstone',
        'img' : 'img/stacking-images/stacking8.png'
    },
    {
        'name' : 'BSmooth',
        'img' : 'img/stacking-images/stacking9.png'
    },
    {
        'name' : 'Cibo',
        'img' : 'img/stacking-images/stacking10.png'
    },
]

var secondArray = [
    {
        'name' : 'CNN',
        'img' : 'img/stacking-images/stacking11.png'
    },
    {
        'name' : 'Coach',
        'img' : 'img/stacking-images/stacking12.png'
    },
    {
        'name' : 'Field',
        'img' : 'img/stacking-images/stacking13.png'
    },
    {
        'name' : 'Barbaras',
        'img' : 'img/stacking-images/stacking14.png'
    },
    {
        'name' : 'The Green Market',
        'img' : 'img/stacking-images/stacking15.png'
    },
    {
        'name' : 'Hudson',
        'img' : 'img/stacking-images/stacking16.png'
    },
    {
        'name' : 'Headphone Hub',
        'img' : 'img/stacking-images/stacking17.png'
    },
    {
        'name' : 'Hoy Poloi',
        'img' : 'img/stacking-images/stacking18.png'
    },
    {
        'name' : 'Inmotion',
        'img' : 'img/stacking-images/stacking19.png'
    },
    {
        'name' : 'Johnston & Murphy',
        'img' : 'img/stacking-images/stacking20.png'
    },
]

var thirdArray = [
    {
        'name' : 'MAC',
        'img' : 'img/stacking-images/stacking21.png'
    },
    {
        'name' : 'Mc Donalds',
        'img' : 'img/stacking-images/stacking22.png'
    },
    {
        'name' : 'Nuts on Clark',
        'img' : 'img/stacking-images/stacking23.png'
    },
    {
        'name' : 'Rocky Mountain',
        'img' : 'img/stacking-images/stacking24.png'
    },
    {
        'name' : 'Sarahs Candies',
        'img' : 'img/stacking-images/stacking25.png'
    },
    {
        'name' : 'Shoe Hospital',
        'img' : 'img/stacking-images/stacking26.png'
    },
    {
        'name' : 'Spirit of the Red Horse',
        'img' : 'img/stacking-images/stacking27.png'
    },
    {
        'name' : 'Talie',
        'img' : 'img/stacking-images/stacking28.png'
    },
    {
        'name' : 'Vosges',
        'img' : 'img/stacking-images/stacking29.png'
    },
    {
        'name' : 'Vosges',
        'img' : 'img/stacking-images/stacking29.png'
    },
];

var cols = 7;
var rows = 7;
const config = {
    cols: 7,
    rows: 7,
    gameSpeed: 500
};

//Selects a ramdom array
const currentArrayName = ['firstArray', 'secondArray', 'thirdArray'][Math.floor(Math.random() * 3)];
const currentArray = window[currentArrayName];

console.log('currentArray:', currentArrayName);

//Creates current element from the ramdom array
function createCurrent() {
    const randomElementIndex = Math.floor(Math.random() * currentArray.length);
    const current = currentArray[randomElementIndex];
    //Positionates the element in a ramdom column
    const randomColumn = Math.floor(Math.random() * cols);
    //preview row position
    current.position = {
        col: randomColumn,
        row: 0
    };

    // Creates a global variable with the new object
    window.current = current;

    // Shows in first line
    getCell(current.position.row, current.position.col).style.backgroundImage = `url(${current.img})`;
    getCell(current.position.row, current.position.col).style.backgroundSize = `contain`; 
    getCell(current.position.row, current.position.col).style.backgroundRepeat = `no-repeat`;
    getCell(current.position.row, current.position.col).style.backgroundPosition = `center`;
}
createCurrent();

//Checks for the last null position to assign the current value
function canFall() {
    const { row, col } = current.position;
    return row !== 6 && board[row + 1][col] === null;
}

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

function getCell(row, col) {
    return document.querySelector(`#pos${row * 7 + col}`);
}

function getShoppingBag() {
    return document.querySelectorAll("div.logo.empty")
}

function addToShoppingBag(img) {
    let bag = getShoppingBag();

    bag[bag.length-1].style.backgroundImage = `url(${current.img})`;
    bag[bag.length-1].classList.remove('empty');
}

function match(position) {
    //Returns board positions that match -- How?
    const { row, col } = position;
    //Array for the matches icons to show on the shopping cart
    const matches = [];

    const right = board[row][col+1];
    const left = board[row][col-1];
    const down = row < config.rows - 1 && board[row + 1][col];

    // Match on right
    if(right && current.name == right.name) {
        matches.push({
            row: row,
            col: col + 1
        });

        score += 5;
    }
    // Match on left
    if(left && current.name == left.name) {
        matches.push({
            row: row,
            col: col-1
        });

        score += 5;
    }
    // Match on bottom
    if(down && current.name == down.name) {
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

function createBoard(cols, rows) {
    var arr = new Array(cols).fill(null);

    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(null);
    }

    return arr;
}

var score = 0;
const board = createBoard(cols, rows);
const shoppingCart = [];

const matchedElements = {};
let time = 0;
let gameInterval;

const stopGame = () => clearInterval(gameInterval);
function startGame() {

    gameInterval = setInterval(() => {
    
        if (canFall()) {
            fall();
        } else {
            
            const matchedSlots = match(current.position);
            
            if (matchedSlots) {
    
                if(!matchedElements[current.name]) {
                    addToShoppingBag(current.img);

                    // Creates an attribute in matched elements with the current name
                    matchedElements[current.name] = true;
                }
    
                // Empties current cell
                const { col, row } = current.position;
                emptyCell(getCell(row, col));
                board[row][col] = null;

                console.log('matches:', matchedSlots)
                
                // Empties matched cells
                matchedSlots.forEach(function(slot) {
                    console.log('clearing', slot)

                    // Gets cell
                    const { row, col } = slot;
                    const cell = getCell(row, col);
    
                    // Removes image from HTML
                    emptyCell(cell);
    
                    // Clears board array 
                    board[row][col] = null;
    
                    // Moves images from to to bottom
                    let currentRow = row - 1;
                    let previousCell = cell;
                    
                    while(board[currentRow][col] !== null) {
                        const currentCell = getCell(currentRow, col)
                        
                        // Updates images
                        previousCell.style.backgroundImage = currentCell.style.backgroundImage;
                        emptyCell(currentCell);
                        
                        // Updates current cell and current row
                        previousCell = currentCell;
                        board[currentRow+1][col] = board[currentRow][col];
                        board[currentRow][col] = null;
                        currentRow--;
                    }
                });
            }
    
            // Creates new "current"
            createCurrent();
        }
    
        time = time + 1;
    
        /*if (time === 60) {
            stopGame();
        }*/
    
        //addNewIcon //how do I add a new icon and make a preview (before starting to fall) in x,1 at a ramdom y postition
    }, config.gameSpeed);
}

function emptyCell(cell) {
    cell.style.backgroundImage = '';
}

function addEvents () {
    document.body.addEventListener('keydown', function(event) {
        // Avoids moving when reached the bottom
        if(!canFall()) return;

        const { key } = event;
        const { row, col } = current.position;

        switch(key) {
            case 'ArrowRight':
                if(!canMove('right')) {
                    return;
                }

                emptyCell(getCell(row, col));
                board[row][col] = null;
                board[row][col+1] = current;
                getCell(row, col+1).style.backgroundImage = `url(${current.img})`;
                getCell(row, col+1).style.backgroundSize = `contain`; 
                getCell(row, col+1).style.backgroundRepeat = `no-repeat`;
                getCell(row, col+1).style.backgroundPosition = `center`;
                current.position.col++;
                break;
                
            case 'ArrowLeft':
                if(!canMove('left')) {
                    return;
                }

                emptyCell(getCell(row, col));
                board[row][col] = null;
                board[row][col-1] = current;
                getCell(row, col-1).style.backgroundImage = `url(${current.img})`;
                getCell(row, col-1).style.backgroundSize = `contain`; 
                getCell(row, col-1).style.backgroundRepeat = `no-repeat`;
                getCell(row, col-1).style.backgroundPosition = `center`;
                current.position.col--;
                break;
        }
    });
}

function canMove(direction) {
    const { row, col } = current.position;

    if(direction === 'left') {
        return col > 0 && board[row][col - 1] === null;
    }
    
    if(direction === 'right') {
        return col < config.cols - 1 && board[row][col + 1] === null;
    }
}

function drawScore() {
    let scoreElement = document.getElementById("stackingscore");
    scoreElement.innerHTML = `Score: ${score}`;
}

startGame();
addEvents();
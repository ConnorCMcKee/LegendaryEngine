/* CANVAS SETUP
-------------------------------------------------- */
var canvas = document.createElement("canvas");  // The canvas element
var ctx = canvas.getContext("2d");              // The 2D context element

// Determine appropriate size
var winWidth,       // The maximum width for the current window
    winHeight,      // The maximum height for the current window
    canvasWidth,    // the actual width of the canvas
    canvasHeight,   // The actual height of the canvas
    canvasScale;    // The multipler to be used on all coordinates

var scaleCanvas = function(){
    winWidth = window.innerWidth
    winHeight = window.innerHeight
    
    // Calculations regarding all canvas size (and scale) variables
    if( winWidth / 16 >= winHeight / 9 ) {
        canvasHeight = winHeight;
        canvasWidth = canvasHeight * (16/9);
    } else {
        canvasWidth = winWidth;
        canvasHeight = canvasWidth * (9/16);
    }
    canvasScale = canvasWidth / 1080.0;

    // Applies the appropriate values to the canvas
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
}
scaleCanvas();

// Appends the canvas to the body
document.body.appendChild(canvas);

// Adds the scaleCanvas resize event TODO determine if it's worth the performance cost to add resize event
// window.addEventListener("resize", scaleCanvas);


/* WINDOW SETUP
-------------------------------------------------- */
var w = window;
var requestAnimationFrame = w.requestAnimationFrame ||          // Standard/Modern
                            w.webkitRequestAnimationFrame ||    // Chrome and Safari
                            w.msRequestAnimationFrame ||        // Internet Explorer
                            w.mozRequestAnimationFrame;         // Firefox


/* GAME VARIABLES
-------------------------------------------------- */
var mastermind = null,      // Card of type Mastermind for the current game
    mastermindDeck = []     // A array of cards in the Mastermind deck
    scheme = null,          // Card of type Scheme for the current game
    escapedVillains = [],   // An array of cards in the Escaped Villains pile
    knockedOut = [],        // An array of cards in the "KO" pile
    shieldOfficers = 30,    // The number of remaining Shield Officers
    wounds = 30,            // The number of remaining Wounds
    bystanderDeck = [],     // An array of cards in the Bystanders pile
    villainDeck = [],       // An array of cards in the Villains deck
    heroDeck = [],          // An array of cards in the Heroes deck
    city = [null,null,null,null,null],          // An array of cards representing the five positions in the City
    headQuarters = [null,null,null,null,null],  // An array of cards representing the five positions in the "HQ"
    playerCount = 1,        // The number of players in the current game
    players = [],           // An array of Player objects for the current game
    selectedCard = null;    // The currently selected card
    eventQueue = [];        // A queau of events sorted by step number
    


/* TURN VARIABLES
-------------------------------------------------- */
var resourcePool = 0,       // The number of resources currently available to spend
    attackPool = 0,         // The number of attacks currently available to spend
    playedCards = [],       // An array of cards played so far this turn
    currentTurn = 1;        // The current turn number


/* FUNCTIONS
-------------------------------------------------- */

// The Fisher-Yates Shuffle
function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

// Insert into eventQueue
function addToEventQueue( step, action ) {
    eventQueue.push( {step: step, action: action} );
}
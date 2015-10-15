/* CANVAS SETUP
-------------------------------------------------- */
var canvas = document.createElement("canvas");  // The canvas element
var ctx = canvas.getContext("2d");              // The 2D context element
// Appends the appropriately-sized canvas to the html
canvas.width = 1080;
canvas.height = 900;
document.body.appendChild(canvas);


/* WINDOW SETUP
-------------------------------------------------- */
var w = window;
var requestAnimationFrame = w.requestAnimationFrame ||          // Standard/Modern
                            w.webkitRequestAnimationFrame ||    // Chrome and Safari
                            w.msRequestAnimationFrame ||        // Internet Explorer
                            w.mozRequestAnimationFrame;         // Firefox


/* GAME VARIABLES
-------------------------------------------------- */
var mastermind = null,      // Object of type Mastermind for the current game
    scheme = null,          // Object of type Scheme for the current game
    escapedVillains = [],   // An array of cards in the Escaped Villains pile
    knockedOut = [],        // An array of cards in the "KO" pile
    shieldOfficers = 30,    // The number of remaining Shield Officers
    wounds = 30,            // The number of remaining Wounds
    bystanders = [],        // An array of cards in the Bystanders pile
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
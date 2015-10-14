/* CANVAS SETUP
-------------------------------------------------- */
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1080;
canvas.height = 900;
document.body.appendChild(canvas);


/* WINDOW SETUP
-------------------------------------------------- */
var w = window;
var requestAnimationFrame = w.requestAnimationFrame ||
                            w.webkitRequestAnimationFrame ||
                            w.msRequestAnimationFrame ||
                            w.mozRequestAnimationFrame;

/* GAME VARIABLES
-------------------------------------------------- */
var mastermind = null,
    scheme = null,
    escapedVillains = [],
    knockedOut = [],
    shieldOfficers = 30,
    wounds = 30,
    bystanders = [],
    villainDeck = [],
    heroDeck = [],
    city = [],
    headQuarters = [],
    playerCount = 1,
    players = [];
    


/* TURN VARIABLES
-------------------------------------------------- */
var resourcePool = 0,
    attackPool = 0,
    playedCards = [],
    currentTurn = 1;


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
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
    headquarters = [null,null,null,null,null],  // An array of cards representing the five positions in the "HQ"
    playerCount = 1,        // The number of players in the current game
    players = [],           // An array of Player objects for the current game
    selectedCard = null;    // The currently selected card
    selectedCardLocation = {};  // The true location (x, y, and scale) of the selected card
    eventQueue = [];        // A queau of events sorted by step number
    


/* TURN VARIABLES
-------------------------------------------------- */
var resourcePool = 0,       // The number of resources currently available to spend
    attackPool = 0,         // The number of attacks currently available to spend
    playedCards = [],       // An array of cards played so far this turn
    currentTurn = 1;        // The current turn number


/* GENERAL USE FUNCTIONS
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


/* GAMEPLAY FUNCTIONS
-------------------------------------------------- */
// Draws a card from the villain deck and responds accordingly
function drawFromVillainDeck() {
    if( villainDeck[0].cardType === 'Villain' ) {
        // Appropriately positions the new villain
        switch( city.indexOf(null) ) {
            case -1:
                city[4].escape();
                escapedVillains.unshift(city[4].defineDestination(270, 130, 0.3));
            case 4:
                city[4] = city[3];
            case 3:
                city[3] = city[2];
            case 2:
                city[2] = city[1];
            case 1:
                city[1] = city[0];
            case 0:
                city[0] = villainDeck.shift().defineLocation(945, 300, 0.3);
                // TODO villain ambush
                break;
        }
        // Updates the destination(s) of villains
        for( var i = 0; i < 5; i++ ){
            var xPos = ((4-i)*135)+270;
            if( city[i] != null && city[i].x != xPos ) {
                city[i].defineDestination(xPos, 300, 0.3);
            }
        }
    } else {
        alert( 'NOT a villain' );   // TODO handle cards
    }
    return;
}

// Sets the selected card (and related variables) to the passed card, and moves appropriately
function selectCard( card ) {
    selectedCardLocation = { x: card.destX / canvasScale,
                             y: card.destY / canvasScale,
                             scale: card.destScale };
    card.defineDestination( (canvasWidth / 2), (canvasHeight / 2), 1.0 );
    selectedCard = card;
    return selectedCard;
}

// Sets the selected card to NULL, and returns the cards to its true location
function deselectCard() {
    selectedCard.defineDestination( selectedCardLocation.x, selectedCardLocation.y, selectedCardLocation.scale );
    selectedCardLocation = {};
    addToEventQueue( numUpdateSteps + 60, function(){   // FIXME deselectCard should not have knowledge of numUpdateSteps (especially before its definition)
        selectedCard = null;
    });
    return selectedCard;
}


/* DRAW FUNCTIONS
-------------------------------------------------- */
// Draw City
var drawCity = function( context ){
    for( var i = 0; i < city.length; i++ ){
        if( city[i] != null )
            city[i].draw( context );
    }
}

// Draw Deck Counts
var drawDeckCounts = function( context ){
    context.fillStyle = "rgb(250, 250, 250)";
    context.font = "36px Helvetica";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(bystanderDeck.length, 960, 85);
    //context.fillText(escapedVillains.length, )
    context.fillText(heroDeck.length, 960, 485);
    context.fillText(mastermindDeck.length, 40, 305)
    context.fillText(shieldOfficers, 40, 505)
    context.fillText(villainDeck.length, 960, 285);
    context.fillText(wounds, 785, 85);
}

// Draw Escaped Villains
var drawEscapedVillains = function( context ){
    if( escapedVillains.length > 1 && escapedVillains[0].y != escapedVillains[1].y ) {
        escapedVillains[1].draw( context );
    }
    
    if( escapedVillains.length > 0 ) {
        escapedVillains[0].draw( context );
    }
    
}

// Draw Headquarters
var drawHeadquarters = function( context ){
    for( var i = 0; i < headquarters.length; i++ ){
        if ( headquarters[i] != null )
            headquarters[i].draw( context );
    }
}

// Draws the Mastermind
var drawMastermind = function( context ){
    mastermind.draw(context);
}

// Draws the selected card
var drawSelected = function( context ){
    // Forces the drawing of the selected card
    if( selectedCard ){
        selectedCard.draw(context,true)
    }
}

// Draw Actors
var drawActors = function( context ) {
    drawHeadquarters( context );
    drawCity( context );
    drawEscapedVillains( context );
    drawMastermind( context );
    drawDeckCounts( context );
    players[(currentTurn % playerCount)].draw( context );
    
    // MUST be last
    drawSelected( context );
}


/* UPDATE FUNCTIONS
-------------------------------------------------- */
// Update Headquarters
var updateHeadquarters = function( modifier, steps ){
    for( var i = 0; i < headquarters.length; i++ ){
        if ( headquarters[i] != null )
            headquarters[i].update( modifier, steps );
    }
}

// Update City
var updateCity = function( modifier, steps ){
    for( var i = 0; i < city.length; i++ ){
        if( city[i] != null )
            city[i].update( modifier, steps );
    }
}

// Update Escaped Villains
var updateEscapedVillains = function( modifier, steps ){
    // TODO avoid processing ALL cards at once
    for( var i = 0; i < escapedVillains.length; i++ ) {
        escapedVillains[i].update( modifier, steps );
    }
}

// Update Actors
var updateActors = function( modifier, steps ) {
    while( eventQueue.length > 0 && eventQueue[0].step <= steps ) {
        eventQueue.shift().action();
    }
    
    updateHeadquarters( modifier, steps );
    updateCity( modifier, steps );
    updateEscapedVillains( modifier, steps );
    players[(currentTurn % playerCount)].update( modifier, steps );
}
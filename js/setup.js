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
    schemeTwistsPlayed = 0, // The number of scheme twists to enter play so far
    escapedVillains = [],   // An array of cards in the Escaped Villains pile
    knockedOut = [],        // An array of cards in the "KO" pile
    shieldOfficersDeck = [],// An array of Shield Officers
    woundDeck = [],         // The number of remaining Wounds
    bystanderDeck = [],     // An array of cards in the Bystanders pile
    villainDeck = [],       // An array of cards in the Villains deck
    heroDeck = [],          // An array of cards in the Heroes deck
    city = [null,null,null,null,null],          // An array of cards representing the five positions in the City
    headquarters = [null,null,null,null,null],  // An array of cards representing the five positions in the "HQ"
    playerCount = 1,        // The number of players in the current game
    players = [],           // An array of Player objects for the current game
    eventQueue = [];        // A queau of events sorted by step number
    

/* DISPLAY VARIABLES
-------------------------------------------------- */
var schemePanel = null,         // The top Panel-type item
    playerPanel = null,         // The bottom Panel-type item
    playerPanelPlayerNumber = 0,// PLayers index of currently shown player's area
    selectedCard = null,        // The currently selected card
    selectedCardLocation = {},  // The true location (x, y, and scale) of the selected card
    controls = [];              // An array of all controls (buttons) for the game


/* DISPLAY CONSTANTS
-------------------------------------------------- */
var SCHEME_ROW_Y = -52,
    VILLAIN_ROW_Y = 140,
    HERO_ROW_Y = 332,
    HAND_ROW_Y = 524,
    PLAYER_ROW_Y = 716,
    X_POSITIONS = [67.5, 202.5, 337.5, 472.5, 607.5, 742.5, 877.5, 1012.5],
    STANDARD_SCALE = 0.3;


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
                escapedVillains.unshift(city[4].defineDestination(X_POSITIONS[2], SCHEME_ROW_Y, 0.3));
            case 4:
                city[4] = city[3];
            case 3:
                city[3] = city[2];
            case 2:
                city[2] = city[1];
            case 1:
                city[1] = city[0];
            case 0:
                city[0] = villainDeck.shift().flip();
                // TODO villain ambush
                break;
        }
        // Updates the destination(s) of villains
        for( var i = 0; i < 5; i++ ){
            var xPos = X_POSITIONS[(4-i)+2];
            if( city[i] != null && city[i].x != xPos ) {
                city[i].defineDestination(xPos, VILLAIN_ROW_Y, 0.3);
            }
        }
    } else {
        alert( 'NOT a villain' );   // TODO handle cards
    }
    return;
}

// Sets the selected card (and related variables) to the passed card, and moves appropriately
function selectCard( card ) {
    // Forces the deselection of currently selected card, if applicable
    if( selectedCard != null )
        deselectCard( true );
    
    // Stores the location from which the selected card came
    selectedCardLocation = { x: card.destX / canvasScale,
                             y: card.destY / canvasScale,
                             scale: card.destScale };
    
    // Moves the selected card to the center of the screen, and grows
    card.defineDestination( 540, 300, 1.0 );
    
    // Assigns and returns the selected card
    selectedCard = card;
    return selectedCard;
}

// Sets the selected card to NULL, and returns the cards to its true location
function deselectCard( force ) {
    // Sets the optional "force" boolean
    force = force || false;
    
    // Stores the currently selected card to return
    var returnedCard = selectedCard;
    
    // Returns the selected card to its original destination, and resets the global location variable
    selectedCard.defineDestination( selectedCardLocation.x, selectedCardLocation.y, selectedCardLocation.scale );
    selectedCardLocation = {};
    
    // Forces an immediate deselection
    if ( force ){
        selectedCard = null;
    // Allows the card to deselect after it moves to its destination (remaining in the foreground)
    } else {
        addToEventQueue( numUpdateSteps + 60, function(){   // FIXME deselectCard should not have knowledge of numUpdateSteps (especially before its definition)
            selectedCard = null;
        });
    }
    
    // Returns the (formerly) selected card
    return returnedCard;
}


/* DRAW FUNCTIONS
-------------------------------------------------- */
// Draw Background
var drawBackground = function( context ){
    if (resourceReady('background')) {
        ctx.drawImage(resourceImage('background'), 0, 0, canvasWidth, canvasHeight);
    }
    
//    // Top Row
//    ctx.fillStyle = '#CFCFCF';
//    ctx.fillRect( 0, canvasHeight / 19, canvasWidth, (canvasHeight / 19)*6 );
//    
//    // Middle Row
//    ctx.fillStyle = '#E6E6E6';
//    ctx.fillRect( 0, (canvasHeight / 19)*7, canvasWidth, (canvasHeight / 19)*6 );
//    
//    // Bottom Row
//    ctx.fillStyle = '#CFCFCF';
//    ctx.fillRect( 0, (canvasHeight / 19)*13, canvasWidth, (canvasHeight / 19)*6 );
}

// Draw Bystanders
var drawBystanders = function( context ){
    if( bystanderDeck.length > 0 )
        bystanderDeck[0].draw( context );
}

// Draw City
var drawCity = function( context ){
    // Draws the cards in the city
    for( var i = 0; i < city.length; i++ ){
        if( city[i] != null )
            city[i].draw( context );
    }
    
    // Draws the villain deck
    if( villainDeck.length > 0 )
        villainDeck[0].draw( context );
}

// Draw controls
var drawControls = function( context ){
    // Draws the foreground stats and controls bar
    ctx.fillStyle = '#737373';
    ctx.fillRect( 0, 0, canvasWidth, canvasHeight / 19 );
    
    // Draws controls themselves
    for( var i = 0; i < controls.length; i++ ){
        if( controls[i].visible )
            controls[i].draw( context );
    }
}

// Draw Escaped Villains
var drawEscapedVillains = function( context ){
    // TODO make this logic smarter
    if( escapedVillains.length > 1 && escapedVillains[0].y != escapedVillains[1].y ) {
        escapedVillains[1].draw( context );
    }
    
    if( escapedVillains.length > 0 ) {
        escapedVillains[0].draw( context );
    }
}

// Draw Frame
var drawFrame = function( context ){
    if (resourceReady('frame')) {
        ctx.drawImage(resourceImage('frame'), 0, 0, canvasWidth, canvasHeight);
    }
}

// Draw Headquarters
var drawHeadquarters = function( context ){
    // Draws the cards in headquarters
    for( var i = 0; i < headquarters.length; i++ ){
        if ( headquarters[i] != null )
            headquarters[i].draw( context );
    }
    
    // Draws the hero deck
    if( heroDeck.length > 0 )
        heroDeck[0].draw( context );
}

// Draws the Mastermind
var drawMastermind = function( context ){
    // Draws the mastermind tactics cards
    for( var i = 0; i < mastermindDeck.length; i++ ){
        mastermindDeck[i].draw( context );
    }
    
    // Draws the mastermind
    mastermind.draw(context);
}

// Draws the Player Deck
var drawPlayerDeck = function( context ){
    var playerDeck = players[(currentTurn % playerCount)].drawDeck;
    
    if( playerDeck.length > 1 )
        playerDeck[1].draw( context );
    
    // Draws the top card of the deck
    if( playerDeck.length > 0 )
        playerDeck[0].draw( context );
}

// Draws the Player Discard
var drawPlayerDiscard = function( context ){
    var playerDiscard = players[(currentTurn % playerCount)].discardPile;
    
    if( playerDiscard.length > 1 )
        playerDiscard[1].draw( context );
    
    // Draws the top card of the deck
    if( playerDiscard.length > 0 )
        playerDiscard[0].draw( context );
}

// Draws the Player Panel
var drawPlayerPanel = function( context ){
    // Draws the Player Panel
    playerPanel.draw( context );
    
    // Draws the cards on the Player Panel
    drawPlayerDeck(context);
    drawPlayerDiscard( context );
}

// Draws the Scheme
var drawScheme = function( context ){
    scheme.draw(context);
}

// Draws the Scheme Panel
var drawSchemePanel = function( context ){
    // Draws the Scheme Panel
    schemePanel.draw( context );
    
    // Draws the cards on the Scheme Panel
    drawScheme( context );
    drawEscapedVillains( context );
    drawWounds( context );
    drawBystanders( context );
}

// Draws the selected card
var drawSelected = function( context ){
    // Forces the drawing of the selected card
    if( selectedCard ){
        selectedCard.draw(context,true)
    }
}

// Draws the Shield Officers deck
var drawShieldOfficers = function( context ){
    // TODO make this logic smarter
    // Draws the second card down of the deck if the top is exposed
    if( shieldOfficersDeck.length > 1 && shieldOfficersDeck[0].y != shieldOfficersDeck[1].y )
        shieldOfficersDeck[1].draw( context );
    
    // Draws the top card of the deck
    if( shieldOfficersDeck.length > 0 )
        shieldOfficersDeck[0].draw( context );
}

// Draws the Wounds deck
var drawWounds = function( context ){
    // TODO make this logic smarter
    // Draws the second card down of the deck if the top is exposed
    if( woundDeck.length > 1 )
        woundDeck[1].draw( context );
    
    // Draws the top card of the deck
    if( woundDeck.length > 0 )
        woundDeck[0].draw( context );
}

// Draw Actors
var drawActors = function( context ) {
    // Draws the background
    drawBackground( context );
    
    // Draws the villain row
    drawMastermind( context );
    drawCity( context );
    
    // Draws the scheme row (must be after villain row)
    drawSchemePanel( context );
    
    // Draw the hero row
    drawShieldOfficers( context );
    drawHeadquarters( context );
    
    // Draw the hand row
    players[(currentTurn % playerCount)].draw( context );
    
    // Draw the player row (must be after hand row)
    drawPlayerPanel( context );
    
    // Draw all controls (aka Buttons)
    drawControls( context );
    
    // FINALLY, draw the selected card
    drawSelected( context );
}


/* UPDATE FUNCTIONS
-------------------------------------------------- */
// Update Bystanders
var updateBystanders = function( modifier, steps ){
    // TODO make this logic smarter
    // Updates the second card down of the deck if the top is exposed
    if( bystanderDeck.length > 1 )
        bystanderDeck[1].update( modifier, steps );
    
    // Draws the top card of the deck
    if( bystanderDeck.length > 0 )
        bystanderDeck[0].update( modifier, steps );
}

// Update City
var updateCity = function( modifier, steps ){
    for( var i = 0; i < city.length; i++ ){
        if( city[i] != null )
            city[i].update( modifier, steps );
    }
}

// Update Controls
var updateControls = function( modifier, steps ){
    for( var i = 0; i < controls.length; i++ ){
        controls[i].update( modifier, steps );
    }
}

// Update Escaped Villains
var updateEscapedVillains = function( modifier, steps ){
    // TODO avoid processing ALL cards at once
    for( var i = 0; i < escapedVillains.length; i++ ) {
        escapedVillains[i].update( modifier, steps );
    }
}

// Update Headquarters
var updateHeadquarters = function( modifier, steps ){
    for( var i = 0; i < headquarters.length; i++ ){
        if ( headquarters[i] != null )
            headquarters[i].update( modifier, steps );
    }
}

// Update Mastermind
var updateMastermind = function( modifier, steps ){
    mastermind.update( modifier, steps );
}

// Updates the Player Deck
var updatePlayerDeck = function( modifier, steps ){
    var playerDeck = players[(currentTurn % playerCount)].drawDeck;
    
    if( playerDeck.length > 1 )
        playerDeck[1].update( modifier, steps );
    
    // Draws the top card of the deck
    if( playerDeck.length > 0 )
        playerDeck[0].update( modifier, steps );
}

// Updates the Player Discard
var updatePlayerDiscard = function( modifier, steps ){
    var playerDiscard = players[(currentTurn % playerCount)].discardPile;
    
    if( playerDiscard.length > 1 )
        playerDiscard[1].update( modifier, steps );
    
    // Draws the top card of the deck
    if( playerDiscard.length > 0 )
        playerDiscard[0].update( modifier, steps );
}

// Update Player Panel
var updatePlayerPanel = function( modifier, steps ){
    // Draws the Player Panel
    playerPanel.update( modifier, steps );
    
    // Draws the cards on the Player Panel
    updatePlayerDeck( modifier, steps );
    updatePlayerDiscard( modifier, steps );
}

// Update Scheme
var updateScheme = function( modifier, steps ){
    scheme.update( modifier, steps );
}

// Update Scheme Panel
var updateSchemePanel = function( modifier, steps ){
    // Draws the Scheme Panel
    schemePanel.update( modifier, steps );
    
    // Draws the cards on the Scheme Panel
    updateScheme( modifier, steps );
    updateEscapedVillains( modifier, steps );
    updateWounds( modifier, steps );
    updateBystanders( modifier, steps );
}

// Update Shield Officers
var updateShieldOfficers = function( modifier, steps ){
    // TODO determine if this effectively avoids the overprocessing done on the Escaped Villains Deck
    if( shieldOfficersDeck.length > 0 ){
        shieldOfficersDeck[0].update( modifier, steps );
    }
}

// Update Wounds
var updateWounds = function( modifier, steps ){
    // TODO make this logic smarter
    // Updates the second card down of the deck if the top is exposed
    if( woundDeck.length > 1 )
        woundDeck[1].update( modifier, steps );
    
    // Draws the top card of the deck
    if( woundDeck.length > 0 )
        woundDeck[0].update( modifier, steps );
}

// Update Actors
var updateActors = function( modifier, steps ) {
    // Performas appropriate eventQueue actions
    while( eventQueue.length > 0 && eventQueue[0].step <= steps ) {
        eventQueue.shift().action();
    }
    
    // Updates the Scheme Panel
    updateSchemePanel( modifier, steps );
    
    // Updates the Player Panel
    updatePlayerPanel( modifier, steps );
    
    // Updates cards
    updateCity( modifier, steps );
    updateHeadquarters( modifier, steps );
    updateMastermind( modifier, steps );
    updateShieldOfficers( modifier, steps );
    players[(currentTurn % playerCount)].update( modifier, steps );
    
    // Updates controls
    updateControls( modifier, steps );
}
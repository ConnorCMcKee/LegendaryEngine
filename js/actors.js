/* ACTOR VARIABLES
-------------------------------------------------- */
// Prepare Hero Deck
heroDeck = [ new Hero( 'cardBack', 'Silent Sniper', 'Black Widow', 'This is test text', 'Avengers', 'Red', 7, 3, 0, basePlay, baseGetAttack, baseGetResource ),
             new Hero( 'cardBack', 'Silent Sniper', 'Black Widow', 'This is test text', 'Avengers', 'Red', 7, 3, 0, basePlay, baseGetAttack, baseGetResource ),
             new Hero( 'cardBack', 'Silent Sniper', 'Black Widow', 'This is test text', 'Avengers', 'Red', 7, 3, 0, basePlay, baseGetAttack, baseGetResource ),
             new Hero( 'cardBack', 'Silent Sniper', 'Black Widow', 'This is test text', 'Avengers', 'Red', 7, 3, 0, basePlay, baseGetAttack, baseGetResource ),
             new Hero( 'cardBack', 'Silent Sniper', 'Black Widow', 'This is test text', 'Avengers', 'Red', 7, 3, 0, basePlay, baseGetAttack, baseGetResource ),
             new Hero( 'cardBack', 'Silent Sniper', 'Black Widow', 'This is test text', 'Avengers', 'Red', 7, 3, 0, basePlay, baseGetAttack, baseGetResource ),
             new Hero( 'cardBack', 'Silent Sniper', 'Black Widow', 'This is test text', 'Avengers', 'Red', 7, 3, 0, basePlay, baseGetAttack, baseGetResource ) ]

// Prepare the Villain Deck
villainDeck = [ new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ) ]

// Prepare Players
for( var i = 0; i < playerCount; i++ ){
    players[i] = new Player( i );
    players[i].drawUp();
}


/* HELPER FUNCTIONS
-------------------------------------------------- */
// 
function drawFromVillainDeck() {
    if( villainDeck[0].cardType === 'Villain' ) {
        // Appropriately positions the new villain
        switch( city.indexOf(null) ) {
            case -1:
                alert( 'Villain Escapes' ); // TODO make villains escape
            case 4:
                city[4] = city[3];
            case 3:
                city[3] = city[2];
            case 2:
                city[2] = city[1];
            case 1:
                city[1] = city[0];
            case 0:
                city[0] = villainDeck.shift().defineLocation(883, 230, 0.35);
                // TODO villain ambush
                break;
        }
        // Updates the destination(s) of villains
        for( var i = 0; i < 5; i++ ){
            var xPos = ((4-i)*135)+208;
            if( city[i] != null && city[i].x != xPos ) {
                city[i].defineDestination(xPos, 230, 0.35);
            }
        }
    } else {
        alert( 'NOT a villain' );   // TODO handle cards
    }
    return;
}


/* QUEUED EVENTS VARIABLES
-------------------------------------------------- */
// Prepare HeadQuarters
for( var i = 0; i < 5; i++ ){
    (function (iCopy) {
        var x = function(){ headQuarters.push( heroDeck.shift().defineLocation((5*135)+208, 430, 0.35).defineDestination((iCopy*135)+208, 430, 0.35) ) };
        addToEventQueue( iCopy*60, x );
    }(i));
}

// Prepare City
addToEventQueue( 300, drawFromVillainDeck );


/* DRAW METHODS
-------------------------------------------------- */
// Draw Headquarters
var drawHeadQuarters = function( context ){
    for( var i = 0; i < headQuarters.length; i++ ){
        if ( headQuarters[i] != null )
            headQuarters[i].draw( context );
    }
}

// Draw City
var drawCity = function( context ){
    for( var i = 0; i < city.length; i++ ){
        if( city[i] != null )
            city[i].draw( context );
    }
}

// Draw Actors
var drawActors = function( context ) {
    drawHeadQuarters( context );
    drawCity( context );
    players[(currentTurn % playerCount)].draw( context );
}


/* UPDATE METHODS
-------------------------------------------------- */
// Update Headquarters
var updateHeadQuarters = function( modifier, steps ){
    for( var i = 0; i < headQuarters.length; i++ ){
        if ( headQuarters[i] != null )
            headQuarters[i].update( modifier, steps );
    }
}

// Update City
var updateCity = function( modifier, steps ){
    for( var i = 0; i < city.length; i++ ){
        if( city[i] != null )
            city[i].update( modifier, steps );
    }
}

// Update Actors
var updateActors = function( modifier, steps ) {
    while( eventQueue.length > 0 && eventQueue[0].step <= steps ) {
        eventQueue.shift().action();
    }
    
    updateHeadQuarters( modifier, steps );
    updateCity( modifier, steps );
    players[(currentTurn % playerCount)].update( modifier, steps );
}
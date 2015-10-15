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

// Prepare HeadQuarters
while( headQuarters.length < 5 ) {
    headQuarters.push( heroDeck.shift().defineLocation((5*135)+208, 430, 0.35).defineDestination((headQuarters.length*135)+208, 430, 0.35) );
}

// Prepare the Villain Deck
villainDeck = [ new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ),
                new Villain( 'cardBack', 'Green Goblin', 'Sinister Syndicate', 'This is test text', 'Villain', 5, 5, baseAmbush, baseEscape, baseFight ) ]

// Prepare City TODO remove this step
while( city.length < 5 ) {
    city.push( villainDeck.shift().defineLocation((5*135)+208, 230, 0.35).defineDestination((city.length*135)+208, 230, 0.35 ) );
}

// Prepare Players
for( var i = 0; i < playerCount; i++ ){
    players[i] = new Player( i );
    players[i].drawUp();
}


/* DRAW METHODS
-------------------------------------------------- */

// Draw Headquarters
var drawHeadQuarters = function( context ){
    for( var i = 0; i < headQuarters.length; i++ ){
        headQuarters[i].draw( context );
    }
}

// Draw City
var drawCity = function( context ){
    for( var i = 0; i < city.length; i++ ){
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
        headQuarters[i].update( modifier, steps );
    }
}

// Update City
var updateCity = function( modifier, steps ){
    for( var i = 0; i < city.length; i++ ){
        city[i].update( modifier, steps );
    }
}

// Update Actors
var updateActors = function( modifier, steps ) {
    updateHeadQuarters( modifier, steps );
    updateCity( modifier, steps );
    players[(currentTurn % playerCount)].update( modifier, steps );
}
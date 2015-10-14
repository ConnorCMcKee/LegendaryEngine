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
    headQuarters.push( heroDeck.shift() );
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
    city.push( villainDeck.shift() );
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
        headQuarters[i].draw( context, (i*135)+208, 430, 0.35 );
    }
}

// Draw City
var drawCity = function( context ){
    for( var i = 0; i < city.length; i++ ){
        city[i].draw( context, (i*135)+208, 230, 0.35 );
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

// Update Actors
var updateActors = function( modifier, steps ) {
//    for( var i = 0; i < actors.length; i++ ) {
//        actors[i].update( modifier, steps );
//    }
}
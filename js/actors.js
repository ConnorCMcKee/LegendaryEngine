/* ACTOR VARIABLES
-------------------------------------------------- */
// Prepare Bystander Deck
var sampleBystanderStats = { title: 'Bystander',
                             text: 'I am a bystander',
                             baseScore: 1 }

bystanderDeck = [ new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ) ]

// Prepare Hero Deck
var sampleHeroStats = { title: 'Silent Sniper',
                        subtitle: 'Black Widow',
                        text: 'This is test text',
                        team: 'Avengers',
                        colors: ['Red'],
                        baseCost: 7,
                        baseAttack: 3 }

heroDeck = [ new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ) ]

heroDeck[0].colors = ['Red','Green'];

// Prepare Mastermind (and Deck)
mastermind = new Mastermind( { title: 'Magneto',
                               text: 'A wizard is never late...',
                               alwaysLeads: 'Brotherhood',
                               baseScore: 5,
                               baseStrength: 5 } ).defineLocation( 120, 315, 0.3 );

var sampleMastermindTacticStats = { title: 'First Tactic!',
                                    team: mastermind.title,
                                    subtype: 'Mastermind Tactic',
                                    text: 'FIGHT: This is a tactic',
                                    baseScore: mastermind.baseScore,
                                    baseStrength: mastermind.baseStrength }

mastermindDeck = [ new Villain( sampleMastermindTacticStats),
                   new Villain( sampleMastermindTacticStats),
                   new Villain( sampleMastermindTacticStats),
                   new Villain( sampleMastermindTacticStats) ]

// Prepare the Villain Deck
var sampleVillainStats = { title: 'Green Goblin',
                           team: 'Sinister Syndicate',
                           text: 'Sample Card Text',
                           baseScore: 5,
                           baseStrength: 5 }

villainDeck = [ new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ) ]

// Prepare Players
for( var i = 0; i < playerCount; i++ ){
    players[i] = new Player( i );
    players[i].drawUp();
}


/* HELPER FUNCTIONS
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


/* QUEUED EVENTS VARIABLES
-------------------------------------------------- */
// Prepare HeadQuarters
for( var i = 0; i < 5; i++ ){
    (function (iCopy) {
        var x = function(){ headQuarters[iCopy] = heroDeck.shift().defineLocation((5*135)+270, 510, 0.3).defineDestination((iCopy*135)+270, 510, 0.3) };
        addToEventQueue( iCopy*60, x );
    }(i));
}

// Prepare City
addToEventQueue( 300, drawFromVillainDeck );


/* DRAW METHODS
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
var drawHeadQuarters = function( context ){
    for( var i = 0; i < headQuarters.length; i++ ){
        if ( headQuarters[i] != null )
            headQuarters[i].draw( context );
    }
}

var drawMastermind = function( context ){
    mastermind.draw(context);
}

// Draw Actors
var drawActors = function( context ) {
    drawHeadQuarters( context );
    drawCity( context );
    drawEscapedVillains( context );
    drawMastermind( context );
    drawDeckCounts( context );
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
    
    updateHeadQuarters( modifier, steps );
    updateCity( modifier, steps );
    updateEscapedVillains( modifier, steps );
    players[(currentTurn % playerCount)].update( modifier, steps );
}
/* CARD ACTORS
-------------------------------------------------- */
// Bystander Deck
var sampleBystanderStats = { title: 'Bystander',
                             text: 'I am a bystander',
                             baseScore: 1,
                             faceDown: true,
                             faceUp: false };

bystanderDeck = [ new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ),
                  new Bystander( sampleBystanderStats ) ];

// Hero Deck
var sampleHeroStats = { title: 'Silent Sniper',
                        subtitle: 'Black Widow',
                        text: 'This is test text',
                        team: 'Avengers',
                        faceDown: true,
                        colors: ['Red'],
                        baseCost: 7,
                        baseAttack: 3 };

heroDeck = [ new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ),
             new Hero( sampleHeroStats ) ];

heroDeck[0].colors = ['Red','Green']; // This is simply to test gradients on cards

//  Mastermind (and Mastermind Deck)
mastermind = new Mastermind( { title: 'Magneto',
                               text: 'A wizard is never late...',
                               alwaysLeads: 'Brotherhood',
                               baseScore: 5,
                               baseStrength: 5 } );

var sampleMastermindTacticStats = { title: 'First Tactic!',
                                    team: mastermind.title,
                                    subtype: 'Mastermind Tactic',
                                    text: 'FIGHT: This is a tactic',
                                    faceDown: true,
                                    baseScore: mastermind.baseScore,
                                    baseStrength: mastermind.baseStrength };

mastermindDeck = [ new Villain( sampleMastermindTacticStats).defineLocation( X_POSITIONS[1]-40, VILLAIN_ROW_Y, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( X_POSITIONS[1]-30, VILLAIN_ROW_Y, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( X_POSITIONS[1]-20, VILLAIN_ROW_Y, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( X_POSITIONS[1]-10, VILLAIN_ROW_Y, 0.3 ) ];

// Scheme
scheme = new Scheme( { title: 'Do Bad Stuff', text: '...and lots of it.' } );

// Shield Officer Deck
var shieldOfficerStats = { title: 'Shield Officer',
                            subtitle: 'Shield',
                            team: 'Shield',
                            baseCost: 3,
                            baseResource: 3 };

shieldOfficersDeck = Array.apply(null, Array(30)).map(function(){return new Hero( shieldOfficerStats ).defineLocation(X_POSITIONS[1], HERO_ROW_Y, 0.3) });

// Villain Deck
var sampleVillainStats = { title: 'Green Goblin',
                           team: 'Sinister Syndicate',
                           text: 'Sample Card Text',
                           faceDown: true,
                           baseScore: 5,
                           baseStrength: 5 };

villainDeck = [ new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ),
                new Villain( sampleVillainStats ) ];

// Wound Deck
var woundDeck = Array.apply(null, Array(30)).map(function(){return new Wound()});


/* CONTROL ACTORS
-------------------------------------------------- */
// Play Selected Card from Hand button
controls.push( new Control({
    text: 'Play Card',
    width: 100,
    height: 70,
    x: 800,
    y: 300,
    visible: false,
    showCondition: function(){
        if( selectedCard != null && players[(currentTurn % playerCount)].hand.indexOf( selectedCard ) >= 0 && selectedCard.atLocation(540,300,1) ){
            return true;
        } else {
            return false;
        }
    }
}));

// Reveals or hides the Player Panel
controls.push( new Control({
    text: 'Player Panel',
    width: 120,
    height: 31,
    x: 186,
    y: 16,
    visible: true,
    enableCondition: function(){
        if( selectedCard == null ){
            return true;
        } else {
            return false;
        }
    },
    customClickAction: function(){
        var player = players[(currentTurn % playerCount)];
        
        if( playerPanel.hidden ){
            // Moves the player deck
            for (var i = 0; i < player.drawDeck.length; i++ ){
                player.drawDeck[i].defineYDestination( HAND_ROW_Y );
            }
            // Moves the player discard
            for (var i = 0; i < player.discardPile.length; i++ ){
                player.discardPile[i].defineYDestination( HAND_ROW_Y );
            }
        } else {
            // Moves the player deck
            for (var i = 0; i < player.drawDeck.length; i++ ){
                player.drawDeck[i].defineYDestination( PLAYER_ROW_Y );
            }
            // Moves the player discard
            for (var i = 0; i < player.discardPile.length; i++ ){
                player.discardPile[i].defineYDestination( PLAYER_ROW_Y );
            }
        }
        
        // Toggles the hidden state of Scheme Panel
        playerPanel.hidden = !playerPanel.hidden;
    }
}));

// Reveals or hides the Scheme Panel
controls.push( new Control({
    text: 'Scheme Panel',
    width: 120,
    height: 31,
    x: 62,
    y: 16,
    visible: true,
    enableCondition: function(){
        if( selectedCard == null ){
            return true;
        } else {
            return false;
        }
    },
    customClickAction: function(){
        if( schemePanel.hidden ){
            // Moves the panel
            scheme.defineYDestination( 140 );
            // Moves the wound deck
            for( var i = 0; i < woundDeck.length; i++ ){
                woundDeck[i].defineYDestination( 140 );
            }
            // Moves the bystander deck
            for( var i = 0; i < bystanderDeck.length; i++ ){
                bystanderDeck[i].defineYDestination( 140 );
            }
            // Moves the escaped villains deck
            for( var i = 0; i < escapedVillains.length; i++ ){
                escapedVillains[i].defineYDestination( 140 );
            }
        } else {
            // Moves the panel
            scheme.defineYDestination( -52 );
            // Moves the wound deck
            for( var i = 0; i < woundDeck.length; i++ ){
                woundDeck[i].defineYDestination( -52 );
            }
            // Moves the bystander deck
            for( var i = 0; i < bystanderDeck.length; i++ ){
                bystanderDeck[i].defineYDestination( -52 );
            }
            // Moves the escaped villains deck
            for( var i = 0; i < escapedVillains.length; i++ ){
                escapedVillains[i].defineYDestination( -52 );
            }
        }
        
        // Toggles the hidden state of Scheme Panel
        schemePanel.hidden = !schemePanel.hidden;
    }
}));


/* PANEL ACTORS
-------------------------------------------------- */
// The scheme (top) panel
schemePanel = new Panel({
    hiddenY: ( canvasHeight / 19.0 ) * -5
});

// The player (bottom) panel
playerPanel = new Panel({
    hiddenY: canvasHeight,
    shownY: ( canvasHeight / 19.0 ) * 13
});


/* PLAYER ACTORS
-------------------------------------------------- */
for( var i = 0; i < playerCount; i++ ){
    players[i] = new Player( i );
    players[i].drawUp();
}


/* QUEUED EVENTS VARIABLES
-------------------------------------------------- */
// Prepare Headquarters
for( var i = 0; i < 5; i++ ){
    (function (iCopy) {
        var x = function(){ headquarters[iCopy] = heroDeck.shift().flip().defineDestination((iCopy*135)+337.5, 332, 0.3) };
        addToEventQueue( iCopy*60, x );
    }(i));
}

// Prepare City
addToEventQueue( 300, drawFromVillainDeck );
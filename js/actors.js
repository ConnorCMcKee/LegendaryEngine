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
var heroStats = [];

heroStats.push( {title: 'Perfect Teamwork',
                 hero: 'Captain America',
                 text: '+1 attack per color you have',
                 team: 'Avengers',
                 colors: ['green'],
                 baseCost: 4,
                 baseAttack: 0,
                 customGetAttack: perfectTeamworkAttack})

heroStats.push( {title: 'Diving Block',
                 hero: 'Captain America',
                 text: 'Reveal to block a wound',
                 team: 'Avengers',
                 colors: ['black'],
                 baseCost: 6,
                 baseAttack: 4})

heroStats.push( {title: 'Avengers Assemble!',
                 hero: 'Captain America',
                 text: '+1 resource per color you have',
                 team: 'Avengers',
                 colors: ['gold'],
                 baseCost: 3,
                 baseResource: 0,
                 customGetResource: avengersAssembleResource})

heroStats.push( {title: 'A Day Unlike Any Other',
                 hero: 'Captain America',
                 text: '+3 attack per other Avenger',
                 team: 'Avengers',
                 colors: ['red'],
                 baseCost: 7,
                 baseAttack: 3,
                 customGetAttack: aDayUnlikeAnyOtherAttack})

heroDeck = [ new Hero( heroStats[0] ),
             new Hero( heroStats[0] ),
             new Hero( heroStats[0] ),
             new Hero( heroStats[0] ),
             new Hero( heroStats[0] ),
             new Hero( heroStats[1] ),
             new Hero( heroStats[1] ),
             new Hero( heroStats[1] ),
             new Hero( heroStats[2] ),
             new Hero( heroStats[2] ),
             new Hero( heroStats[2] ),
             new Hero( heroStats[2] ),
             new Hero( heroStats[2] ),
             new Hero( heroStats[3] ) ];

for( var i = 0; i < heroDeck.length; i++ )
    heroDeck[i].flip();

shuffle( heroDeck );

// Prepare Headquarters
for( var i = 0; i < 5; i++ ){
    drawFromHeroDeck();
}

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

mastermindDeck = [ new Villain( sampleMastermindTacticStats).defineLocation( X_POSITIONS[1]-10, VILLAIN_ROW_Y, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( X_POSITIONS[1]-20, VILLAIN_ROW_Y, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( X_POSITIONS[1]-30, VILLAIN_ROW_Y, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( X_POSITIONS[1]-40, VILLAIN_ROW_Y, 0.3 ) ];

// Scheme
scheme = new Scheme( { title: 'Do Bad Stuff', text: '...and lots of it.' } );

// Shield Officer Deck
var shieldOfficerStats = { title: 'Shield Officer',
                            hero: 'Maria Hill',
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
        if( selectedCard != null && players[(currentTurn % playerCount)].hand.indexOf( selectedCard ) >= 0 && selectedCard.atDestination() ){
            return true;
        } else {
            return false;
        }
    },
    customClickAction: function(){
        var toRemove = selectedCard;
        deselectCard();
        toRemove.play();
        players[(currentTurn % playerCount)].removeCardByObject( toRemove, 'play' );
    }
}));

// Buy Selected Card from Headquarters button
controls.push( new Control({
    text: 'Buy Card',
    width: 100,
    height: 70,
    x: 800,
    y: 300,
    visible: false,
    showCondition: function(){
        if( selectedCard != null && ( headquarters.indexOf( selectedCard ) >= 0 || selectedCard == shieldOfficersDeck[0] ) && selectedCard.atDestination() ){
            return true;
        } else {
            return false;
        }
    },
    enableCondition: function(){
        if( selectedCard != null && selectedCard.cost() <= resourcePool ) {
            return true;
        } else {
            return false;
        }
    },
    customClickAction: function(){
        // The buying player's discard pile
        var discardPile = players[(currentTurn % playerCount)].discardPile;
        // The cost of the card
        var cost = selectedCard.cost();
        
        if (selectedCard == shieldOfficersDeck[0] ) {
            discardPile.unshift( shieldOfficersDeck.shift() );
        } else {
            // THe index of the selected card in headquarters
            var index = headquarters.indexOf( selectedCard );
            // Puts the selected card into the player's discard pile
            discardPile.unshift( headquarters.splice( index, 1)[0]);
            // Puts null (as opposed to undefined) back into headquarters
            headquarters.push( null );
        }
        // Deselects the selected card
        deselectCard();
        // Sets the destination of the purchased cards
        discardPile[0].defineDestination( X_POSITIONS[6], PLAYER_ROW_Y, 0.3 )
        // Deducts the cost of the purchased card
        resourcePool -= cost;
        // Resets the headquarters
        drawFromHeroDeck();
    }
}));

// Fight Selected Card in City button
controls.push( new Control({
    text: 'Fight!',
    width: 100,
    height: 70,
    x: 800,
    y: 300,
    visible: false,
    showCondition: function(){
        if( selectedCard != null && ( city.indexOf( selectedCard ) >= 0 || selectedCard == mastermind ) && selectedCard.atDestination() ){
            return true;
        } else {
            return false;
        }
    },
    enableCondition: function(){
        if( selectedCard.strength() <= attackPool ){
            return true;
        } else {
            return false;
        }
    },
    customClickAction: function(){
        // The fighting player's victory pile
        var victoryPile = players[(currentTurn % playerCount)].victoryPile;
        // The strengh of the card
        var strength = selectedCard.strength();
        
        if (selectedCard == mastermind) {
            victoryPile.unshift( mastermindDeck.pop().flip() );
            victoryPile[0].defineDestination( X_POSITIONS[7], PLAYER_ROW_Y, 0.3 );
            selectCard( victoryPile[0] );
        } else {
            
        }
        
        attackPool -= strength;
    }
}));

// Reveals or hides the Player Panel
controls.push( new Control({
    text: 'Player Panel',
    width: 120,
    height: 31,
    x: 184,
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
            // Moves the played cards
            for (var i = 0; i < playedCards.length; i++ ){
                playedCards[i].defineYDestination( HAND_ROW_Y );
            }
            // Moves the player deck
            for (var i = 0; i < player.drawDeck.length; i++ ){
                player.drawDeck[i].defineYDestination( HAND_ROW_Y );
            }
            // Moves the player discard
            for (var i = 0; i < player.discardPile.length; i++ ){
                player.discardPile[i].defineYDestination( HAND_ROW_Y );
            }
            // Moves the player victory pile
            for (var i = 0; i < player.victoryPile.length; i++ ){
                player.victoryPile[i].defineYDestination( HAND_ROW_Y );
            }
        } else {
            // Moves the played cards
            for (var i = 0; i < playedCards.length; i++ ){
                playedCards[i].defineYDestination( PLAYER_ROW_Y );
            }
            // Moves the player deck
            for (var i = 0; i < player.drawDeck.length; i++ ){
                player.drawDeck[i].defineYDestination( PLAYER_ROW_Y );
            }
            // Moves the player discard
            for (var i = 0; i < player.discardPile.length; i++ ){
                player.discardPile[i].defineYDestination( PLAYER_ROW_Y );
            }
            // Moves the player victory pile
            for (var i = 0; i < player.victoryPile.length; i++ ){
                player.victoryPile[i].defineYDestination( PLAYER_ROW_Y );
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

// Ends turn
controls.push( new Control({
    text: 'End Turn',
    width: 120,
    height: 31,
    x: 1018,
    y: 16,
    visible: true,
    enableCondition: function(){
        return true;
    },
    customClickAction: function(){
        endTurn();
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
// Prepare City
addToEventQueue( 150, drawFromVillainDeck );
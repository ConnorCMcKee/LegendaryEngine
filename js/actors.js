/* CARD ACTORS
-------------------------------------------------- */
// Prepare Bystander Deck
var sampleBystanderStats = { title: 'Bystander',
                             text: 'I am a bystander',
                             baseScore: 1,
                             faceDown: true,
                             faceUp: false };

bystanderDeck = [ new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(945, 90, 0.3) ];

// Prepare Hero Deck
var sampleHeroStats = { title: 'Silent Sniper',
                        subtitle: 'Black Widow',
                        text: 'This is test text',
                        team: 'Avengers',
                        faceDown: true,
                        colors: ['Red'],
                        baseCost: 7,
                        baseAttack: 3 };

heroDeck = [ new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3),
             new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3),
             new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3),
             new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3),
             new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3),
             new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3),
             new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3),
             new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3),
             new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3),
             new Hero( sampleHeroStats ).defineLocation(945, 510, 0.3) ];

heroDeck[0].colors = ['Red','Green']; // This is simply to test gradients on cards

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
                                    faceDown: true,
                                    baseScore: mastermind.baseScore,
                                    baseStrength: mastermind.baseStrength };

mastermindDeck = [ new Villain( sampleMastermindTacticStats).defineLocation( 80, 315, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( 90, 315, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( 100, 315, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( 110, 315, 0.3 ) ];

// Prepare the Villain Deck
var sampleVillainStats = { title: 'Green Goblin',
                           team: 'Sinister Syndicate',
                           text: 'Sample Card Text',
                           faceDown: true,
                           baseScore: 5,
                           baseStrength: 5 };

villainDeck = [ new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3),
                new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3),
                new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3),
                new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3),
                new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3),
                new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3),
                new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3),
                new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3),
                new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3),
                new Villain( sampleVillainStats ).defineLocation(945, 300, 0.3) ];

// Prepare the Shield Officer Deck
var shieldOfficerStats = { title: 'Shield Officer',
                            subtitle: 'Shield',
                            team: 'Shield',
                            baseCost: 3,
                            baseResource: 3 };

shieldOfficersDeck = [ new Hero( shieldOfficerStats ).defineLocation(120, 510, 0.3),
                       new Hero( shieldOfficerStats ).defineLocation(120, 510, 0.3),
                       new Hero( shieldOfficerStats ).defineLocation(120, 510, 0.3),
                       new Hero( shieldOfficerStats ).defineLocation(120, 510, 0.3),
                       new Hero( shieldOfficerStats ).defineLocation(120, 510, 0.3) ]

// Prepare Players
for( var i = 0; i < playerCount; i++ ){
    players[i] = new Player( i );
    players[i].drawUp();
}


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

// Play Selected Card from Hand button
controls.push( new Control({
    text: 'Show Hand',
    width: 120,
    height: 50,
    x: 540,
    y: 40,
    visible: true,
    enableCondition: function(){
        if( selectedCard == null ){
            return true;
        } else {
            return false;
        }
    },
    customClickAction: function(){
        player = players[(currentTurn % playerCount)]
        player.arrangeHand(!player.handOnScreen);
        this.text = player.handOnScreen ? 'Hide Hand' : 'Show Hand';
    }
}));



/* QUEUED EVENTS VARIABLES
-------------------------------------------------- */
// Prepare Headquarters
for( var i = 0; i < 5; i++ ){
    (function (iCopy) {
        var x = function(){ headquarters[iCopy] = heroDeck.shift().flip().defineDestination((iCopy*135)+270, 510, 0.3) };
        addToEventQueue( iCopy*60, x );
    }(i));
}

// Prepare City
addToEventQueue( 300, drawFromVillainDeck );
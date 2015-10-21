/* CARD ACTORS
-------------------------------------------------- */
// Prepare Bystander Deck
var sampleBystanderStats = { title: 'Bystander',
                             text: 'I am a bystander',
                             baseScore: 1,
                             faceDown: true,
                             faceUp: false };

bystanderDeck = [ new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3),
                  new Bystander( sampleBystanderStats ).defineLocation(1000, 140, 0.3) ];

// Prepare Hero Deck
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

// Prepare Mastermind (and Deck)
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

mastermindDeck = [ new Villain( sampleMastermindTacticStats).defineLocation( 162.5, 140, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( 172.5, 140, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( 182.5, 140, 0.3 ),
                   new Villain( sampleMastermindTacticStats).defineLocation( 192.5, 140, 0.3 ) ];

// Prepare the Villain Deck
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

// Prepare the scheme
scheme = new Scheme( { title: 'Do Bad Stuff', text: '...and lots of it.' } ).defineLocation(120, -52, 0.3);

// Prepare the Shield Officer Deck
var shieldOfficerStats = { title: 'Shield Officer',
                            subtitle: 'Shield',
                            team: 'Shield',
                            baseCost: 3,
                            baseResource: 3 };

shieldOfficersDeck = [ new Hero( shieldOfficerStats ).defineLocation(67.5, 332, 0.3),
                       new Hero( shieldOfficerStats ).defineLocation(67.5, 332, 0.3),
                       new Hero( shieldOfficerStats ).defineLocation(67.5, 332, 0.3),
                       new Hero( shieldOfficerStats ).defineLocation(67.5, 332, 0.3),
                       new Hero( shieldOfficerStats ).defineLocation(67.5, 332, 0.3) ]

// Prepare the Wound Deck
var woundDeck = Array.apply(null, Array(30)).map(function(){return new Wound().defineLocation(810, 140, 0.3)});

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
    text: 'Scheme Panel',
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
        if( schemePanel.hidden ){
            schemePanel.hidden = false;
            scheme.defineYDestination( 140 );
            for( var i = 0; i < woundDeck.length; i++ ){
                woundDeck[i].defineYDestination( 140 );
            }
            for( var i = 0; i < bystanderDeck.length; i++ ){
                bystanderDeck[i].defineYDestination( 140 );
            }
        } else {
            schemePanel.hidden = true;
            scheme.defineYDestination( -52 );
            for( var i = 0; i < woundDeck.length; i++ ){
                woundDeck[i].defineYDestination( -52 );
            }
            for( var i = 0; i < bystanderDeck.length; i++ ){
                bystanderDeck[i].defineYDestination( -52 );
            }
        }
    }
}));


/* PANEL ACTORS
-------------------------------------------------- */
// The scheme (top) panel
schemePanel = new Panel({
    hiddenY: ( canvasHeight / 19.0 ) * -5
});


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
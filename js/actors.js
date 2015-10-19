/* CARD ACTORS
-------------------------------------------------- */
// Prepare Bystander Deck
var sampleBystanderStats = { title: 'Bystander',
                             text: 'I am a bystander',
                             baseScore: 1,
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

// Prepare Hero Deck
var sampleHeroStats = { title: 'Silent Sniper',
                        subtitle: 'Black Widow',
                        text: 'This is test text',
                        team: 'Avengers',
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
                                    baseStrength: mastermind.baseStrength };

mastermindDeck = [ new Villain( sampleMastermindTacticStats),
                   new Villain( sampleMastermindTacticStats),
                   new Villain( sampleMastermindTacticStats),
                   new Villain( sampleMastermindTacticStats) ];

// Prepare the Villain Deck
var sampleVillainStats = { title: 'Green Goblin',
                           team: 'Sinister Syndicate',
                           text: 'Sample Card Text',
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
    width: 100,
    height: 70,
    x: 540,
    y: 40,
    visible: false,
    showCondition: function(){
        if( selectedCard != null && players[(currentTurn % playerCount)].hand.indexOf( selectedCard ) >= 0 && selectedCard.atLocation(540,300,1) ){
            return true;
        } else {
            return false;
        }
    }
}));



/* QUEUED EVENTS VARIABLES
-------------------------------------------------- */
// Prepare Headquarters
for( var i = 0; i < 5; i++ ){
    (function (iCopy) {
        var x = function(){ headquarters[iCopy] = heroDeck.shift().defineLocation((5*135)+270, 510, 0.3).defineDestination((iCopy*135)+270, 510, 0.3) };
        addToEventQueue( iCopy*60, x );
    }(i));
}

// Prepare City
addToEventQueue( 300, drawFromVillainDeck );
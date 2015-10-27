/* HELPER FUNCTIONS
-------------------------------------------------- */
// Returns an array of the distinct values in play for an attribute
var distinctAttributesInArray = function( attribute, cards, arrayBoolean ){
    // Array of colors played
    var attributesInPlay = [];

    // Loops through all cards
    for (var i = 0; i < cards.length; i++){
        
        if( arrayBoolean ){
            // If attribute can contain multiple values, checks them all
            for(var j = 0; j < cards[i][attribute].length; j++){
                if( attributesInPlay.indexOf( cards[i][attribute][j] ) == -1 )
                    attributesInPlay.push( cards[i][attribute][j] );
            }
        } else {
            // Checks the single value
            if( attributesInPlay.indexOf( cards[i][attribute] ) == -1 )
                attributesInPlay.push( cards[i][attribute] );
        }
    }
    
    // Returns the array
    return attributesInPlay;
}

// Returns an array of cards containing the specified value of the specified attribute
var occurencesOfAttribute = function( attribute, cards, value, arrayBoolean ){
    // Array of cards matching the condition
    var occurenceCards = [];
    
    // Loops through all cards
    for (var i = 0; i < cards.length; i++){
        if( arrayBoolean ){
            // If the attribute can contain multiple values, checks them all
            for (var j = 0; j < cards[i][attribute].length; j++ ){
                if(cards[i][attribute][j] == value)
                    occurenceCards.push( cards[i] );
            }
        } else {
            // Checks the single value
            if(cards[i][attribute] == value)
                occurenceCards.push( cards[i] );
        }
    }
    
    // Returns the array of cards
    return occurenceCards;
}


/* GET ATTACK FUNCTIONS
-------------------------------------------------- */
var baseGetAttack = function( card ){
    return card.baseAttack || 0;
}

// Captain America - A Day Unlike Any Other
//  +3 Attack for every other distinct avenger played
var aDayUnlikeAnyOtherAttack = function( card ){
    // The distinct avengers in playedCards
    var avengers = distinctAttributesInArray( 'hero', occurencesOfAttribute('team', playedCards, 'Avengers', false ), false );
    
    // Returns modified value (factoring out Captain America)
    return baseGetAttack( card ) + avengers.length - ( avengers.indexOf('Captain America') < 0 ? 0 : 1 );
}

// Captain America - Perfect Teamwork
//  +1 Attack for every calor you have
var perfectTeamworkAttack = function( card ){
    // Returns modified value
    return baseGetAttack( card ) + distinctAttributesInArray( 'colors', playedCards.concat( players[(currentTurn%playerCount)].hand ), true ).length;
}


/* GET COST FUNCTIONS
-------------------------------------------------- */
var baseGetCost = function( card ){
    return card.baseCost || 0;
}


/* GET RESOURCE FUNCTIONS
-------------------------------------------------- */
var baseGetResource = function( card ){
    return card.baseResource || 0;
}

// Captain America - Avengers Assemble
//  +1 Resource for every calor you have
var avengersAssembleResource = function( card ){
    // Returns modified value
    return baseGetResource( card ) + distinctAttributesInArray( 'colors', playedCards.concat( players[(currentTurn%playerCount)].hand ), true ).length;
}


/* GET SCORE FUNCTIONS
-------------------------------------------------- */
var baseGetScore = function( card ){
    return card.baseScore;
}


/* GET STRENGTH FUNCTIONS
-------------------------------------------------- */
var baseGetStrength = function( card ){
    return card.baseStrength;
}

/* AMBUSH FUNCTIONS
-------------------------------------------------- */
var baseAmbush = function( card ){
    alert( card.title + ' Ambushed You!' );
    return;
}


/* ESCAPE FUNCTIONS
-------------------------------------------------- */
var baseEscape = function( card ){
    alert( card.title + ' Escaped!' );
    return;
}


/* FIGHT FUNCTIONS
-------------------------------------------------- */
var baseFight = function( card ){
    alert( card.title + ' Fought!' );
    return;
}


/* MASTER STRIKE FUNCTIONS
-------------------------------------------------- */
var baseMasterStrike = function(){
    alert( "You've been... Masterstruck! (by " + mastermind.title + ")" )
}


/* PLAY FUNCTIONS
-------------------------------------------------- */
var basePlay = function( card ){
    attackPool += card.attack();
    resourcePool += card.resource();
}


/* RESCUE FUNCTIONS
-------------------------------------------------- */
var baseRescue = function( card ){
    alert( card.title + ' was Rescued!' );
    return;
}


/* SCHEME TWIST FUNCTIONS
-------------------------------------------------- */
var baseSchemeTwistEffect = function(){
    alert( 'The scheme has twisted!' );
    return;
}


/* WIN CONDITION FUNCTIONS
-------------------------------------------------- */
var baseWinCondition = function(){
    if( scheme.schemeTwistCount <= schemeTwistsPlayed ) {
        return true;
    } else {
        return false;
    }
}
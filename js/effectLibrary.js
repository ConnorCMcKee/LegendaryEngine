/* GET ATTACK FUNCTIONS
-------------------------------------------------- */
var baseGetAttack = function( card ){
    return card.baseAttack;
}


/* GET COST FUNCTIONS
-------------------------------------------------- */
var baseGetCost = function( card ){
    return card.baseCost;
}


/* GET RESOURCE FUNCTIONS
-------------------------------------------------- */
var baseGetResource = function( card ){
    return card.baseResource;
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
    card.customAttack( card );
    card.customResource( card );
    return;
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
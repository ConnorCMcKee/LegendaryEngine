/* PLAY FUNCTIONS
-------------------------------------------------- */
var basePlay = function( card ){
    card.customAttack( card );
    card.customResource( card );
    return;
}


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


/* RESCUE FUNCTIONS
-------------------------------------------------- */
var baseMasterStrike = function( card ){
    alert( "You've been... Masterstruck! (by " + card.title + ")" )
}


/* RESCUE FUNCTIONS
-------------------------------------------------- */
var baseRescue = function( card ){
    alert( card.title + ' was Rescued!' );
    return;
}
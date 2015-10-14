var testing = 0;

/* PLAY FUNCTIONS
-------------------------------------------------- */
var basePlay = function( card ){
    testing += 1;
    card.customAttack( card );
    card.customResource( card );
    return;
}


/* GET ATTACK FUNCTIONS
-------------------------------------------------- */
var baseGetAttack = function( card ){
    testing += 1;
    return card.baseAttack;
}


/* GET RESOURCE FUNCTIONS
-------------------------------------------------- */
var baseGetResource = function( card ){
    testing += 1;
    return card.baseResource;
}


/* AMBUSH FUNCTIONS
-------------------------------------------------- */
var baseAmbush = function( card ){
    testing += 1;
    return;
}


/* ESCAPE FUNCTIONS
-------------------------------------------------- */
var baseEscape = function( card ){
    testing += 1;
    return;
}


/* FIGHT FUNCTIONS
-------------------------------------------------- */
var baseFight = function( card ){
    testing += 1;
    return;
}
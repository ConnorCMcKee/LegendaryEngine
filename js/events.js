/* MOUSE CONTROLS
-------------------------------------------------- */

canvas.addEventListener("mousedown", canvasClick, false);

function canvasClick(event)
{
    // Variable used to stop looking for clickable items once one has triggered
    var clickEventTriggered = false;
    
    for( var i = 0; i < controls.length; i++ ){
        if( controls[i].visible && controls[i].enabled && controls[i].containsPoint(event.x, event.y) ){
            controls[i].clickAction();
            clickEventTriggered = true;
            return;
        }
    }
    
    // If there are no selected cards
    if( selectedCard == null ) {
        // Build an array of all visible cards
        var visibleCards = []; // TODO make list of all visible cards
        
        // Adds current player's cards to the array
        visibleCards = players[(currentTurn % playerCount)].hand
                        .concat( headquarters.filter( function(n){ return n != null }) )
                        .concat( city.filter( function(n){ return n!= null }) )
                        .concat( [mastermind,
                                  shieldOfficersDeck[0],
                                  woundDeck[0]] );
        
        // Iterate through the array, looking for a card containing the mouseclick
        for( var i = 0; i < visibleCards.length; i++ ){
            if( visibleCards[i].containsPoint(event.x, event.y) ) {
                // Select the clicked card
                selectCard( visibleCards[i] );
                clickEventTriggered = true;
                return;
            }
        }
    
    // If there is a selected card
    } else {
        // Confirms that the selected card hasn't already been deselected (it's a 1-second process)
        if( Object.keys(selectedCardLocation).length != 0 ){
            // Deselects the selected card (initiating the 1-second deselection process)
            deselectCard();
        }
    }
}
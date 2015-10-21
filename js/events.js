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
        var visibleCards = [];
        
        // Hero Row cards (always visible when present)
        visibleCards = visibleCards.concat( headquarters.filter( function(n){ return n != null }) );
        if( shieldOfficersDeck.length > 0 )
            visibleCards.push( shieldOfficersDeck[0] );
        
        // Villain Row (visible if Scheme Panel is hidden)
        if( schemePanel.hidden ){
            visibleCards = visibleCards.concat( city.filter( function(n){ return n!= null }) );
            visibleCards.push( mastermind );
        } else {
        // Scheme Row (visible unless Scheme Panel is hidden)
            visibleCards.push( scheme );
            visibleCards.push( woundDeck[0] );
        }
        
        // Player hand (visible if Player Panel is hidden)
        // TODO Player Panel
            visibleCards = visibleCards.concat( players[(currentTurn % playerCount)].hand );
        
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
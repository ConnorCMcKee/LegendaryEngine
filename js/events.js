/* MOUSE CONTROLS
-------------------------------------------------- */

canvas.addEventListener("mousedown", canvasClick, false);

function canvasClick(event)
{
    // TOD increase performance!!!
    
    // If there are no selected cards
    if( selectedCard == null ) {
        // Build an array of all visible cards
        var visibleCards = []; // TODO make list of all visible cards
        
        // Adds current player's cards to the array
        for( var i = 0; i < players[(currentTurn % playerCount)].length; i++ ) {
            visibleCards.push( players[(currentTurn % playerCount)][i] );
        }
        
        // Adds the headquarters' cards to the array
        for( var i = 0; i < 5; i++ ) {
            if( headquarters[i] != null ) {
                visibleCards.push( headquarters[i] );
            }
        }
        
        // Adds the city's cards to the array
        for( var i = 0; i < 5; i++ ) {
            if( city[i] != null ) {
                visibleCards.push( city[i] );
            }
        }
        
        // Adds the mastermind to the array
        visibleCards.push( mastermind );
        
        // Iterate through the array, looking for a card containing the mouseclick
        for( var i = 0; i < visibleCards.length; i++ ){
            if( visibleCards[i].containsPoint(event.x, event.y) ) {
                // Select the clicked card
                selectCard( visibleCards[i] );
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
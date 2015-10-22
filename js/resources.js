/* RESOURCES HASH
-------------------------------------------------- */
var resources = {};


/* RESOURCES METHODS
-------------------------------------------------- */
// Add Resource
var addResource = function( name, path ) {
    resources[name] = {};
    resources[name]['ready'] = false;
    resources[name]['image'] = new Image();
    resources[name]['image'].onload = function() {
        resources[name]['ready'] = true;
    };
    resources[name]['image'].src = "images/" + path;
}

// Get Resource Image
var resourceImage = function( name ) {
    return resources[name]['image'];
}

// Get Resource Ready
var resourceReady = function( name ) {
    return resources[name]['ready'];
}



/* RESOURCE DECLARATIONS
-------------------------------------------------- */
// Background
addResource( 'background', 'common/background.jpg' );
// Frame
addResource( 'frame', 'common/frame.png' );
// Card Back
addResource( 'cardBack', 'common/cardBack.jpg' );
// Symbols
addResource( 'symbolAttack', 'common/symbolAttack.png' );
addResource( 'symbolResource', 'common/symbolResource.png' );
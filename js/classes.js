/* CARD (SUPER)
-------------------------------------------------- */
var Card = Class.create({
    // Constructor
    initialize: function(image, title, subtitle, text, faceDown){
        this.image = image || 'cardBack';
        this.title = title || 'NO NAME';
        this.subtitle = subtitle || '';
        this.text = text || '';
        this.colors = ['gray'];
        // Stats regarding the card's current location
        this.x = 0;
        this.y = 0;
        this.scale = 0;
        // Stats regarding the card's destination
        this.destX = 0;
        this.destY = 0;
        this.destScale = 0;
        // Boolean for the card's side-up
        this.faceDown = faceDown || false;
    },
    // Class Variable(s)
    baseWidth: 360 * canvasScale,
    baseHeight: 480 * canvasScale,
    movementSpeed: 700.0 * canvasScale,
    scaleSpeed: 1.5,
    cardType: "Undefined",
    // Determines if the card is at its destination
    atDestination: function(){
        if( this.x == this.destX && this.y == this.destY && this.scale == this.destScale ) {
            return true;
        } else {
            return false;
        }
    },
    // Determines if the card is at a specific location
    atLocation: function( x, y, scale ){
        if( this.x == x*canvasScale && this.y == y*canvasScale && this.scale == scale ) {
            return true;
        } else {
            return false;
        }
    },
    // Sets the card's location and forgets its destination (returns self)
    defineLocation: function(x, y, scale){
        this.x = x * canvasScale;
        this.destX = x * canvasScale;
        this.y = y * canvasScale;
        this.destY = y * canvasScale;
        this.scale = scale;
        this.destScale = scale;
        return this;
    },
    // Sets the card's destination (returns self)
    defineDestination: function(dx, dy, dscale){
        this.destX = dx * canvasScale;
        this.destY = dy * canvasScale;
        this.destScale = dscale;
        return this;
    },
    //
    defineXDestination: function( dx ){
        this.destX = dx*canvasScale;
        return this;
    },
    //
    defineYDestination: function( dy ){
        this.destY = dy*canvasScale;
        return this;
    },
    // Flips the card
    flip: function(){
        this.faceDown = !this.faceDown;
        return this;
    },
    // Checks if the passed cartesian coordinate exists with this card
    containsPoint: function(x, y){
        if( x >= this.x-(this.baseWidth/2*this.scale)
                && x <= this.x+(this.baseWidth/2*this.scale)
                && y >= this.y-(this.baseHeight/2*this.scale)
                && y <= this.y+(this.baseHeight/2*this.scale) ) {
            return true;
        } else {
            return false;
        }
    },
    // Draws the card
    draw: function(ctx){
        // Draws the black border
        ctx.fillStyle = 'Black';
        ctx.fillRect(this.x-(this.baseWidth/2*this.scale), this.y-(this.baseHeight/2*this.scale), this.baseWidth*this.scale, this.baseHeight*this.scale);

        // If the card is being rendered face UP
        if( !this.faceDown ){

            // Determines the correct color for the card's background
            if( this.colors.length < 2 ) {
                // Monochromatic fill
                ctx.fillStyle = this.colors[0];
            } else {
                // Gradient fill
                var gradient = ctx.createLinearGradient(0, this.y-(this.baseHeight/2*this.scale), 0, this.y+(this.baseHeight/2*this.scale));
 
                gradient.addColorStop(0.3, this.colors[0]);
                gradient.addColorStop(0.7, this.colors[1]);

                ctx.fillStyle=gradient;
            }

            // Draws the card's background
            ctx.fillRect(this.x-(this.baseWidth/2*this.scale*0.95), this.y-(this.baseHeight/2*this.scale*0.96), this.baseWidth*this.scale*0.95, this.baseHeight*this.scale*0.96);

            // Card title
            ctx.fillStyle = 'White';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.font = 30*this.scale*canvasScale + "px Helvetica";
            ctx.fillText( this.title, this.x, this.y-(this.baseHeight/2*this.scale*0.88), (this.baseWidth*this.scale*0.85) );

            // Card subtitle
            ctx.font = 22*this.scale*canvasScale + "px Helvitca";
            ctx.fillText( this.subtitle, this.x, this.y-(this.baseHeight/2*this.scale*0.78), (this.baseWidth*this.scale*0.85) );

            // Card image (if ready)
            if (resourceReady(this.image)) {
                ctx.drawImage(resourceImage(this.image), this.x-(this.baseWidth/2*this.scale*0.85), this.y-(this.baseHeight/2*this.scale*0.7), this.baseWidth*this.scale*0.85, this.baseHeight*this.scale*0.425 );
            }

            // Text  area
            ctx.fillStyle = 'White';
            ctx.fillRect(this.x-(this.baseWidth/2*this.scale*0.85), this.y+(this.baseHeight/2*this.scale*0.2), this.baseWidth*this.scale*0.85, this.baseHeight*this.scale*0.35);

            // Card text TODO support multi-line
            ctx.fillStyle = 'Black';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.fillText( this.text, this.x-(this.baseWidth/2*this.scale*0.65), this.y+(this.baseHeight/2*this.scale*0.2), this.baseWidth*this.scale*0.75 );

        // If the card is being rendered face DOWN
        } else {
            // Draws the card's background
            if (resourceReady(this.image)) {
                ctx.drawImage(resourceImage('cardBack'), this.x-(this.baseWidth/2*this.scale*0.95), this.y-(this.baseHeight/2*this.scale*0.96), this.baseWidth*this.scale*0.95, this.baseHeight*this.scale*0.96 );
            }
        }
            
    },
    // Updates the card (to be rendered accordingly)
    update: function(modifier,steps){
        // Updates scale
        if( this.scale != this.destScale ) {
            if( Math.abs(this.destScale - this.scale) < (this.scaleSpeed * modifier)){
                this.scale = this.destScale;
            } else {
                if( this.scale < this.destScale ){
                    this.scale = this.scale + (this.scaleSpeed*modifier);
                } else {
                    this.scale = this.scale - (this.scaleSpeed*modifier);
                }
            }
        }
        // Updates position
        if( this.x != this.destX || this.y != this.destY ){
            // Variables for determining new position
            var distX = Math.abs( this.destX - this.x );
            var distY = Math.abs( this.destY - this.y );
            var xSpeed = ( distY == 0 ? 1 : (distX/(distY+distX))) * this.movementSpeed * modifier;
            var ySpeed = ( distX == 0 ? 1 : (distY/(distY+distX))) * this.movementSpeed * modifier;
            // Updates X Position
            if( distX <= xSpeed ) {
                this.x = this.destX;
            } else {
                if( this.x < this.destX ){
                    this.x = this.x + xSpeed;
                } else {
                    this.x = this.x - xSpeed;
                }
            }
            // Updates Y Position
            if( distY <= ySpeed ) {
                this.y = this.destY;
            } else {
                if( this.y < this.destY ){
                    this.y = this.y + ySpeed;
                } else {
                    this.y = this.y - ySpeed;
                }
            }
        }
    }
});


/* BYSTANDER
-------------------------------------------------- */
var Bystander = Class.create(Card, {
    initialize: function($super, options ){
        $super( options.image, options.title, options.subtitle, options.text, options.faceDown );
        this.baseScore = options.baseScore || 1;
        this.getScore = options.getScore || baseGetScore;
        this.customRescue = options.customRescue || baseRescue;
        // Default position
        this.x = this.destX = X_POSITIONS[7] * canvasScale;
        this.y = this.destY = SCHEME_ROW_Y * canvasScale;
        this.scale = this.destScale = 0.3;
    },
    cardType: 'Bystander',
    rescue: function() {
        this.customRescue( this );
    }
});


/* HERO
-------------------------------------------------- */
var Hero = Class.create(Card, {
    initialize: function($super, options ){
        $super( options.image, options.title, options.hero, options.text, options.faceDown );
        this.team = options.team;
        this.hero = options.hero;
        this.colors = options.colors || ['gray'];
        this.baseCost = options.baseCost;
        this.baseAttack = options.baseAttack;
        this.baseResource = options.baseResource;
        this.customPlay = options.customPlay || basePlay;
        this.getCost = options.getCost || baseGetCost;
        this.getAttack = options.customGetAttack || baseGetAttack;
        this.getResource = options.customGetResource || baseGetResource;
        // Default position
        this.x = this.destX = X_POSITIONS[7] * canvasScale;
        this.y = this.destY = HERO_ROW_Y * canvasScale;
        this.scale = this.destScale = 0.3;
    },
    cardType: 'Hero',
    attack: function() {
        return this.getAttack( this );
    },
    cost: function() {
        return this.getCost( this );
    },
    resource: function() {
        return this.getResource( this );
    },
    play: function() {
        this.customPlay( this );
    },
    draw: function( $super, context ) {
        $super( context );
        
        // If the card is being rendered face UP
        if( !this.faceDown ){
            // Draws attack symbol and number
            if (this.baseAttack != null && resourceReady('symbolAttack')) {
                // Draws the image
                ctx.drawImage(resourceImage('symbolAttack'), this.x-this.baseWidth*this.scale*0.45, this.y+this.baseHeight*this.scale*0.15, this.baseWidth*this.scale*0.1, this.baseWidth*this.scale*0.1 );
                
                // Draws the value
                ctx.fillStyle = this.attack() == this.baseAttack ? 'black' : 'green';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = "bold " + 40*this.scale*canvasScale + "px Helvetica";
                ctx.fillText( this.attack(), this.x-this.baseWidth*this.scale*0.39, this.y+this.baseHeight*this.scale*0.14 );
            }

            // Draws resource symbol and number
            if (this.baseResource != null && resourceReady('symbolResource')) {
                // Draws the image
                ctx.drawImage(resourceImage('symbolResource'), this.x-this.baseWidth*this.scale*0.45, this.y+this.baseHeight*this.scale*0.3, this.baseWidth*this.scale*0.12, this.baseWidth*this.scale*0.12 );
                
                // Draws the value
                ctx.fillStyle = this.resource() == this.baseResource ? 'black' : 'green';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = "bold " + 40*this.scale*canvasScale + "px Helvetica";
                ctx.fillText( this.resource(), this.x-this.baseWidth*this.scale*0.39, this.y+this.baseHeight*this.scale*0.31 );
            }
            
            // Draws the cost symbol and number
            if (this.baseCost != null ) {
                // Draws the circle
                context.beginPath();
                context.arc(this.x+this.baseWidth*this.scale*0.38, this.y+this.baseHeight*this.scale*0.41, 30 * canvasScale * this.scale, 0, 2 * Math.PI, false);
                context.fillStyle = 'gold';
                context.fill();
                
                // Draws the value
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = "bold " + 35*this.scale*canvasScale + "px Helvetica";
                ctx.fillText( this.cost(), this.x+this.baseWidth*this.scale*0.38, this.y+this.baseHeight*this.scale*0.41 );
            }
        }
    }
});


/* MASTERMIND
-------------------------------------------------- */
var Mastermind = Class.create(Card, {
   initialize: function($super, options ){
        $super( options.image, options.title, 'Mastermind', options.text, options.faceDown );
        this.baseScore = options.baseScore || 1;
        this.baseStrength = options.baseStrength || 1;
        this.getScore = options.getScore || baseGetScore;
        this.getStrength = options.getStrength || baseGetStrength;
        this.alwaysLeads = options.alwaysLeads;
        this.customMasterStrike = options.customMasterStrike || baseMasterStrike;
        // Default position
        this.x = this.destX = X_POSITIONS[1] * canvasScale;
        this.y = this.destY = VILLAIN_ROW_Y * canvasScale;
        this.scale = this.destScale = 0.3;
    },
    cardType: 'Mastermind',
    masterStrike: function() {
        this.customMasterStrike();
    },
    score: function() {
        return this.getScore( this );
    },
    strength: function() {
        return this.getStrength( this );
    },
    draw: function($super, context){
        $super( context );
        
        // If the card is being rendered face UP
        if( !this.faceDown ){
            // Draws attack symbol and number
            if (this.baseStrength != 0 && resourceReady('symbolAttack')) {
                // Draws the image
                ctx.drawImage(resourceImage('symbolAttack'), this.x+this.baseWidth*this.scale*0.34, this.y+this.baseHeight*this.scale*0.38, this.baseWidth*this.scale*0.1, this.baseWidth*this.scale*0.1 );
                
                // Draws the value
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = "bold " + 40*this.scale*canvasScale + "px Helvetica";
                ctx.fillText( this.strength(), this.x+this.baseWidth*this.scale*0.39, this.y+this.baseHeight*this.scale*0.37 );
            }
        }
    }
});


/* SCHEME
-------------------------------------------------- */
var Scheme = Class.create(Card, {
   initialize: function($super, options ){
        $super( 'cardBack', options.title, 'Scheme', options.text, false );
        this.schemeTwistCount = options.schemeTwistCount || 6;
        this.schemeTwistEffects = options.schemeTwistEffects || Array.apply(null, Array(this.schemeTwistCount)).map( function(){return baseSchemeTwistEffect});
        this.customWinCondition = options.customWinCondition || baseWinCondition;
        // Default position
        this.x = this.destX = X_POSITIONS[1] * canvasScale;
        this.y = this.destY = SCHEME_ROW_Y * canvasScale;
        this.scale = this.destScale = 0.3;
    },
    cardType: 'Scheme',
    schemeTwist: function() {
        this.schemeTwistEffects[schemeTwistsPlayed]();
    },
    winCondition: function() {
        return customWinCondition();
    }
});


/* VILLAIN
-------------------------------------------------- */
var Villain = Class.create(Card, {
    initialize: function($super, options ){
        this.team = options.team
        this.subtype = options.subtype || 'Villain';
        $super( options.image, options.title, this.subtype + ' - ' + this.team, options.text, options.faceDown );
        this.baseScore = options.baseScore || 1;
        this.baseStrength = options.baseStrength || 1;
        this.getScore = options.getScore || baseGetScore;
        this.getStrength = options.getStrength || baseGetStrength;
        this.customAmbush = options.customAmbush || baseAmbush;
        this.customEscape = options.customEscape || baseEscape;
        this.customFight = options.customFight || baseFight;
        // Default position
        this.x = this.destX = X_POSITIONS[7] * canvasScale;
        this.y = this.destY = VILLAIN_ROW_Y * canvasScale;
        this.scale = this.destScale = 0.3;
    },
    cardType: 'Villain',
    ambush: function() {
        this.customAmbush( this );
    },
    escape: function() {
        this.customEscape( this );
    },
    fight: function() {
        this.customFight( this );
    },
    score: function() {
        return this.getScore( this );
    },
    strength: function() {
        return this.getStrength( this );
    },
    draw: function($super, context){
        $super( context );
        
        // If the card is being rendered face UP
        if( !this.faceDown ){
            // Draws attack symbol and number
            if (this.baseStrength != 0 && resourceReady('symbolAttack')) {
                // Draws the image
                ctx.drawImage(resourceImage('symbolAttack'), this.x+this.baseWidth*this.scale*0.34, this.y+this.baseHeight*this.scale*0.38, this.baseWidth*this.scale*0.1, this.baseWidth*this.scale*0.1 );
                
                // Draws the value
                ctx.fillStyle = 'black';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.font = "bold " + 40*this.scale*canvasScale + "px Helvetica";
                ctx.fillText( this.strength(), this.x+this.baseWidth*this.scale*0.39, this.y+this.baseHeight*this.scale*0.37 );
            }
        }
    }
});


/* WOUND
-------------------------------------------------- */
var Wound = Class.create(Card, {
    initialize: function($super){
        $super( 'cardBack', 'WOUND', '', "This is a wound's text", false );
        this.colors = ['red','black'];
        // Default position
        this.x = this.destX = X_POSITIONS[6] * canvasScale;
        this.y = this.destY = SCHEME_ROW_Y * canvasScale;
        this.scale = this.destScale = 0.3;
    },
    cardType: 'Wound',
    play: function() {
        alert( 'You just played a Wound!' );
    }
});


/* Player
-------------------------------------------------- */
var Player = Class.create({
    initialize: function(playerNumber){
        this.playerNumber = playerNumber;
        this.hand = [];
        // Builds the starting deck
        var trooperStats = {  title: 'Shield Trooper',
                              hero: 'Shield',
                              team: 'Shield',
                              baseAttack: 1,
                              faceDown: true };
        var agentStats = {  title: 'Shield Agent',
                            hero: 'Shield',
                            team: 'Shield',
                            baseResource: 1,
                            faceDown: true };
        this.drawDeck = shuffle( Array.apply(null, Array(4)).map(function(){return new Hero(trooperStats).defineLocation(X_POSITIONS[5],PLAYER_ROW_Y,0.3)})
                                                    .concat( Array.apply(null, Array(8)).map(function(){return new Hero(agentStats).defineLocation(X_POSITIONS[5],PLAYER_ROW_Y,0.3)}) ) );
        this.discardPile = [],
        this.victoryPile = [],
        this.artifacts = [];
    },
    removeCardByIndex: function( index, destination ){
        // The new location of the card
        var destinationArray,
            destinationX,
            destinationY;
        // Switch to choose the new location
        switch (destination.toLowerCase()){
            case 'discard':
                destinationArray = this.discardPile;
                destinationX = X_POSITIONS[6];
                destinationY = PLAYER_ROW_Y;
                break;
            case 'ko':
                destinationArray = knockedOut;
                destinationX = X_POSITIONS[6];
                destinationY = SCHEME_ROW_Y;
                break;
            case 'play':
                destinationArray = playedCards;
                destinationX = X_POSITIONS[0];
                destinationY = PLAYER_ROW_Y;
                break;
        }
        // Moves the card at hand[index] to discardPile[0]
        destinationArray.unshift( this.hand.splice( index, 1)[0] );
        // Rearranges hand for the new number of cards
        this.arrangeHand();
        // Returns the deleted card
        return destinationArray[0].defineDestination( destinationX, destinationY, 0.3 );
    },
    removeCardByObject: function( card, destination ){
        var index = this.hand.indexOf( card );
        if( index >= 0 ){
            this.removeCardByIndex( index, destination );
            return true;
        } else {
            return false;
        }
    },
    drawCard: function(){
        // Draws card TODO avoid errors on no remaining cards in deck OR discard
        if( this.drawDeck.length > 0 ){
            // Adds the top card of the deck to the player hand
            this.hand.push( this.drawDeck.shift().defineLocation(X_POSITIONS[5],PLAYER_ROW_Y,0.3).flip() );
        } else {
            // Flips the discard pile
            for ( var i = 0; i < this.discardPile.length; i++ ) {
                if ( i == 0 ) {
                    this.discardPile[i].defineXDestination(X_POSITIONS[5]).flip();
                } else {
                    this.discardPile[i].defineLocation(X_POSITIONS[5],this.discardPile[i].destY/canvasScale,0.3).flip();
                }
            }
            // Shuffles the discard pile into the draw pile
            this.drawDeck = shuffle( this.discardPile );
            // Resets the discard pile
            this.discardPile = [];
            // Recurses
            this.drawCard();
        }
        
        // Arranges Hand
        this.arrangeHand();
    },
    drawUp: function(){
        while( this.hand.length < 6 ) {
            this.drawCard();
        }
    },
    arrangeHand: function(){
        // Arranges cards in hand
        for( var i = 0; i < this.hand.length; i++ ){
            this.hand[i].defineDestination( i*(1080/this.hand.length)+(1080/this.hand.length)/2, HAND_ROW_Y, 0.3 );
        }
    },
    playByIndex: function( index ){
        // Moves the card at hand[index] to playedCards[0]
        playedCards.unshift( this.hand.splice( index, 1)[0] );
        // Rearranges hand for the new number of cards
        this.arrangeHand();
        // Returns the played card
        return playedCards[0].defineDestination( X_POSITIONS[1], PLAYER_ROW_Y, 0.3 );
    },
    playByObject: function( card ){
        index = this.hand.indexOf( card );
        if( index >= 0 ){
            this.playByIndex( index );
            return true;
        } else {
            return false;
        }
    },
    draw: function( ctx ){
        for( var i = 0; i < this.hand.length; i++ ){
            this.hand[i].draw( ctx );
        }
    },
    update: function( modifier,steps ){
        for( var i = 0; i < this.hand.length; i++ ){
            this.hand[i].update( modifier,steps );
        } 
    }
});


/* CONTROL
-------------------------------------------------- */
var Control = Class.create({
    initialize: function(options){
        // Display options
        this.text = options.text;
        this.color = options.color || 'Green';
        this.width = ( options.width || 200 ) * canvasScale;
        this.height = ( options.height || 200 ) * canvasScale;
        this.x = options.x * canvasScale || 0;
        this.y = options.y * canvasScale || 0;
        this.enabled = options.disabled || true;
        this.visible = options.visible || true;
        // OnClick Action
        this.customClickAction = options.customClickAction || function(){ alert('You clicked me!'); };
        // Show & Enable Condition
        this.showCondition = options.showCondition || function(){ return true; };
        this.enableCondition = options.enableCondition || function(){ return true; };
    },
    clickAction: function(){
        this.customClickAction();
    },
    // Checks if the passed cartesian coordinate exists with this card
    containsPoint: function(x, y){
        if( x >= this.x-this.width/2
                && x <= this.x+this.width/2
                && y >= this.y-this.height/2
                && y <= this.y+this.height/2 ) {
            return true;
        } else {
            return false;
        }
    },
    draw: function( ctx ){
        if( this.visible ) {
            // Draws the button shape
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x-(this.width/2), this.y-(this.height/2), this.width, this.height);
            
            // Draws the button text
            ctx.fillStyle = this.enabled ? "White" : "Gray";
            ctx.font = (16 * canvasScale) +"px Helvetica";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.text, this.x, this.y);
        }
    },
    update: function( modifier, steps ){
        if( this.showCondition() ) {
            this.visible = true;
            if( this.enableCondition() ) {
                this.enabled = true;
            } else {
                this.enabled = false;
            }
        } else {
            this.visible = false;
            this.enabled = false;
        }
    }
})


/* PANEL
-------------------------------------------------- */
var Panel = Class.create({
    initialize: function(options){
        // Display options
        this.color = options.color || 'Orange';
        this.hiddenY = options.hiddenY || 0;
        this.shownY = options.shownY || this.hiddenY + (canvasHeight / 19.0) * 6;
        this.hidden = options.hidden || true;
        this.y = this.hidden ? this.hiddenY : this.shownY;
    },
    baseX: 0,
    baseHeight: (canvasHeight / 19.0) * 6,
    baseWidth: canvasWidth,
    movementSpeed: 700.0 * canvasScale,
    draw: function( ctx ){
        // Draws the panel shape
        ctx.fillStyle = this.color;
        ctx.fillRect( this.baseX, this.y, this.baseWidth, this.baseHeight);
    },
    update: function( modifier, steps ){
        var destY = this.hidden ? this.hiddenY : this.shownY;
        
        if( this.y != destY ) {
            if( Math.abs( this.y - destY ) <= this.movementSpeed * modifier ) {
                this.y = destY;
            } else {
                if( this.y < destY ){
                    this.y += this.movementSpeed * modifier;
                } else {
                    this.y -= this.movementSpeed * modifier;
                }
            }
        } 
    }
})
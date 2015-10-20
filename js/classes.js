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
    draw: function(ctx, force){
        // Waits to draw the card if it's selected
        if( this != selectedCard || force ) {
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
                    for( var i = 0; i < this.colors.length; i++ ){
                        gradient.addColorStop(i, this.colors[i]);
                    }
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
        $super( options.image, options.title, options.subtitle, options.text, options.faceDown );
        this.team = options.team;
        this.colors = options.colors || ['gray'];
        this.baseCost = options.baseCost || 0;
        this.baseAttack = options.baseAttack || 0;
        this.baseResource = options.baseResource || 0;
        this.customPlay = options.customPlay || basePlay;
        this.getCost = options.getCost || baseGetCost;
        this.getAttack = options.customGetAttack || baseGetAttack;
        this.getResource = options.customGetResource || baseGetResource;
        // Default position
        this.x = 1012.5 * canvasScale;
        this.destX = 1012.5 * canvasScale;
        this.y = 332 * canvasScale;
        this.destY = 332 * canvasScale;
        this.scale = 0.3;
        this.destScale = 0.3;
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
        this.x = 202.5 * canvasScale;
        this.destX = 202.5 * canvasScale;
        this.y = 140 * canvasScale;
        this.destY = 140 * canvasScale;
        this.scale = 0.3;
        this.destScale = 0.3;
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
        this.x = 1012.5 * canvasScale;
        this.destX = 1012.5 * canvasScale;
        this.y = 140 * canvasScale;
        this.destY = 140 * canvasScale;
        this.scale = 0.3;
        this.destScale = 0.3;
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
    }
});


/* WOUND
-------------------------------------------------- */
var Wound = Class.create(Card, {
    initialize: function($super){
        $super( 'cardBack', 'WOUND', '', "This is a wound's text", false );
        this.colors = ['red','black'];
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
        this.handOnScreen = false;
        // Builds the starting deck
        var trooperStats = {  title: 'Shield Trooper',
                              subtitle: 'Shield',
                              team: 'Shield',
                              baseAttack: 1 };
        var agentStats = {  title: 'Shield Agent',
                            subtitle: 'Shield',
                            team: 'Shield',
                            baseResource: 1 };
        this.drawDeck = shuffle( Array.apply(null, Array(4)).map(function(){return new Hero(trooperStats)}).concat( Array.apply(null, Array(8)).map(function(){return new Hero(agentStats)}) ) );
        this.discardPile = [];
    },
    drawCard: function(){
        // Draws card
        if( this.drawDeck.length > 0 ){
            this.hand.push( this.drawDeck.shift().defineLocation(540,730,0.35) );
        } else {
            this.drawDeck = shuffle( this.discardPile );
            this.discardPile = [];
            this.hand.push( this.drawCard() );
        }
        
        // Arranges Hand
        this.arrangeHand( this.handOnScreen );
    },
    drawUp: function(){
        while( this.hand.length < 6 ) {
            this.drawCard();
        }
    },
    arrangeHand: function( showHand ){
        this.handOnScreen = showHand;
        // Arranges cards in hand
        for( var i = 0; i < this.hand.length; i++ ){
            if( showHand ) {
                this.hand[i].defineDestination( i*(1080/this.hand.length)+(1080/this.hand.length)/2, 300, 0.4 )
            } else {
                this.hand[i].defineDestination( 540, 730, 0.4 )
            }
        }
    },
    playFromHand(){
        
    },
    buyFromHQ(){
        
    },
    fightVillain(){
        
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
        if( x >= this.x-this.width
                && x <= this.x+this.width
                && y >= this.y-this.height
                && y <= this.y+this.height ) {
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
            ctx.font = (20 * canvasScale) +"px Helvetica";
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
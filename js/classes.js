/* CARD (SUPER)
-------------------------------------------------- */
var Card = Class.create({
    // Constructor
    initialize: function(resource, title, subtitle, text){
        this.resource = resource;
        this.title = title;
        this.subtitle = subtitle;
        this.text = text;
        this.color = 'gray';
        // Stats regarding the card's current location
        this.x = 0;
        this.y = 0;
        this.scale = 0;
        // Stats regarding the card's destination
        this.destX = 0;
        this.destY = 0;
        this.destScale = 0;
    },
    // Class Variable(s)
    baseWidth: 360,
    baseHeight: 480,
    movementSpeed: 400.0,
    scaleSpeed: 0.625,
    // Sets the card's location and forgets its destination (returns self)
    defineLocation: function(x, y, scale){
        this.x = x;
        this.destX = x;
        this.y = y;
        this.destY = y;
        this.scale = scale;
        this.destScale = scale;
        return this;
    },
    // Sets the card's destination (returns self)
    defineDestination: function(dx, dy, dscale){
        this.destX = dx;
        this.destY = dy;
        this.destScale = dscale;
        return this;
    },
    // Draws the card
    draw: function(ctx){
        // Card shape in appropriate color
        ctx.fillStyle = this.color;
        ctx.fillRect( this.x, this.y, this.baseWidth*this.scale, this.baseHeight*this.scale);
        // Card content area
        ctx.fillStyle = 'white';
        ctx.fillRect( this.x+(10*this.scale), this.y+(10*this.scale), (this.baseWidth-20)*this.scale, (this.baseHeight-20)*this.scale );
        // Card title
        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = 24*this.scale + "px Helvetica";
        ctx.fillText( this.title, this.x+(this.baseWidth*this.scale/2), this.y+(30*this.scale), (this.baseWidth-20)*this.scale );
        // Card subtitle
        ctx.font = 18*this.scale + "px Helvitca";
        ctx.fillText( this.subtitle, this.x+(this.baseWidth*this.scale/2), this.y+(48*this.scale), (this.baseWidth-20)*this.scale );
        // Card image (if ready)
        if (resourceReady(this.resource)) {
            ctx.drawImage(resourceImage(this.resource), this.x+(15*this.scale), this.y+(60*this.scale), (this.baseWidth-30)*this.scale, 200*this.scale );
        }
        // Card text TODO support multi-line
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText( this.text, this.x+(60*this.scale), this.y+(270*this.scale), (this.baseWidth-70)*this.scale );
    },
    // Updates the card (to be rendered accordingly)
    update: function(modifier,steps){
        // Updates scale
        if( this.scale != this.destScale ) {
            if( Math.abs(this.destScale - this.scale) < this.scale+(this.scaleSpeed * modifier) ){
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
            var xSpeed = ( distY == 0 ? 1 : (distX/distY) ) * this.movementSpeed * modifier;
            var ySpeed = ( distX == 0 ? 1 : (distY/distX) ) * this.movementSpeed * modifier;
            // Updates X Position
            if( distX < xSpeed ) {
                this.x = parseInt( this.destX );
            } else {
                if( this.x < this.destX ){
                    this.x = parseInt( this.x + xSpeed );
                } else {
                    this.x = parseInt( this.x - xSpeed );
                }
            }
            // Updates Y Position
            if( distY < ySpeed ) {
                this.y = parseInt( this.destY );
            } else {
                if( this.y < this.destY ){
                    this.y = parseInt( this.y + ySpeed );
                } else {
                    this.y = parseInt( this.y - ySpeed );
                }
            }
        }
    }
});



/* HERO
-------------------------------------------------- */
var Hero = Class.create(Card, {
    initialize: function($super, resource, title, subtitle, text, team, color, cost, baseAttack, baseResource, customPlay, customGetAttack, customGetResource ){
        $super( resource, title, subtitle, text );
        this.team = team;
        this.color = color;
        this.cost = cost;
        this.baseAttack = baseAttack;
        this.baseResource = baseResource;
        this.customPlay = customPlay;
        this.getAttack = customGetAttack;
        this.getResource = customGetResource;
    },
    play: function() {
        this.customPlay( this );
    }
});



/* VILLAIN
-------------------------------------------------- */
var Villain = Class.create(Card, {
    initialize: function($super, resource, title, subtitle, text, type, score, baseStrength, getStrength, customAmbush, customEscape, customFight ){
        $super( resource, title, subtitle, text );
        this.type = type;
        this.score = score;
        this.baseStrength = baseStrength;
        this.getStrength = getStrength;
        this.customAmbush = customAmbush;
        this.customEscape = customEscape;
        this.customFight = customFight;
    },
    ambush: function() {
        this.customAmbush( this );
    },
    escape: function() {
        this.customEscape( this );
    },
    fight: function() {
        this.customFight( this );
    }
});


/* HAND
-------------------------------------------------- */
var Player = Class.create({
    initialize: function(playerNumber){
        this.playerNumber = playerNumber;
        this.hand = [];
        // Builds the starting deck
        var trooper = new Hero( 'cardBack', 'Shield Trooper', 'Shield', '', 'Shield', 'gray', 0, 1, 0, basePlay, baseGetAttack, baseGetResource );
        var agent = new Hero( 'cardBack', 'Shield Agent', 'Shield', '', 'Shield', 'gray', 0, 0, 1, basePlay, baseGetAttack, baseGetResource );
        this.drawDeck = shuffle( Array.apply(null, Array(4)).map(function(){return trooper}).concat( Array.apply(null, Array(8)).map(function(){return agent}) ) );
        this.discardPile = [];
    },
    drawCard: function(){
        if( this.drawDeck.length > 0 ){
            this.hand.push( this.drawDeck.shift() );
        } else {
            this.drawDeck = shuffle( this.discardPile );
            this.discardPile = [];
            this.hand.push( this.drawCard() );
        }
    },
    drawUp: function(){
        while( this.hand.length < 6 ) {
            this.drawCard();
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
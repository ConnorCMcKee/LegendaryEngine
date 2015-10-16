/* CARD (SUPER)
-------------------------------------------------- */
var Card = Class.create({
    // Constructor
    initialize: function(image, title, subtitle, text){
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
    },
    // Class Variable(s)
    baseWidth: 360,
    baseHeight: 480,
    movementSpeed: 400.0,
    scaleSpeed: 0.625,
    cardType: "Undefined",
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
        ctx.fillStyle = this.colors[0]; // TODO gradient
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
        if (resourceReady(this.image)) {
            ctx.drawImage(resourceImage(this.image), this.x+(15*this.scale), this.y+(60*this.scale), (this.baseWidth-30)*this.scale, 200*this.scale );
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


/* BYSTANDER
-------------------------------------------------- */
var Bystander = Class.create(Card, {
    initialize: function($super, options ){
        $super( options.image, options.title, options.subtitle, options.text );
        this.baseScore = options.baseScore || 1;
        this.getScore = options.getScore || baseGetScore;
        this.customRescue = options.customRescue || baseRescue;
    },
    cardType: 'Bystander',
    rescue: function() {
        this.customRescue( this );
    }
});


// TODO rework subtitles

/* HERO
-------------------------------------------------- */
var Hero = Class.create(Card, {
    initialize: function($super, options ){
        $super( options.image, options.title, options.subtitle, options.text );
        this.team = options.team;
        this.colors = options.colors || ['gray'];
        this.baseCost = options.baseCost || 0;
        this.baseAttack = options.baseAttack || 0;
        this.baseResource = options.baseResource || 0;
        this.customPlay = options.customPlay || basePlay;
        this.getCost = options.getCost || baseGetCost;
        this.getAttack = options.customGetAttack || baseGetAttack;
        this.getResource = options.customGetResource || baseGetResource;
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
        $super( options.image, options.title, 'Mastermind', options.text );
        this.baseScore = options.baseScore || 1;
        this.baseStrength = options.baseStrength || 1;
        this.getScore = options.getScore || baseGetScore;
        this.getStrength = options.getStrength || baseGetStrength;
        this.alwaysLeads = options.alwaysLeads;
        this.customMasterStrike = options.customMasterStrike || baseMasterStrike;
    },
    cardType: 'Mastermind',
    score: function() {
        return this.getScore( this );
    },
    strength: function() {
        return this.getStrength( this );
    }
});


/* VILLAIN
-------------------------------------------------- */
var Villain = Class.create(Card, {
    initialize: function($super, options ){
        this.team = options.team
        this.subtype = options.subtype || 'Villain';
        $super( options.image, options.title, this.subtype + ' - ' + this.team, options.text );
        this.baseScore = options.baseScore || 1;
        this.baseStrength = options.baseStrength || 1;
        this.getScore = options.getScore || baseGetScore;
        this.getStrength = options.getStrength || baseGetStrength;
        this.customAmbush = options.customAmbush || baseAmbush;
        this.customEscape = options.customEscape || baseEscape;
        this.customFight = options.customFight || baseFight;
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


/* HAND
-------------------------------------------------- */
var Player = Class.create({
    initialize: function(playerNumber){
        this.playerNumber = playerNumber;
        this.hand = [];
        // Builds the starting deck
        var trooper = new Hero( { title: 'Shield Trooper',
                                  subtitle: 'Shield',
                                  team: 'Shield',
                                  baseAttack: 1 } );
        var agent = new Hero( { title: 'Shield Agent',
                                subtitle: 'Shield',
                                team: 'Shield',
                                baseResource: 1 } );
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
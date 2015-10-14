/* CARD (SUPER)
-------------------------------------------------- */
var Card = Class.create({
    initialize: function(resource, title, subtitle, text){
        this.resource = resource;
        this.title = title;
        this.subtitle = subtitle;
        this.text = text;
        this.color = 'gray';
    },
    draw: function(ctx, x, y, scale){
        // Card shape in appropriate color
        ctx.fillStyle = this.color;
        ctx.fillRect( x, y, 360*scale, 480*scale);
        // Card content area
        ctx.fillStyle = 'white';
        ctx.fillRect( x+(10*scale), y+(10*scale), (360-20)*scale, (480-20)*scale );
        // Card title
        ctx.fillStyle = 'black';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = 24*scale + "px Helvetica";
        ctx.fillText( this.title, x+(360*scale/2), y+(30*scale), (360-20)*scale );
        // Card subtitle
        ctx.font = 18*scale + "px Helvitca";
        ctx.fillText( this.subtitle, x+(360*scale/2), y+(48*scale), (360-20)*scale );
        // Card image (if ready)
        if (resourceReady(this.resource)) {
            ctx.drawImage(resourceImage(this.resource), x+(15*scale), y+(60*scale), (360-30)*scale, 200*scale );
        }
        // Card text TODO support multi-line
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText( this.text, x+(60*scale), y+(270*scale), (360-70)*scale );
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
            this.hand[i].draw( ctx, (165*i)+50, 600, 0.4 );
        }
    }
});
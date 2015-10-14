/* LOOP VARIABLES
-------------------------------------------------- */
var delta = 0,              // Time elapsed between frames
    lastFrameTimeMs = 0,    // Time of the last frame
    maxFPS = 60,            // FPS Throttle
    timestep = 1000/60,     // Length of time to be processed at once
    numUpdateSteps = 1,     // Steps since last sanity check
    frameId,                // Current frame
    running = false,        // The mainLoop is currently running
    started = false;        // The mainLoop has been started


/* UPDATE
-------------------------------------------------- */
var update = function(step) {
    updateActors( step / 1000, numUpdateSteps );
};
        
        
/* DRAW
-------------------------------------------------- */
var draw = function() {
    if (resourceReady('background')) {
        ctx.drawImage(resourceImage('background'), 0, 0, 1080, 640);
    }
    
    drawActors( ctx );

    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Update Steps: " + numUpdateSteps, 32, 32);
};


/* MAIN LOOP
-------------------------------------------------- */
var mainLoop = function(timestamp) {
    // Throttle FPS
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)){
        frameId = requestAnimationFrame(mainLoop);
        return;
    }
    
    // Time not-yet simulated
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;
    
    // Elapsed time in fixed chunks
    while (delta >= timestep) {
        update(timestep);
        delta -= timestep;
        
        // Sanity check
        if (++numUpdateSteps % 240 == 0) {
            panic();
            break;
        }
    }
    
    draw();
    requestAnimationFrame(mainLoop);
};


/* PANIC
-------------------------------------------------- */
var panic = function() {
    delta = 0;
}
        
    
/* STOP
-------------------------------------------------- */
function stop() {
    running = false;
    started = false;
    cancelAnimationFrame( frameId );
}


/* START
-------------------------------------------------- */
function start() {
    if(!started){
        started = true;
        frameId = requestAnimationFrame( function(timestamp) {
            draw();
            running = true;
            lastFrameTimeMs = timestamp;
            frameId = requestAnimationFrame(mainLoop);
        });
    }
}


/* LAUNCH!
-------------------------------------------------- */
start();
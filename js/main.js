// Support older versions of requestAnimationFrame
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 4);
          };
})();

var cell_dim = 64;              // cells are squares, only need one dimension
var LETTERNUM = 3;              // magic number for now on number of letters
var moveQ = []                  // makin moveQ global cuz fuckit
var swoosh = "../sounds/Swoosh03.mp3";
var alphabet = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");

$(document).ready(function(){

    $('body').bind("touchmove", {}, function(event){
        event.preventDefault();
    });

    $('.start').on("click", function() {
        $('.m-instruct, .m-overlay').fadeOut();
        drawSnake(ctx, Snake);
        drawLetters(ctx, Letters);
        // go go go
        animationLoop();
    });

    // restart attempt & fail
    
    $('.restart').on("click", function() {
        $('.over, .m-overlay').fadeOut();   
        location.reload(true);
    });

    var windowH = $(window).height();
    var windowW = $(window).width();

    $("#canvas").attr({
        height: windowH,
        width: windowW
    });

    var canvas = document.getElementById("canvas");
        
    /*
      When the player swipes the screen a certain way, it will add the moves to a move Queue.
      I think this is necessary because in Snake, you want to do a lot of fast sequential moves.
     */
    var rightswipe = Hammer(canvas).on("swiperight", function(event){
        moveQ.push({x:1,y:0});
        playSound(swoosh);
    });
    var leftswipe = Hammer(canvas).on("swipeleft", function(event){
        moveQ.push({x:-1,y:0});
        playSound(swoosh);
    });
    var upswipe = Hammer(canvas).on("swipeup", function(event){
        moveQ.push({x:0,y:-1});
        playSound(swoosh);
    });
    var downswipe = Hammer(canvas).on("swipedown", function(event){
        moveQ.push({x:0,y:1});
        playSound(swoosh);
    });

    /* Adding arrowkey functionality for testing on PC */
    document.onkeydown = checkKey;
    function checkKey(e) {
        e = e || window.event;
        switch(e.keyCode) {
            case 39: //right
                moveQ.push({x:1,y:0});
                break;
            case 37: //left
                moveQ.push({x:-1,y:0});
                break;
            case 38: //up
                moveQ.push({x:0,y:-1});
                break;
            case 40: //down
                moveQ.push({x:0,y:1});
                break;
        }
        playSound(swoosh);
    }
            
    var ctx = canvas.getContext("2d");

    var Grid = {};
    Grid.width = windowW/cell_dim;
    Grid.height = windowH/cell_dim;
    
    var Snake = {
        body:[{
            x:0, 
            y:0,
            ch: 64  // char code 64 is A-1
        }], 
        direction:{x:1, y:0}
    }
    Grid[0] = {0:"snake"}

    var Letters = [];
    for (var i = 0; i < LETTERNUM; i ++) {
        generateLetter(Letters, Grid)
    }

  
    var last = Date.now()
    var FPS = 4
    var animframeid
    function animationLoop(){
        if (Date.now() - last >= 1000/FPS){
            var gameover = step(Snake, Grid, Letters)
            clearCanvas(ctx)
            drawSnake(ctx, Snake);
            drawLetters(ctx, Letters);
            if (gameover){
                cancelAnimationFrame(animframeid)
                $('.over, .m-overlay').fadeIn();
                return
            }
            last = Date.now()
        }
        animframeid = requestAnimFrame(animationLoop);
    }

    clearCanvas(ctx);
});
/*
function changedir(direction, moveQ) {
    moveQ.push(direction)
}*/

function generateLetter(Letters, Grid){
    var randX, randY
    while(true){
        randX = Math.floor(Math.random()*(Grid.width));
        randY = Math.floor(Math.random()*(Grid.height));
        if (!Grid[randX] || !Grid[randX][randY])
            break
    }
    if(alphabet[0]) {
        var nextLetter = alphabet[0];
        alphabet = alphabet.slice(1);
    }
    Letters.push({
        x: randX,
        y: randY,
        ch: nextLetter
    });
    if (!Grid[randX])
        Grid[randX] = {};
    Grid[randX][randY] = "letter";
}

function step(snake, grid, Letters) {
    // Grab the next direction out of the move queue
    if (moveQ[0]) {
        snake.direction = moveQ[0]
        moveQ = moveQ.slice(1)
    }

    // Set the new head to the direction popped from the queue
    var newhead = {
        x: snake.body[0].x+snake.direction.x, 
        y: snake.body[0].y+snake.direction.y,
        ch: snake.body[0].ch
    }
    // And reset it if it goes out of bounds
    if (newhead.x > grid.width)
        newhead.x = 0;
    else if (newhead.x < 0) 
        newhead.x = Math.floor(grid.width);
    else if (newhead.y > grid.height)
        newhead.y = 0;
    else if (newhead.y < 0)
        newhead.y = Math.floor(grid.height);

    // Are the coordinates of the newhead defined?
    if (grid[newhead.x] && grid[newhead.x][newhead.y]){
        // If yes, there is either a letter here or a snake body here
        var obj = grid[newhead.x][newhead.y];
        if (obj == "letter"){
            // Get the last letter
            var lastLetter = snake.body[snake.body.length-1].ch;
            // Figure out which letter we're getting...
            for (var i = 0; i < Letters.length; i++) {
                var l = Letters[i];
                if(l.x == newhead.x && l.y == newhead.y) {
                    // This is our letter... make sure it's right...
                    if (lastLetter+1 == l.ch.charCodeAt(0)) {
                        // This is the one
                        // deep copy
                        oldSnakeBody = [];
                        for (var i = 0; i < snake.body.length; i++) {
                            oldSnakeBody.push({
                                x: snake.body[i].x, 
                                y: snake.body[i].y,
                               // ch: snake.body[i].ch
                            });
                        }
                         // First move the head to the newhead...
                        snake.body[0].x = newhead.x;
                        snake.body[0].y = newhead.y;
                        //snake.body[0].ch = newhead.ch;
                        // Update the grid
                        if (!grid[newhead.x])
                            grid[newhead.x] = {};
                        grid[newhead.x][newhead.y] = "snake";
                        // And then have the rest of the body follow...
                        for (var i = 0; i < oldSnakeBody.length - 1; i++) {
                            snake.body[i+1].x = oldSnakeBody[i].x;
                            snake.body[i+1].y = oldSnakeBody[i].y;
                            //snake.body[i+1].ch = oldSnakeBody[i].ch;
                        }
                        // Pop the last of the body and make it a snake
                        var last = oldSnakeBody.pop();
                        grid[last.x][last.y] = "undefined";
                        snake.body.push({
                            x: last.x,
                            y: last.y,
                            ch: l.ch.charCodeAt(0)
                        });
                        Letters.shift();
                         if(alphabet.length > 0)
                            generateLetter(Letters, grid);
                        else {
                            if(Letters.length==0) {
                                 console.log("You win!");
                                 return true;
                            }
                        }
                        break;
                    }
                }
                // else we just let it sit there.  you can't get it yet!
            }
        } else {
            // We ran into ourself.  Gameover :(
            return true;
        } 
    } else {
        // There is nothing here, so we can move the snake forward.
        // Deep copy of the snake...
        // FUCKING PASS BY REFERENCE, HUH? HUH?
        oldSnakeBody = [];
        for (var i = 0; i < snake.body.length; i++) {
            oldSnakeBody.push({
                x: snake.body[i].x, 
                y: snake.body[i].y,
                ch: snake.body[i].ch
            });
        }
        // First move the head to the newhead...
        snake.body[0].x = newhead.x;
        snake.body[0].y = newhead.y;
        // Update the grid
        if (!grid[newhead.x])
            grid[newhead.x] = {};
        grid[newhead.x][newhead.y] = "snake";
        // And then have the rest of the body follow...
        for (var i = 0; i < oldSnakeBody.length - 1; i++) {
            snake.body[i+1].x = oldSnakeBody[i].x;
            snake.body[i+1].y = oldSnakeBody[i].y;
        }
        // Pop the last of the body and clear it from the grid
        var last = oldSnakeBody.pop();
        grid[last.x][last.y] = undefined;
    }
}

function drawSnake(ctx, snake) {
    ctx.fillStyle = "#a1daa6";
    ctx.font = "100px Courier";
    for (var i = 0; i < snake.body.length; i ++) {
        posX = snake.body[i].x * cell_dim;
        posY = snake.body[i].y * cell_dim;
        letter = snake.body[i].ch;
        if (letter > 64)
            ctx.fillText(String.fromCharCode(letter),posX, posY+cell_dim);
        else
            ctx.fillRect(posX, posY, cell_dim, cell_dim);
    }
}

function drawLetters(ctx, letters) {
    ctx.fillStyle = "#80dae9";
    ctx.font="100px Courier";
    for (var i = 0; i < letters.length; i ++) {
        posX = (letters[i].x * cell_dim);
        posY = (letters[i].y * cell_dim)+cell_dim;
        letter = letters[i].ch;
        ctx.fillText(letter, posX, posY)
    }
}

var clearCanvas = function(ctx) {
    ctx.fillStyle="#f4f4f4";
    ctx.fillRect(0,0,999999,999999);
};

x.fillStyle = "#80dae9";
	ctx.font="100px Courier";
	for (var i = 0; i < letters.length; i ++) {
		posX = (letters[i].x * cell_dim);
		posY = (letters[i].y * cell_dim)+cell_dim;
		letter = letters[i].ch;
		ctx.fillText(letter, posX, posY)
	}
}

var clearCanvas = function(ctx) {
    ctx.fillStyle="#f4f4f4";
    ctx.fillRect(0,0,999999,999999);
};

// Support older versions of requestAnimationFrame
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 4);
          };
})();

var cell_dim = 64;				// cells are squares, only need one dimension
var LETTERNUM = 3;				// magic number for now on number of letters
var moveQ = []					// makin moveQ global cuz fuckit
var swoosh = "../sounds/Swoosh03.mp3";
var alphabet = ("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");

$(document).ready(function(){

	$('body').bind("touchmove", {}, function(event){
  		event.preventDefault();
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
    
    var Snake = {body:[{x:0, y:0}], 
                 direction:{x:1, y:0}}
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
                return
            }
            last = Date.now()
        }
        animframeid = requestAnimFrame(animationLoop);
    }

    clearCanvas(ctx);
    drawSnake(ctx, Snake);
    drawLetters(ctx, Letters);
    // go go go
    animationLoop();
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
    if (moveQ[0]) {
        snake.direction = moveQ[0]
        moveQ = moveQ.slice(1)
    }// else
     //   direction = snake.direction
    var newhead = {x: snake.body[0].x+snake.direction.x, y:snake.body[0].y+snake.direction.y}
    
    if (newhead.x >= 0 && newhead.x < grid.width && newhead.y >= 0 && newhead.y < grid.height)
        ;
    else{

        // TODO: Make snake stay or change direction instead of gaameover

        // You lose/game over or whatever
        console.log("Game over try again etc etc")
        return true
    }
    if (grid[newhead.x] && grid[newhead.x][newhead.y]){
        var obj = grid[newhead.x][newhead.y];
        if (obj == "letter"){
            snake.body.unshift(newhead)
            grid[newhead.x][newhead.y] = "snake"
            for(var i=0; i<Letters.length; i++){
                var l = Letters[i]
                if (l.x == newhead.x && l.y == newhead.y){
                    
                    // TODO: Make sure letters are collected sequentially.
                    console.log(Letters[i].ch);
                    
                    var tmpary = Letters.slice(0, i).concat(Letters.slice(i+1))
                    Letters.pop()
                    tmpary.forEach(function(el, ind){
                        Letters[ind] = el // medium hacky, probs not the best way to do this
                    })
                    if(alphabet.length > 0) {
                        generateLetter(Letters, grid);
                    } else {
                        if(Letters.length==0) {
                             console.log("You win!");
                             return true;
                        }
                    }
                    break;
                }
            }
        }else{

            /* 
            This means you ran into yourself.  Not sure if this is 
            toddler friendly/ easy enough?  We could do a few things:
                1) Make it so that when you change direction to go 
                backwards into yourself it doesn't register the command.
                2) Make it so that when you hit your tail you stop.
                3) Make it so that when you hit your tail you change
                direction.

                1 is plausible, but 2 and 3 mean that it can still be 
                unwinnable since you shouldn't be able to go through
                yourself... or can you?
            */

            // You lose
            console.log("Game over try again etc etc")
            return true
        }
    } else {
        var head = snake.body[0]
        var tail = snake.body.pop()
        
        grid[tail.x][tail.y] = undefined
        
        tail = {x:head.x+snake.direction.x, y:head.y+snake.direction.y}
        snake.body.unshift(tail)

        if (!grid[tail.x])
            grid[tail.x] = {}
        grid[tail.x][tail.y] = "snake"
    }
}

function drawSnake(ctx, snake) {
	ctx.fillStyle = "black";
	for (var i = 0; i < snake.body.length; i ++) {
		posX = snake.body[i].x * cell_dim;
		posY = snake.body[i].y * cell_dim;
		ctx.fillRect(posX, posY, cell_dim, cell_dim);
	}
}

function drawLetters(ctx, letters) {
	ctx.font="100px Courier";
	for (var i = 0; i < letters.length; i ++) {
		posX = (letters[i].x * cell_dim);
		posY = (letters[i].y * cell_dim)+cell_dim;
		letter = letters[i].ch;
		ctx.fillText(letter, posX, posY)
	}
}

var clearCanvas = function(ctx) {
	ctx.fillStyle="red";
	ctx.fillRect(0,0,999999,999999);
};


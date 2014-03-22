// Support older versions of requestAnimationFrame
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var cell_dim = 64               // cells are squares, only need one dimension

$(document).ready(function(){

	var windowH = $(window).height();
	var windowW = $(window).width();

	$("#canvas").attr({
		height: windowH,
		width: windowW
	});

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
    
    var moveQ = []
    /*
      When the player swipes the screen a certain way, it will add the moves to a move Queue.
      I think this is necessary because in Snake, you want to do a lot of fast sequential moves.
     */

	// Event listeners for canvas...
    $(canvas).on("mousedown mousemove touchstart touchmove touchend", function(evt){
        doSomething(evt, moveQ)
    })

	var Grid = {};
    Grid.width = windowW/cell_dim;
    Grid.height = windowH/cell_dim;
    
    var Snake = {body:[{x:0, y:0}], 
                 direction:{x:1, y:0}}
    Grid[0] = {0:"snake"}
    
    var last = Date.now()
    var FPS = 4
    function animationLoop(){
        if (Date.now() - last >= 1000/FPS){
            step(Snake, Grid, moveQ)
            drawSnake(ctx, Snake);
            
            last = Date.now()
        }
        requestAnimFrame(animationLoop);
    }

    drawSnake(ctx, Snake);
    // go go go
    animationLoop();
});

function doSomething(evt, moveQ) {
    // based on the event attributes, we should add a certain move to the moveQ
	console.log("did something");
}

function changedir(direction, moveQ){
    moveQ.push(direction)
}

function step(snake, grid, moveQ){
    if (moveQ[0]){
        direction = moveQ[0]
        moveQ = moveQ.slice(1)
    }else
        direction = snake.direction
    var newhead = {x: snake.body[0].x+direction.x, y:snake.body[0].y+direction.y}
    
    if (newhead.x >= 0 && newhead.x < grid.width && newhead.y >= 0 && newhead.y < grid.height)
        ;
    else{
        // You lose/game over or whatever
    }
        
    if (grid[newhead.x] && grid[newhead.x][newhead.y]){
        var obj = grid[newhead.x][newhead.y];
        if (obj == "letter"){
            // eat it
        }else{
            // You lose
        }
    }else{
        var head = snake.body[0]
        var tail = snake.body.pop()
        
        grid[tail.x][tail.y] = undefined
        
        tail = {x:head.x+direction.x, y:head.y+direction.y}
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

var clearCanvas = function(ctx) {
	ctx.fillStyle="blue";
	ctx.fillRect(0,0,999999,999999);
};

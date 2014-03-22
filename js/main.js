var cell_dim = 64               // cells are squares, only need one dimension

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

$(document).ready(function(){

	var windowH = $(window).height();
	var windowW = $(window).width();

	$("#canvas").attr({
		height: windowH,
		width: windowW
	});


	var moveQ = []

	var canvas = document.getElementById("canvas");
	var rightswipe = Hammer(canvas).on("dragright", function(event){
    	moveQ.push({x:1,y:0});
    	alert('you done rightdrag!');
    });
    var leftswipe = Hammer(canvas).on("dragleft", function(event){
    	alert('you done leftdrag!!!!');
    	moveQ.push({x:1,y:0});
    	
    });


	var ctx = canvas.getContext("2d");

	// Event listeners for canvas...
	canvas.addEventListener("mousedown", doSomething);
    canvas.addEventListener("mousemove", doSomething);
    canvas.addEventListener("touchstart", doSomething);
    canvas.addEventListener("touchmove", doSomething);
    canvas.addEventListener("touchend", doSomething);

	
	var Grid = {};
    Grid.width = windowW/cell_dim;
    Grid.height = windowH/cell_dim;
    DrawLine(ctx);
    
    
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
    function animationLoop(){
        step(Snake, Grid)
    }
    

});
function DrawLine(ctx){
	ctx.moveTo(0,0);
	ctx.lineTo(0, 768);
	ctx.moveTo(0,0);
	ctx.lineTo(1024, 0);
	ctx.moveTo(1024,0);
	ctx.lineTo(1024, 768);
	ctx.moveTo(1024,768);
	ctx.lineTo(0, 768);

	ctx.stroke();
}

function doSomething() {
	console.log("did something");
}



function step(snake, grid){

	var Letters = [];
	for (var i = 0; i < LETTERNUM; i ++) {
		randX = Math.floor(Math.random()*(windowW/cell_dim));
		randY = Math.floor(Math.random()*(windowH/cell_dim));
		Letters.push({
			x: randX,
			y: randY
		});
		Grid[randX] = {randY:"letter"};
	}


    
    var last = Date.now()
    var FPS = 4
    var animframeid
    function animationLoop(){
        if (Date.now() - last >= 1000/FPS){
            var gameover = step(Snake, Grid, moveQ)
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

function doSomething(event, moveQ) {
    // based on the event attributes, we should add a certain move to the moveQ

    var element = document.getElementById('test_el');
    // var hammertime = Hammer(element).on("tap", function, event);{
    // 	alert('YOU DONE TAPPED!');
    // });
	
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
        alert("Game over try again etc etc")
        return true
    }
        
    if (grid[newhead.x] && grid[newhead.x][newhead.y]){
        var obj = grid[newhead.x][newhead.y];
        if (obj == "letter"){
            // eat it
        }else{
            // You lose
            alert("Game over try again etc etc")
            return true
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
	ctx.fillStyle = "blue";
	for (var i = 0; i < letters.length; i ++) {
		posX = letters[i].x * cell_dim;
		posY = letters[i].y * cell_dim;
		ctx.fillRect(posX, posY, cell_dim, cell_dim);
	}
}

var clearCanvas = function(ctx) {
	ctx.fillStyle="red";
	ctx.fillRect(0,0,999999,999999);
};

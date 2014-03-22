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

var Snake = {body:[], 
             direction:{x:1, y:0}}

function step(snake, grid){
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
        
        grid[tail.x][tail.y] = "snake"
    }
}
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
var cell_dim = 64               // cells are squares, only need one dimension
$(document).ready(function(){

	var windowH = $(window).height();
	var windowW = $(window).width();

	$("#canvas").attr({
		height: windowH,
		width: windowW
	});
	
	var Grid = {};
    Grid.width = windowW/cell_dim;
    Grid.height = windowH/cell_dim;
    DrawLine();

});
function DrawLine(){
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
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

var a= 100;


// git add


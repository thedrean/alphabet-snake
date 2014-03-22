var cell_dim = 64               // cells are squares, only need one dimension
$(document).ready(function(){
	
	var windowH = $(window).height();
	var windowW = $(window).width();

	$("#canvas").height = windowH;
	$("#canvas").width = windowW;
	
	var Grid = {};
    Grid.width = windowW/cell_dim;
    Grid.height = windowH/cell_dim;

});

var a= 100;


// git add


var cell_dim = 64               // cells are squares, only need one dimension
$(document).ready(function(){
	$("#canvas").height = $(window).height();
	$("#canvas").width = $(window).width();
	
	var Grid = {};
    Grid.width = $(window).width()/cell_dim
    Grid.height = $(window).height()/cell_dim

});


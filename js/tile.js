/* 
 * Tile
 * Object for storing a single tile. Allows for collecing its own state information, marking, clearing, etc.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
function Tile(value, grid, index) {
  var self = this,
      x = this.x = index % grid.width,
      y = this.y = Math.floor(index  / grid.width),
      id = this.id = x + ',' + y,
      value=value,
      text="",
      grid=grid;

  var Directions = {
    Left: 'Left',
    Right: 'Right',
    Up: 'Up',
    Down: 'Down'
  }
  
  // prepare ids for simple backtracking
  this.id1 = id + '=' + 1;
  this.id2 = id + '=' + 2;

  function clear() {
    setValue(0);
  }

  function traverse(hor, ver) {
    var newX = x + hor,
        newY = y + ver;
    return grid.tile(newX, newY);
  }

  function right() { return move(Directions.Right); };
  function left() { return move(Directions.Left); };
  function up() { return move(Directions.Up); };
  function down() { return move(Directions.Down); };
  
  function move(dir) { 
    switch(dir) {
      case Directions.Right: 
        return traverse(1, 0);
      case Directions.Left: 
        return traverse(-1, 0);
      case Directions.Up: 
        return traverse(0, -1);
      case Directions.Down: 
        return traverse(0, 1);
    }
  }
  function setText(t){
  	text = t;
    if (!grid.rendered)
      grid.render();
    else {
    	//$("#tile-0-0 .inner")
      var $tile = $('#'+grid.id+'-tile-' + x + '-' + y+' .inner');
      $tile.text(text);
    }
    return self;
  }
	
  function setValue(v) {
    value = v;
    if (!grid.rendered)
      grid.render();
    else {
      var $tile = $('#'+grid.id+'-tile-' + x + '-' + y);
      $tile.removeClass().addClass('tile tile-' + value);
    }
    return self;
  }

  function mark() {
    var $tile = $('#'+grid.id+'-tile-' + x + '-' + y);
    $tile.addClass('marked');
    return self;
  }

  function unmark() {
    var $tile = $('#'+grid.id+'-tile-' + x + '-' + y);
    $tile.removeClass('marked');
    return self;
  }
  
  function shake(timeout){
  	timeout =timeout || 500;
  	var $tile = $('#'+grid.id+'-tile-' + x + '-' + y);
  	$tile.addClass('error');
    setTimeout(function() {
    	$tile.removeClass('error');
    }, timeout);
  }
  function completed(){
  	var $tile = $('#'+grid.id+'-tile-' + x + '-' + y);
  	$tile.addClass('completed');
  	setTimeout(function(){
  		$tile.removeClass("completed");
  	},3000);
  }

  this.right = right;
  this.left = left;
  this.up = up;
  this.down = down;
  this.move = move;
  this.clear = clear;
  this.mark = mark;
  this.unmark = unmark;
  this.shake=shake;
  this.completed=completed;
  
  this.__defineGetter__('x', function() { return x; })
  this.__defineGetter__('y', function() { return y; })
  this.__defineGetter__('value', function() { return value; })
  this.__defineSetter__('value', function(v) { return setValue(v); })
  this.__defineGetter__('isEmpty', function() { return x<0 || y<0; })
  
  this.__defineGetter__('text', function() { return text; })
  this.__defineSetter__('text', function(text) { return setText(text); })
}
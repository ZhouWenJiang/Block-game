/* 
 * Grid
 * Contains a grid of Tiles and APIs to generate, clear, mark, etc.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
function Grid(size, height, id) {
  var self = this,
	  id = id || 'board',
	  width = size,
	  height = height || size,
	  tiles = [],
	  renderTOH = 0,
	  noRender = false,
	  emptyTile = new Tile(-99,self,-99),
	  rendered=false;

  function each(handler) {
    for (var i=0; i<tiles.length; i++) {
      var x = i%width,
          y = Math.floor(i/width),
          tile = tiles[i],
          result = handler.call(tile, x, y, i, tile);
      if (result)
        break;
    }
    return self;
  }

  function load(values) {
    tiles = [];
    for (var i=0; i<width*height; i++) {
      var value = values && values[i] ? values[i] : 0;
      tiles[i] = new Tile(value, self, i);
    }
    render();
    return self;
  }

  function getIndex(x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height)
      return -1;
    return y * width + x;
  }

  function render() {
  }

  function domRenderer(direct) {
    if (noRender) return;
    clearTimeout(renderTOH);
    if (!direct) {
      renderTOH = setTimeout(function() {domRenderer(true);}, 0);
      return;
    }
    rendered = false;
    var html = '<table data-grid="' + id + '" id="grid" cellpadding=0 cellspacing=0>';
    for (var y=0; y<height; y++) {
      html += '<tr>';
      for (var x=0; x<width; x++) {
        var index = getIndex(x,y),
            tile = tiles[index],
            label = tile? tile.value: '';
            text=tile?tile.text:'';
        var odd = (x + (y % 2)) % 2;
        html += '<td data-x="'+x+'" data-y="'+y+'" class="' + (odd? 'even' : 'odd') + '"><div id="'+id+'-tile-' + x + '-' + y + '" class="tile tile-' + label + '"><div class="inner">'+text+'</div></div></td>';
      }      
      html += '</tr>';
    }
    html += '</table>';
    $('#' + id).html(html);
    resize();
    rendered = true;
    return self;
  }
  
    function resize() {
    $('#'+id+' table').each(function(i,el){
      var $el = $(el),
          id = $el.attr('data-grid'),
          w = $el.width(),
          size = $el.find('tr').first().children('td').length;
      
      var tileSize = Math.floor(w / size);
      
      if (!tileSize) return;

      $el.find('.tile').css({width:tileSize,height:tileSize,'line-height':Math.round(tileSize * 0.85) + 'px','font-size':Math.round(tileSize * 0.5) + 'px'});
      var radius = Math.round(tileSize * 0.1);
      var radiusCss = '#' + id + ' .tile .inner { border-radius: ' + radius + 'px; }' +
        '#' + id + ' .tile-1 .inner:after, #' + id + ' .tile-2 .inner:after { border-radius: ' + radius + 'px; }';
      
      Utils.createCSS(radiusCss, id + 'radius');
      //Utils.createCSS('.tile.marked .inner { border-width: ' + Math.floor(tileSize / 24)+ 'px }', 'tileSize');
    });
  }

  function getTile(x, y) {
    // if no y is specified, use x as interger
    if (isNaN(x)) return emptyTile;
    if (isNaN(y)) {
      var i = x;
      x = i % width,
      y = Math.floor(i / width);
    }
    if (x < 0 || x >= width || y < 0 || y >= height)
      return emptyTile;
    return tiles[getIndex(x,y)];
  }
  var tile = getTile; // other reference

  function clear() {
    //each(function() { this.clear(); });
    $('#' + id).html("");
    return self;
  }
  function markRow(y) {
    for (var x=0; x<width; x++)
      tile(x,y).mark();
    return self;
  }
  
  function unmarkRow(y) {
    for (var x=0; x<width; x++)
      tile(x,y).unmark();
    return self;
  }

  function markCol(x) {
    for (var y=0; y<height; y++)
      tile(x,y).mark();
    return self;
  }
  
  function unmarkCol(x) {
    for (var y=0; y<height; y++)
      tile(x,y).unmark();
    return self;
  }

  function unmark(x, y) {
    if (typeof x == 'number' && typeof y == 'number') {
      tile(x,y).unmark();
      return self;
    }
    for (var y=0; y<height; y++)
      for (var x=0; x<width; x++)
        tile(x,y).unmark();
    return self;
  }

  function mark(x, y) {
    tile(x,y).mark();
    return self;
  }
  function completed(){
  	each(function(){
  		this.completed();
  	});
  }

  function getWrongTiles() {
    var wrongTiles = [];
    each(function(x,y,i,tile){
      var currentValue = tile.value,
          okValue = self.state.getValueForTile('full',x,y);
      if (currentValue > 0 && currentValue != okValue)
        wrongTiles.push(tile);
    })
    return wrongTiles;
  }

  function getValues() {
    var values = [];
    each(function(){ values.push(this.value)});
    return values;
  }


  this.each = each;
  this.render = render;
  this.getIndex = getIndex;
  this.tile = tile;
  this.getTile=
  this.markRow = markRow;
  this.unmarkRow = unmarkRow;
  this.markCol = markCol;
  this.unmarkCol = unmarkCol;
  this.mark = mark;
  this.unmark = unmark;
  this.getValues = getValues;
  this.load=load;
  this.completed=completed;
  
  this.activateDomRenderer = function() {
    render = this.render = domRenderer;
    noRender = false;
  };
  this.resize=resize;
  this.clear=clear;

  this.__defineGetter__('id', function() { return id; })
  this.__defineGetter__('tiles', function() { return tiles; })
  this.__defineGetter__('width', function() { return width; })
  this.__defineGetter__('height', function() { return height; })
  this.__defineGetter__('rendered', function() { return rendered; })
  this.__defineGetter__('info', function() { return gridInfo; })

  load();
}

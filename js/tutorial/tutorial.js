function LightTutorial(){
	var TutarialPanel={
		grid:{
			width:5,
			height:5,
			data:[1,2,2,2,1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
		},
		rule:{
			width:3,
			height:3,
			data:[0,0,0,
				  0,1,0,
				  0,0,0]
		}
	};
	var TutorialMessages = {
	  1: { msg: 'We\'re going to fill the grid.<br>Tap the blue tile to make it red.', tiles: [ [0,1,1] ]},
	  2: { msg: 'Excellent!<br>Tap the red tile to turn a tile blue.', tiles: [ [0,0,2] ] },
	  3: { msg: 'Three red tiles next to each other in a row isn\'t allowed.', tiles: [ [1,0,2] ],rule:{
			width:3,
			height:3,
			data:[0,0,0,
				  1,1,1,
				  0,0,0]
		} },
	  4: { msg: 'Never have three blue tiles together in a row either.', tiles: [ [4,0,1] ] },
	  5: { msg: 'Three red or blue tiles below each other is invalid too!', tiles: [ [1,2,2], [2,2,1] ] },
	  6: { msg: 'A full row must have as many red tiles as it has blue ones.', tiles: [ [3,1,1] ], rows: [1] },
	  7: { msg: 'Columns have an equal number of each color too.', tiles: [ [1,3,2] ], cols: [1] },
	  8: { msg: 'You should be able to know what color this one is...', tiles: [ [2,3,1] ] },
	  9: { msg: 'No two rows and no two columns are the same.', tiles: [ [0,3,1], [0,2,2],[3,2,1] ], rows:[2,3] },
	 10: { msg: 'If you get stuck, tap the eye to peek.', tiles: [ [3,0,2] ], wiggle: true }
	};
	var grid;
	var step=0,strategy;
	tilesToTapThisStep = [];
	function start(){
		randerPanel(TutarialPanel.grid);
		randerRule(TutarialPanel.rule);
		next();
	}
	function next(){
		if (step >= Utils.count(TutorialMessages)) {
	      	hide();
	      active = false;
	      setTimeout(function() {
	        Game.checkForLevelComplete();  
	      }, 1000)
	      return;
	    }
	
	    step++;
	    var t = TutorialMessages[step];
	    msg = t.msg;
	    show(msg);
	    tilesToTapThisStep = [];
	    grid.unmark();
	    $(t.tiles).each(function() {
	      tilesToTapThisStep.push(grid.tile(this[0], this[1]));
	    });
	    if(t.rule){
	    	randerRule(t.rule);
	    	TutarialPanel.rule=t.rule;
	    }
	    setTimeout(function() {
	      markTilesForThisStep();
	    }, 0)
	    if (t.wiggle) {
	      $('#bar [data-action="help"]').addClass('wiggle');
	    }
	}
	
	function markTilesForThisStep() {
    var t = TutorialMessages[step];
      if (t.rows) 
        $(t.rows).each(function() { grid.markRow(this);});
      else if (t.cols) 
        $(t.cols).each(function() { grid.markCol(this);});
      else
        $(t.tiles).each(function() { grid.mark(this[0], this[1]);});
  	}
	
	function randerPanel(gridData){
	    grid = new Grid(gridData.width, gridData.height,"tutorialDiv");
	    strategy=new Light(grid);
	    grid.load(gridData.data);
	    // set system tiles manually
	    grid.activateDomRenderer();
	    grid.render();
	    addEventListeners("tutorialDiv");
	}
	
	function addEventListeners(id) {
  	var id = id || 'board';
	
  	if (window.WinJS)
      WinJS.Application.onbackclick = backButtonPressed;
    $(document).off('touchstart', '#'+id+' #grid td');
    $(document).on('touchstart', '#'+id+' #grid td', tapTile);
    $(document).on('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    })
  }
	
	function randerRule(rule){
		var ruleGrid=new Grid(rule.width, rule.height,"tutorialRuleDiv");
	    ruleGrid.load(rule.data);
	    // set system tiles manually
	    ruleGrid.activateDomRenderer();
	    ruleGrid.render();
	}
	function tapTile(e){
		var $el = $(e.target).closest('td'),
        x = $el.attr('data-x') * 1,
        y = $el.attr('data-y') * 1,
        tile = grid.tile(x, y);
        
		console.log(x+"  "+y);
		console.log(e);
		var tapAllowed = false;
	    $(tilesToTapThisStep).each(function() {
	      if (tile.x == this.x && tile.y == this.y)
	        tapAllowed = true;
	    })  
	    console.log(tapAllowed);
	    if (!tapAllowed)
	    {
	    	tile.shake();
	    	return;
	    }
	    strategy.step(tile,TutarialPanel.rule);
	    next();
	    
	}
	function show(msg) {
	  $('#tutorialText').html( msg );
	}
	this.start=start;
}

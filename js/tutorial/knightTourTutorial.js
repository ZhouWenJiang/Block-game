function KnightTourTutorial(){
	var TutarialPanel={
		grid:{
			width:5,
			height:5,
			data:[1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
		},
		rule:{
			width:3,
			height:3,
			data:[0,-2,0,
				  -2,2,-2,
				  0,-2,0]
		}
	};
	var TutorialMessages = {
	  1: { msg: Text.knightTourTutorialMsg[0], marktiles: [ [0,1,1] ], tiles: [ [0,1,1] ]},
	  2: { msg: Text.knightTourTutorialMsg[1],marktiles: [ [2,2,1]],tiles: [ [2,2,1]]},
	  3: { msg: Text.knightTourTutorialMsg[2]},
	  4: { msg: Text.knightTourTutorialMsg[3]},
	  5: { msg: Text.knightTourTutorialMsg[4]},
	  6: { msg: Text.knightTourTutorialMsg[5],
		rule:{
			width:3,
			height:3,
			data:[-2,0,-2,
				  0,2,0,
				  -2,0,-2]
		}},
	  7: { msg: Text.knightTourTutorialMsg[6]},
	  8: { msg: Text.knightTourTutorialMsg[7],
		rule:{
			width:5,
			height:5,
			data:[0,-2,0,-2,0,
				  -2,0,0,0,-2,
				  0,0,2,0,0,
				  0,0,0,0,-2,
				  0,-2,0,-2,0,]
		}},
	 9: { msg: Text.knightTourTutorialMsg[8]},
	 10: { msg: Text.knightTourTutorialMsg[9]},
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
		if (step >= Utils.count(TutorialMessages)-1) {
			show(TutorialMessages[step+1].msg)
			localStorage.setItem("tutorial_"+curLevel.strategy,true);
	      setTimeout(function() {
	      	$('#tutorialDiv .tile').addClass('completed');
	      }, 1000);
	      setTimeout(function() {
	      	controller.doAction('show-game');
	      }, 3000)
	      return;
	    }
	
	    step++;
	    var t = TutorialMessages[step];
	    msg = t.msg;
	    show(msg);
	    tilesToTapThisStep = [];
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
	    if(t.marktiles){
	    	$(t.marktiles).each(function() { grid.mark(this[0], this[1]);});
	    }
  	}
	
	function randerPanel(gridData){
	    grid = new Grid(gridData.width, gridData.height,"tutorialDiv");
	    strategy=new KnightTour(grid);
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
        var curStepInfo = TutorialMessages[step];
        if(curStepInfo.tiles){
	        var tapAllowed = false;
		    $(tilesToTapThisStep).each(function() {
		      if (tile.x == this.x && tile.y == this.y)
		        tapAllowed = true;
		    });
		    if(!tapAllowed){
		    	tile.shake();
		    	return;
		    }
	    };
        if(!strategy.available(tile,TutarialPanel.rule)){
        	tile.shake();
        	if(step==1){
        		grid.unmark();
        		next();
        	}
        }
        else{
        	var t = TutorialMessages[step+1];
   		    grid.unmark();
			strategy.step(tile,t.rule?t.rule:TutarialPanel.rule);
		    next();
		}
	    
	}
	function show(msg) {
	  $('#tutorialText').html( msg );
	}
	this.start=start;
}

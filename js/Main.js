/* 
 * Main
 * The main 0h h1 game, a singleton object in global scope.
 * (c) 2014 Q42
 * http://q42.com | @q42
 * Written by Martin Kool
 * martin@q42.nl | @mrtnkl
 */
function Main(){
  var self = this,
      debug = document.location.hash == '#debug',
      tweet = window.isWebApp,
      startedTutorial = false,
      grid,
      level,
      sizes = [4,6,8,10],
      lastSize = 0,
      currentPuzzle = null,
      checkTOH = 0,
      ojoos = ['Wonderful','Spectacular','Marvelous','Outstanding','Remarkable','Shazam','Impressive','Great','Well done','Fabulous','Clever','Dazzling','Fantastic','Excellent','Nice','Super','Awesome','Ojoo','Brilliant','Splendid','Exceptional','Magnificent','Yay'];
	var ruleGrid,levelId,debug=false;
  // puzzle is object with format { size:6, full:[2,1,...], empty:[0,0,2,...], quality: 76, ms: 42 }
  function startGame(type,levelIndex) {
  	levelId=levelIndex;
    if (window.STOPPED) return;
    $("#levelNum").text("Level:"+(Number(levelIndex)+1));
    startedTutorial = false;
    level={};
    level.data=Levels[curLevel.strategy].datas[curLevel.level];
    if(debug){
    	var debugData=localStorage.getItem(curLevel.strategy+"."+levelId); 
    	if(debugData){
    		level.data=JSON.parse(debugData);
    	}
    }
    grid = new Grid(level.data.grid.width, level.data.grid.height);
    level.strategy=getStrategy(type);
    grid.load(level.data.grid.data);
    // set system tiles manually
    grid.activateDomRenderer();
    grid.render();
    addEventListeners();
    undone = false;
    gameEnded = false;
  	ruleGrid=new Grid(level.data.rule.width, level.data.rule.height,"rule");
    ruleGrid.load(level.data.rule.data);
    // set system tiles manually
    ruleGrid.activateDomRenderer();
    ruleGrid.render();
    if(debug){
    	addRuleEventListeners("rule");
    }
  }
  
  function getStrategy(type){
  	switch(type){
  		case 0:
  			return new Light(grid);
  		case 1:
  			return new KnightTour(grid);
  	}
  }

  function addEventListeners(id) {
  	var id = id || 'board';
    document.addEventListener("backbutton", backButtonPressed, false);
	
  	if (window.WinJS)
      WinJS.Application.onbackclick = backButtonPressed;
    $(document).off('touchstart mousedown', '#'+id+' #grid td');
    $(document).on('touchstart mousedown', '#'+id+' #grid td', tapTile);
    $(document).on('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    })
  }
  
  function success(isEnd){
  	var param={
		icon:'img/success.png',
		title:ojoos[parseInt(Math.random()*ojoos.length)]+"!!",
		buttons:[
		{
			icon:'img/menu.png',
			color:'#009688',
			action:'curLevelPage'
		},
		{
			icon:'img/loop.png',
			color:'#FF9800',
			action:'refresh'
		}		
		]
	};
	if(!isEnd)
  	{
  		param.buttons.push({
			icon:'img/next.png',
			color:'#E91E63',
			action:'nextLevel'
		});
  	}
  	dialog2.show(param);
  }
  function failed(){
  	dialog2.show({
		icon:'img/error.png',
		title:'OOPS!!',
		buttons:[
		{
			icon:'img/menu.png',
			color:'#009688',
			action:'curLevelPage'
		},
		{
			icon:'img/loop.png',
			color:'#FF9800',
			action:'refresh'
		}
		]
	});
  }
  
  function addRuleEventListeners(id) {
  	var id = id || 'board';
    document.addEventListener("backbutton", backButtonPressed, false);
	
  	if (window.WinJS)
      WinJS.Application.onbackclick = backButtonPressed;
    $(document).off('touchstart mousedown', '#'+id+' #grid td');
    $(document).on('touchstart mousedown', '#'+id+' #grid td', tapRuleTile);
    $(document).on('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    })
  }
  
  function tapRuleTile (e) {

    if (window.Utils && Utils.isDoubleTapBug(e)) return false;
    var $el = $(e.target).closest('td'),
        x = $el.attr('data-x') * 1,
        y = $el.attr('data-y') * 1,
        tile = ruleGrid.tile(x, y),
        rightClick = (e.which === 3);
	
	tile.value=tile.value?0:1;
	
	e.preventDefault();
  	return false;
 }
  

  function tapTile (e) {
	//播放音效
	Sound.play();
	
    if (window.Utils && Utils.isDoubleTapBug(e)) return false;
    var $el = $(e.target).closest('td'),
        x = $el.attr('data-x') * 1,
        y = $el.attr('data-y') * 1,
        tile = grid.tile(x, y),
        rightClick = (e.which === 3);
	
    if (!level.strategy.available(tile,level.data.rule)) {
      tile.shake();
      return;
    }else{
    	!level.strategy.step(tile,level.data.rule);
    }
	if(level.strategy.complate()){
		complateLevel();
	}else if(level.strategy.isFailed(level.data.rule)){
		failed();
	}
	
	e.preventDefault();
  	return false;
 }
  
  function complateLevel(){
//	setTimeout(function(){
//			grid.completed();
//	},500);
	var passedLevel=Number(localStorage.getItem("strategy_"+curLevel.strategy));
	if(curLevel.level+1>passedLevel)
	{
		localStorage.setItem("strategy_"+curLevel.strategy,curLevel.level+1);
	}
	//curLevel.level+=1;
	if(curLevel.level+1<Levels[curLevel.strategy].datas.length)
	{
		success(false);
		//controller.doAction(controller.action.startGame);
	}	
	else{
		success(true);
	}
  }

  function backButtonPressed() {
    if (onHomeScreen) {
      if (window.WinJS)
        window.close();
      else
        navigator.app.exitApp();
    }
    else
      doAction('back');
	  
	  return true;
  };
  
  function save(){
    var data={};
    data.grid={};
    data.grid.width=grid.width;
    data.grid.height=grid.height;
    data.grid.data=grid.getValues();
    data.rule={};
    data.rule.width=ruleGrid.width;
    data.rule.height=ruleGrid.height;
    data.rule.data=ruleGrid.getValues();
  	localStorage.setItem(curLevel.strategy+"."+levelId,JSON.stringify(data));
  	upload();
  }
  
  function upload(){
  	var length = Levels[curLevel.strategy].datas.length;
  	for(var i=0;i<length;i++){
  		var debugData=localStorage.getItem(curLevel.strategy+"."+i); 
    	if(debugData){
    		Levels[curLevel.strategy].datas[i]=JSON.parse(debugData);
    	} 
  	}
  	$.post("/upload",JSON.stringify(Levels));
  }

  this.startGame = startGame;
  this.save=save;
  window.__defineGetter__('tile', function() { return grid.tile; });
  this.__defineGetter__('grid', function() { return grid; });
  this.__defineGetter__('debug', function() { return debug; });

}
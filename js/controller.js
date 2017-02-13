function Controller() {
	var views=new Views(),
	    game=new Main(),
	    levels=new LevelSelect(0);
    var Action={
    	play:'play',
    	startGame:'startGame',
    	close:'close',
    	refresh:'refresh',
    	menu:'show-menu',
    	preLevelPage:'preLevelPage',
    	nextLevelPage:'nextLevelPage',
    	curLevelPage:'curLevelPage',
    	showLevels:'showLevels',
    	nextLevel:'nextLevel',
    	tutorial:'tutorial',
    	saveLevel:"saveLevel",
    };
	function doAction(action, value) {
		$('.cd-popup').removeClass('is-visible');
		switch(action) {
			case Action.saveLevel:
				game.save();
				break;
			case Action.tutorial:
			  	var tutorial=curLevel.strategy==0?new LightTutorial():new KnightTourTutorial();
				tutorial.start();
				views.showTutorial();
				break;
			case Action.nextLevel:
				curLevel.level+=1;
				doAction(Action.startGame);
				break;
			case Action.close:
				doAction(Action.play);
				break;
			case Action.refresh:
				doAction(Action.startGame,curLevel.level);
				break;
			case Action.startGame:
				game.startGame(curLevel.strategy,curLevel.level);
				views.showGame();;
				if(!localStorage.getItem("tutorial_"+curLevel.strategy)){
					setTimeout(function(){doAction(Action.tutorial);},2);
				}
			break;
			case Action.showLevels:
				levels.showLastestPage();
				views.showLevels();
				break;
			case 'show-menu':
				views.showMenu();
				break;
			case 'rules':
				views.showRules();
				break;
			case 'show-game':
				game.grid.resize();
				views.showGame();
				break;
			case Action.curLevelPage:
				levels.showCurPage();
				views.showLevels();
				break;
			case Action.preLevelPage:
				var refresh=levels.showPrePage();
				if(refresh)
					views.showLevels();
				break;
			case Action.nextLevelPage:
				var refresh=levels.showNextPage();
				if(refresh)
					views.showLevels();
				break;
			case 'tutorial':
				views.startTutorial();
				break;
			case 'about':
				views.showAbout();
				break;
		}
	}

	function addListeners() {
		if(window.WinJS)
			WinJS.Application.onbackclick = backButtonPressed;

		$(document).off('touchend mouseup');
		$(document).on('touchend mouseup', click);
		$(document).on('contextmenu', function(e) {
			e.preventDefault();
			e.stopPropagation();
			e.stopImmediatePropagation();
			return false;
		})
	}

	function click(evt) {
		//if (window.Utils && Utils.isDoubleTapBug(evt)) return false;
		var $el = $(evt.target).closest('*[data-action]'),
			action = $(evt.target).closest('*[data-action]').attr('data-action'),
			value = $el.attr('data-value');
		// allow regular hyperlinks to work
		var isLink = ($el && $el.length && $el[0].nodeName == 'A') ? true : false;
		if(action && !isLink) {
			doAction(action, value);
			return false;
		}
	}
	function init(){
		addListeners();
		views.showMenu();
		var colors = ['#a7327c', '#c24b31', '#c0cd31']
    	Utils.setColorScheme(colors[1]);
	}
	function values(){
		var data=game.grid.getValues();
//		for(var index=0;index<data.length;index++){
//			data[index]=(data[index])%2+1;
//		}
		console.log(data);
	}
	function values2(){
		var data=game.grid.getValues();
		for(var index=0;index<data.length;index++){
			data[index]=(data[index])%2+1;
		}
		console.log(data);
	}
	this.action=Action;
	this.init=init;
	this.doAction=doAction;
	this.values=values;
	this.values2=values2;
}
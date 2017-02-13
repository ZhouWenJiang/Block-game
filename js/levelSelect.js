function LevelSelect(){
	var passedLevel,
		heigth=4,
		width=4,
		divId="levelsMenu",
		grid= new Grid(width, heigth,divId),
		pageNo,
		levelCount;
	function show(){
		grid.load();
		var pageLevel = Number(passedLevel);
	    // set system tiles manually
	    var index= 1;
	    var levelDataIndex=0;
	    levelCount=Levels[curLevel.strategy].datas.length;
	    grid.each(function(){
	    	this.text=pageNo*(heigth*width)+index;
			if(this.text<=pageLevel){
				this.value=curLevel.strategy==0?1:2;
			}
			if(this.text==pageLevel+1){
				this.value=-2;//marked
			}
			if(this.text>levelCount){
				this.value=-1;
			}
			index++;
	    });
		
		grid.activateDomRenderer();
	    grid.render();
	    addEventListeners();
	    undone = false;
	    gameEnded = false;

	};
	function showLastestPage(){
		passedLevel=localStorage.getItem("strategy_"+curLevel.strategy) || 0;
		pageNo = Math.floor(passedLevel/(heigth*width));
		show();
		return true;
	}
	function showCurPage(){
		passedLevel==localStorage.getItem("strategy_"+curLevel.strategy) || 0;
		pageNo = Math.floor((curLevel.level || 1)/(heigth*width));
		show();
		return true;
	}
	function showPrePage(){
		if(pageNo-1<0){
			return false;
		}else{
			pageNo-=1;
			show();
			return true;
		}
	}
	function showNextPage(){
		levelCount=Levels[curLevel.strategy].datas.length;
		if((pageNo+1)*width*heigth<levelCount){
			pageNo+=1;
			show();
			return true;
		}
		return false;
		
	}
	
	function addEventListeners() {
    //$(document).on('touchend mouseup', click);
    $(document).off('touchend mouseup', '#levels #grid td');
    $(document).on('touchend mouseup', '#levels #grid td', tapTile);
    $(document).on('contextmenu', function(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    })
  }
  function tapTile (e) {
    //if (window.Utils && Utils.isDoubleTapBug(e)) return false;
    var $el = $(e.target).closest('td'),
        x = $el.attr('data-x') * 1,
        y = $el.attr('data-y') * 1,
        tile = grid.tile(x, y);
        if(tile.value==0){
        	tile.shake();
        	return;
        }else if(tile.value==-1){
        	return;
        }
        curLevel.level=tile.text-1;
	    controller.doAction(controller.action.startGame);
	    e.preventDefault();
  }
	
	
	this.showCurPage=showCurPage;
	this.showPrePage=showPrePage;
	this.showNextPage=showNextPage;
	this.showLastestPage=showLastestPage;
}

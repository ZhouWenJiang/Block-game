function KnightTour(grid){
	var preTile;
	var markType={
		mark:1,
		unmark:0,
	}
	//当前操作位置
	function step(tile,rule){
		tile.value=2;
		if(preTile){
			markTiles(rule,preTile,markType.unmark);
		}
		preTile=tile;
		markTiles(rule,tile,markType.mark);
	};
	//当前
	function available(tile,rule){
		if(!preTile){
			return  tile.value==1?true:false;
		}
		if(tile.value==2){
			return false;
		}
		var index=(rule.width*rule.height-1)/2;
		var x=index%rule.width;
		var y=Math.floor(index/rule.height);
		
		var ruleX=tile.x-preTile.x+x;
		var ruleY=tile.y-preTile.y+y;
		if(ruleX<0 || ruleX>=rule.width || ruleY<0 || ruleY>=rule.height){
			return false;
		}
		var ruleIndex = ruleY*rule.width+ruleX;
		if(rule.data[ruleIndex]==-2){
			return true;
		}else{
			return false;
		}
	}
	/*
	 * 标记可以点击的块
	 */
	function markTiles(rule,tile,type){
		var index=(rule.width*rule.height-1)/2;
		var x=index%rule.width;
		var y=Math.floor(index/rule.height);
		
		var startX=tile.x-x;
		var startY=tile.y-y;
		for(var i=0;i<rule.width;i++)
			for(var j=0;j<rule.height;j++){
				var tmpTile = grid.tile(startX+i,startY+j);
				if(rule.data[j*rule.width+i]==-2 && tmpTile.value==1){
					type==markType.mark?tmpTile.mark():tmpTile.unmark();
				}
			}
	}
	//是否成功
	function complate(){
		var _complate=true;
		grid.each(function(tile){
			if(this.value==1){
				_complate=false;
				return true;
			}
		});
		return _complate;
	}
	
	function isFailed(rule){
		var index=(rule.width*rule.height-1)/2;
		var x=index%rule.width;
		var y=Math.floor(index/rule.height);
		
		var startX=preTile.x-x;
		var startY=preTile.y-y;
		for(var i=0;i<rule.width;i++)
			for(var j=0;j<rule.height;j++){
				var tmpTile = grid.tile(startX+i,startY+j);
				if(rule.data[j*rule.width+i]==-2 && tmpTile.value==1){
					return false;
				}
			}
		return true;
	}
	
	this.step=step;
	this.available=available;
	this.complate=complate;
	this.isFailed=isFailed;
}

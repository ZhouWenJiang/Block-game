function Light(grid){
	var grid=grid;
	//当前操作位置
	function step(tile,rule){
		var index=(rule.width*rule.height-1)/2;
//		for(var index = 0;index<rule.data.length;index++){
//			if(rule.data[index]==1){
//				break;
//			}
//		}
		var x=index%rule.width;
		var y=Math.floor(index/rule.height);
		
		var startX=tile.x-x;
		var startY=tile.y-y;
		for(var i=0;i<rule.width;i++)
			for(var j=0;j<rule.height;j++){
				var tmpTile = grid.tile(startX+i,startY+j);
				if(rule.data[j*rule.width+i]){
					switchTile(tmpTile);
				}
			}
	};
	//当前
	function available(tile){
		//return tile.value!=2;
		return true;
	};
	//是否成功
	function complate(){
		var _complate=true;
		grid.each(function(tile){
			if(this.value==2){
				_complate=false;
				return true;
			}
		});
		return _complate;
	};
	function isFailed(){
		return false;
	}
	function switchTile(tile){
  	if(tile.isEmpty)
  	{
  		return;
  	}
  	if(tile.value==1){
  		tile.value=2;
  	}
  	else if(tile.value==2){
  		tile.value=1;
  	}
  }
	this.step=step;
	this.available=available;
	this.complate=complate;
	this.isFailed=isFailed;
}

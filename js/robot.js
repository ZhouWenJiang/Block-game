function Robot(grid,stepTime){
	var self=this,
	state=new State(),
	lastStep,
	userLastStep,
	grid=grid,
	stepTime=stepTime,
	width=grid.width,
	height=grid.height,
	location=undefined;
	
	var Directions = {
	   Left: 0,
	   Right: 2,
	   Up: 1,
	   Down: 3
	 }
	function start(){
		var obj=this;
		setTimeout(function(){
			obj.run();
		},stepTime);
	}
	
	function run(){
		var newLocation = undefined;
		if(location==null){
			newLocation={x:width/2,y:height/2};
		}else{
			var arr=avaliableStep(location);
			newLocation=arr[parseInt(Math.random()*arr.length)];
		}
		var newTile = grid.getTile(newLocation.x,newLocation.y);
		newTile.value=1;
		if(location)
		{
			var oldTile=grid.getTile(location.x,location.y);
			oldTile.value=0;
		}
		state.push(newLocation);
		location=newLocation;
	}
	function step(x,y){
		var next=false;
		var location = state.firstState.state;
		var tile = grid.getTile(x,y);
		if(location.x==x && location.y==y){
			tile.value=2;
			next=true;
			state.pop();
		}else{
			tile.shake();
			return;
		}
		if(userLastStep){
			var tile = grid.getTile(userLastStep.x,userLastStep.y);
			tile.value=0;
		}
		if(next){
			userLastStep={"x":x,"y":y};
		}
		
	}
	function avaliableStep(location){
		var steps = [];
		var left=addLocation(location,{"x":-1,"y":0});
		left.dir=Directions.Left;
		if(isValid(left)&& Math.abs(location.dir-left.dir)!=2){
			steps.push(left);
		}
		var right=addLocation(location,{"x":1,"y":0});
		right.dir=Directions.Right;
		if(isValid(right)&& Math.abs(location.dir-right.dir)!=2){
			steps.push(right);
		}
		var up=addLocation(location,{"x":0,"y":-1});
		up.dir=Directions.Up;
		if(isValid(up)&& Math.abs(location.dir-up.dir)!=2){
			steps.push(up);
		}
		var down=addLocation(location,{"x":0,"y":1});
		down.dir=Directions.Down;
		if(isValid(down) && Math.abs(location.dir-down.dir)!=2){
			steps.push(down);
		}
		return steps;
	}
	function isValid(location){
		if(location.x<0 || location.y<0 || location.x>=width || location.y>=height){
			return false;
		}
		return true;
	}
	function addLocation(l1,l2){
		return {x:l1.x+l2.x,y:l1.y+l2.y};
	}
	this.start=start;
	this.run=run;
	this.step=step;
}

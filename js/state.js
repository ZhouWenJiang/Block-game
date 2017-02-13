function State() {
	var self = this,
	firstState,
	lastState;
	
	function clear(){
		firstState=undefined;
		lastState=undefined;
	}
	function push(state){
		if(!firstState){
			firstState=lastState={};
			firstState.state=state;
			return;
		}
		temp={};
		temp.state=state;
		lastState.next=temp;
		lastState = temp;
		
	}
	function pop(){
		if(!firstState){
			lastState=undefined;
			return undefined;
		}else{
			var temp=firstState.state;
			firstState=firstState.next;
			return temp;
		}
	}
	this.clear = clear;
  	this.push = push;
  	this.pop = pop;
  	this.__defineGetter__('firstState', function() { return firstState; });
}

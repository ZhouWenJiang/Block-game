var dialog2=new function(){
	var paramter={
		icon:'img/error.png',
		title:'success',
		buttons:[
		{
			icon:'',
			color:'',
			action:undefined
		},
		{
			icon:'',
			color:'',
			action:undefined
		},
		{
			icon:'',
			color:'',
			action:undefined
		}
		]
	}
	function show(obj){
		var param = $.extend(paramter,obj);
		$(".alert-main-icon").css("background-image",'url('+param.icon+')');
		$(".alert-title").text(param.title);
		$(".cd-buttons").html("");
		if(param.buttons){
			for(var i =0;i<param.buttons.length;i++){
				var btn = param.buttons[i];
				$(".cd-buttons").append('<li id="cd-button'+i+'"></li>');
				if(btn.icon){
					$("#cd-button"+i).css("background-image",'url('+btn.icon+')');
				}
				if(btn.color){
					$("#cd-button"+i).css("background-color",btn.color);
				}
				if(btn.action){
					$("#cd-button"+i).attr("data-action",btn.action);
				}
			}
		}
		$('.cd-popup').addClass('is-visible');
	}
	function hide(){
		$('.cd-popup').removeClass('is-visible');
	}
	this.show=show;
	this.hide=hide;
};

function sounds(){
	var sounds=[new Howl({
      src: ['audio/1%20do.mp3']
    }),
    new Howl({
      src: ['audio/2%20re.mp3']
    }),
    new Howl({
      src: ['audio/3%20mi.mp3']
    }),
    new Howl({
      src: ['audio/4%20fa.mp3']
    }),
    new Howl({
      src: ['audio/5%20sol.mp3']
    }),
    new Howl({
      src: ['audio/6%20la.mp3']
    }),
    new Howl({
      src: ['audio/7%20si.mp3']
    })];
	function play(){
		var index = parseInt(Math.random()*sounds.length);
		sounds[index].play();
	}
	this.play=play;
}

$(function(){
	Sound=new sounds();
})

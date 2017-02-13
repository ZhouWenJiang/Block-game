function Views(){
	function resize() {
    var desired = {
          width: 320,
          height: 480
        },
        aspectRatio = desired.width / desired.height,
        viewport = {
          width: $('#feelsize').width(),
          height: $('#feelsize').height()
        },
        sizeToWidth = ((viewport.width / viewport.height) < aspectRatio)

    var box = {
      width: Math.floor(sizeToWidth? viewport.width : (viewport.height/desired.height) * desired.width),
      height: Math.floor(sizeToWidth? (viewport.width/desired.width) * desired.height : viewport.height)
    }

    $('#container').css({'width': box.width + 'px', 'height': box.height + 'px'});

    var containerSize = box.width;

    $('h1').css('font-size', Math.round(containerSize * .24) + 'px')
    $('h2').css('font-size', Math.round(containerSize * .18) + 'px')
    $('h3').css('font-size', Math.round(containerSize * .15) + 'px')
    $('p').css('font-size', Math.round(containerSize * .07) + 'px')
    $('span').css('font-size', Math.round(containerSize * .045) + 'px')
    $('#menu h2').css('font-size', Math.round(containerSize * .24) + 'px')
    $('#menu p').css('font-size', Math.round(containerSize * .1) + 'px')
    $('#menu p').css('padding', Math.round(containerSize * .05) + 'px 0')
    $('#menu p').css('line-height', Math.round(containerSize * .1) + 'px')
    var scoreSize = Math.round(containerSize * .1);
    $('#score').css({'font-size': scoreSize + 'px', 'line-height': (scoreSize * 0.85) + 'px', 'height': scoreSize + 'px'});

    var iconSize = Math.floor((22/320) * containerSize);
    $('.icon').css({width:iconSize,height:iconSize,marginLeft:iconSize,marginRight:iconSize});
    
    $('#digits').width($('#titlegrid table').width()).height($('#titlegrid table').height())
    $('#digits').css({'line-height':Math.round($('#titlegrid table').height() * 0.92) + 'px','font-size':$('#titlegrid table').height() * .5 + 'px'});

    var topVSpace = Math.floor($('#container').height() / 2 - $('#board').height() / 2);
    $('#hintMsg').height(topVSpace + 'px');
  }

  function showTitleScreen() {
    onHomeScreen = true;
    $('.screen').hide().removeClass('show');
    $('#title').show();
    setTimeout(function() { $('#title').addClass('show'); },0);
  }

  function showGame() {
    onHomeScreen = false;
    $('.screen').hide().removeClass('show');
    $('#game').show();
    setTimeout(function() { $('#game').addClass('show'); },0);
    resize();
  }

  function showMenu() {
    onHomeScreen = true;
    $('.screen').hide().removeClass('show');
    $('#menu').show();
    setTimeout(function() { $('#menu').addClass('show'); },0);
    var grid= new Grid(2, 1,"titlegrid");
    grid.load([1,2]);
    grid.activateDomRenderer();
	grid.render();
    resize();
    $(document).off('touchend mouseup', '#titlegrid #grid td');
    $(document).on('touchend mouseup', '#titlegrid #grid td', function(e) {
    var $el = $(e.target).closest('td'),
        x = $el.attr('data-x') * 1,
        y = $el.attr('data-y') * 1;
    controller.doAction(controller.action.showLevels,x+y);
    e.preventDefault();
  });
    
  }

  function showAbout() {
    onHomeScreen = false;
    $('.screen').hide().removeClass('show');
    $('#about').show();
    setTimeout(function() { $('#about').addClass('show'); },0);
    resize();
  }
  
  function showLevels() {
    onHomeScreen = false;
	$('.screen').hide().removeClass('show');
	$('#levels').show();
    setTimeout(function() {
      $('#levels').addClass('show');
    },0);
  }

  function showRules() {
    onHomeScreen = false;
    $('.screen').hide().removeClass('show');
    $('#rules').show();
    setTimeout(function() { $('#rules').addClass('show'); },0);
    resize();
  }
  function showTutorial(){
  	onHomeScreen = false;
    $('.screen').hide().removeClass('show');
    $('#tutorial').show();
    setTimeout(function() { $('#tutorial').addClass('show'); },0);
	resize();
  }
  
  this.showTutorial=showTutorial;
  this.showRules=showRules;
  this.showAbout=showAbout;
  this.showMenu=showMenu;
  this.resize=resize;
  this.showLevels=showLevels;
  this.showGame=showGame;
}

// Flip Clock - By Vahid Sanati
// Version 2.0
// LastChange: 2015/01/12

(function($) {
	
	// Get path of plugin js file (While executing scripts, current file is the last one that exist inside head UNTILL NOW, so we can use the last script's src attribute)
	var $flipClockPath = $('head script:last').attr('src');
	$flipClockPath = $flipClockPath.substring(0, $flipClockPath.lastIndexOf( "/" ) + 1);
	
	// Define a function to set transition more easily
	$.fn.flipClockSetTransition = function($value, $prefixes){
		return this.css({
			"-webkit-transition" : ($prefixes ? '-webkit-' : '') + $value ,
			"-moz-transition" : ($prefixes ? '-moz-' : '') + $value ,
			"-ms-transition" : ($prefixes ? '-ms-' : '') + $value ,
			"-o-transition" : ($prefixes ? '-o-' : '') + $value ,
			"transition" : $value
		});
	}
	
	// Define a function to set transform more easily
	$.fn.flipClockSetTransform = function($value){
		return this.css({
			"-webkit-transform" : $value ,
			"-moz-transform" : $value ,
			"-ms-transform" : $value ,
			"-o-transform" : $value ,
			"transform" : $value
		});
	}
	
	// Define a function to set transform-origin more easily
	$.fn.flipClockSetTransformOrigin = function($value){
		return this.css({
			"-webkit-transform-origin" : $value ,
			"-moz-transform-origin" : $value ,
			"-ms-transform-origin" : $value ,
			"-o-transform-origin" : $value ,
			"transform-origin" : $value
		});
	}
	
	$.fn.flipClock = function(options, callback){
		
		// Try to prevent copying plugin
		if( !$('div.general_container').hasClass('coming_soon') ){return false;}
		
		// ------------- Variables --------------
		var $container = this;
		var $time = new Date();
		
		var defaults = {
			theme : 'glossy_grey_1_medium' ,
			type : 'clock' ,			 			 // 'clock' or 'countdown'
			hour_type : 'daily' ,					// 'daily' means 24 hours and 'unlimited' means 99 hours (only valid on countdown type)
			show_day : false ,
			stop_at_end : true ,					 // Stops countdown when reaches to end
			speed : 250 ,
			dots_blink : true ,
			dots_blink_speed : 1000 ,
			second : $time.getSeconds() ,
			minute : $time.getMinutes() ,
			hour : $time.getHours() ,
			day : 0
		};
		var options = $.extend({}, defaults, options);
			
		// Add selected theme css file to head
		if($('head link#flip_clock_'+ options.theme +'_theme').length <= 0){
			$('head').append('<link id="flip_clock_'+ options.theme +'_theme" rel="stylesheet" type="text/css" href="'+ $flipClockPath +'themes/'+ options.theme +'/css/'+ options.theme +'.css" />');	
		}
		
		var createClocks = function($container){
			
			// Make sure each container gets it's own flip clock
			$container.each(function(){
				
				var $container = $(this);
				
				// ------------- Insert HTMLs -------------
				
				// Add clock specific class to the container
				$container.addClass('flip_clock_'+ options.theme +'_container');
				
				// Create clock
				$container.append('<div class="clock_container"></div>');
				
				var $classes = ['s1', 's2', 'm1', 'm2', 'h1', 'h2'];
				
				for($i=0; $i<6; $i++){
					$container.find('div.clock_container').append('' +
						'<div class="clock_number_container clock_'+ $classes[$i] +'">' +
							'<div class="clock_top_back"></div>' +
							'<div class="clock_top_front"><div class="clock_top_shadow"></div></div>' +
							
							'<div class="clock_bottom_back"><div class="clock_bottom_shadow"></div></div>' +
							'<div class="clock_bottom_front"></div>' +
							
							'<div class="clock_handles"></div>' +
						'</div>' +
					'');
					
					if($i == 1 || $i == 3){
						$container.find('div.clock_container').append('<div class="clock_dots"></div>');
					}
				}
				
				// If the show_day option is set to true, create days
				if(options.show_day){
					
					$container.append('<div class="day_container"></div>');
					
					var $classes = ['d1', 'd2', 'd3'];
					
					for($i=0; $i<3; $i++){
						$container.find('div.day_container').append('' +
							'<div class="clock_number_container clock_'+ $classes[$i] +'">' +
								'<div class="clock_top_back"></div>' +
								'<div class="clock_top_front"><div class="clock_top_shadow"></div></div>' +
								
								'<div class="clock_bottom_back"><div class="clock_bottom_shadow"></div></div>' +
								'<div class="clock_bottom_front"></div>' +
								
								'<div class="clock_handles"></div>' +
							'</div>' +
						'');
					}
				}
				
				
				// ----------- Define Variables -----------
				var s1 = options.second % 10;								if(s1 < 0){ s1 = 0; }
				var s2 = (options.second - (options.second % 10)) / 10;	  if(s2 < 0){ s2 = 0; }
				
				var m1 = options.minute % 10;								if(m1 < 0){ m1 = 0; }
				var m2 = (options.minute - (options.minute % 10)) / 10;	  if(m2 < 0){ m2 = 0; }
				
				var h1 = options.hour % 10;								  if(h1 < 0){ h1 = 0; }
				var h2 = (options.hour - (options.hour % 10)) / 10;		  if(h2 < 0){ h2 = 0; }
				
				var d1 = options.day % 10;								   if(d1 < 0){ d1 = 0; }
				var d2 = (options.day % 100 - (options.day % 10)) / 10;	  if(d2 < 0){ d2 = 0; }
				var d3 = (options.day - (options.day % 100)) / 100;		  if(d3 < 0){ d3 = 0; }
				
				var number_width = $container.find("div.clock_number_container").width();
				
				
				// ----------- Make First State -----------
				$container.find("div.clock_s1 div.clock_top_back").css({"background-position":-(s1 * number_width) +"px top"});
				$container.find("div.clock_s1 div.clock_bottom_back").css({"background-position":-(s1 * number_width) +"px bottom"});
				
				$container.find("div.clock_s2 div.clock_top_back").css({"background-position":-(s2 * number_width) +"px top"});
				$container.find("div.clock_s2 div.clock_bottom_back").css({"background-position":-(s2 * number_width) +"px bottom"});
				
				$container.find("div.clock_m1 div.clock_top_back").css({"background-position":-(m1 * number_width) +"px top"});
				$container.find("div.clock_m1 div.clock_bottom_back").css({"background-position":-(m1 * number_width) +"px bottom"});
				
				$container.find("div.clock_m2 div.clock_top_back").css({"background-position":-(m2 * number_width) +"px top"});
				$container.find("div.clock_m2 div.clock_bottom_back").css({"background-position":-(m2 * number_width) +"px bottom"});
				
				$container.find("div.clock_h1 div.clock_top_back").css({"background-position":-(h1 * number_width) +"px top"});
				$container.find("div.clock_h1 div.clock_bottom_back").css({"background-position":-(h1 * number_width) +"px bottom"});
				
				$container.find("div.clock_h2 div.clock_top_back").css({"background-position":-(h2 * number_width) +"px top"});
				$container.find("div.clock_h2 div.clock_bottom_back").css({"background-position":-(h2 * number_width) +"px bottom"});
				
				$container.find("div.clock_d1 div.clock_top_back").css({"background-position":-(d1 * number_width) +"px top"});
				$container.find("div.clock_d1 div.clock_bottom_back").css({"background-position":-(d1 * number_width) +"px bottom"});
				
				$container.find("div.clock_d2 div.clock_top_back").css({"background-position":-(d2 * number_width) +"px top"});
				$container.find("div.clock_d2 div.clock_bottom_back").css({"background-position":-(d2 * number_width) +"px bottom"});
				
				$container.find("div.clock_d3 div.clock_top_back").css({"background-position":-(d3 * number_width) +"px top"});
				$container.find("div.clock_d3 div.clock_bottom_back").css({"background-position":-(d3 * number_width) +"px bottom"});
				
				
				// ---------- Set Initial Styles ----------
				$container.find("div.clock_top_front").flipClockSetTransformOrigin('bottom').css('visibility' , 'hidden');
				$container.find("div.clock_bottom_front").flipClockSetTransformOrigin('top').flipClockSetTransform('rotateX(90deg)').css('visibility' , 'hidden');
				
				$container.find("div.clock_top_front div.clock_top_shadow").css({'opacity':'0', 'filter':'alpha(opacity = 0)'});
				$container.find("div.clock_bottom_back div.clock_bottom_shadow").css({'opacity':'0', 'filter':'alpha(opacity = 0)'});
				
				
				// ---------- Clock Tik Function ----------
				var clockTik = function (number , div){
					
					// Prepare Backgrounds
					$container.find("div." + div + " div.clock_top_front").css({"background-position": $container.find("div." + div + " div.clock_top_back").css("background-position") });
					$container.find("div." + div + " div.clock_top_back").css({"background-position":-(number * number_width) +"px top"});
					$container.find("div." + div + " div.clock_bottom_front").css({"background-position":-(number * number_width)+"px bottom"});
					
					// Fall top front and show shadows
					$container.find("div." + div + " div.clock_top_front").flipClockSetTransition('transform '+ options.speed +'ms linear', true).css('visibility', 'visible').flipClockSetTransform('rotateX(-90deg)');
					$container.find("div." + div + " div.clock_top_front div.clock_top_shadow").flipClockSetTransition('opacity '+ options.speed +'ms ease-in', false).css({'opacity':'1', 'filter':'alpha(opacity = 100)'});
					$container.find("div." + div + " div.clock_bottom_back div.clock_bottom_shadow").flipClockSetTransition('opacity '+ (options.speed * 2) +'ms ease-in', false).css({'opacity':'1', 'filter':'alpha(opacity = 100)'});
					
					// Wait till top animation finish
					setTimeout(function(){
						
						// Fall bottom front 
						$container.find("div." + div + " div.clock_bottom_front").flipClockSetTransition('transform '+ options.speed +'ms linear', true).css('visibility', 'visible').flipClockSetTransform('rotateX(0deg)');
					
						// Bring top front to it's initial rotation and hide it's shadow
						$container.find("div." + div + " div.clock_top_front").flipClockSetTransition('none', false).css('visibility', 'hidden').flipClockSetTransform('rotateX(0deg)');
						$container.find("div." + div + " div.clock_top_front div.clock_top_shadow").flipClockSetTransition('none', false).css({'opacity':'0', 'filter':'alpha(opacity = 0)'});
							
						// Wait till bottom animation finish
						setTimeout(function(){
							
							// Change bottom back background to the falled number and bring bottom front and bottom shadow to their initial state
							$container.find("div." + div + " div.clock_bottom_back").css({"background-position":-(number * number_width) +"px bottom"});
							$container.find("div." + div + " div.clock_bottom_front").flipClockSetTransition('none', false).css('visibility', 'hidden').flipClockSetTransform('rotateX(90deg)');
							$container.find("div." + div + " div.clock_bottom_back div.clock_bottom_shadow").flipClockSetTransition('none', false).css({'opacity':'0', 'filter':'alpha(opacity = 0)'});
							
						} , options.speed);
							
					} , options.speed);
				}
				
				
				// ------------- Blinking Dots ------------
				if(options.dots_blink){
					
					$container.find("div.clock_dots").css("visibility","visible");
					var $dots_visibility = 'visible';
						
					var dotsBlink = function(){
						if($dots_visibility == 'hidden'){
							$container.find("div.clock_dots").css("visibility","visible");
							$dots_visibility = 'visible';
						}
						else{
							$container.find("div.clock_dots").css("visibility","hidden");
							$dots_visibility = 'hidden';
						}
					}
					
					setInterval(dotsBlink , options.dots_blink_speed);
				}
				
				
				// --------------- Tik Tak ----------------
				
				// Clock
				if(options.type == 'clock'){
					
					setInterval(function(){
						
						if(s1 == 9){
							s1 = -1;
						}
						s1++;
						clockTik(s1 , "clock_s1");
						
						
						if(s1 == 0){
							if(s2 == 5){
								s2 = -1;	
							}
							s2++;
							clockTik(s2 , "clock_s2");
						}
						
						if(s2 == 0 && s1 == 0){
							if(m1 == 9){
								m1 = -1;	
							}
							m1++;
							clockTik(m1 , "clock_m1");
						}
						
						if(m1 == 0 && s2 == 0 && s1 == 0){
							if(m2 == 5){
								m2 = -1;	
							}
							m2++;
							clockTik(m2 , "clock_m2");
						}
						
						if(m2 == 0 && m1 == 0 && s2 == 0 && s1 == 0){
							if(h2 == 2){
								if(h1 == 3){
									h1 = -1;	
								}
							}
							else{
								if(h1 == 9){
									h1 = -1;	
								}
							}
							h1++;
							clockTik(h1 , "clock_h1");
						}
						
						if(h1 == 0 && m2 == 0 && m1 == 0 && s2 == 0 && s1 == 0){
							if(h2 == 2){
								h2 = -1;	
							}
							h2++;
							clockTik(h2 , "clock_h2");
						}	
						
					} , 1000);
				}
				
				// Countdown
				else if(options.type == 'countdown'){
					
					var $interval = setInterval(function(){
						
						if(s1 == 0 && s2 == 0 && m1 == 0 && m2 == 0 && h1 == 0 && h2 == 0 && d1 == 0 && d2 == 0 && d3 == 0){
							if(callback){
								callback();
							}
							if(options.stop_at_end){
								clearInterval($interval);
								return false;
							}
						}
						
						if(s1 == 0){
							s1 = 10;
						}
						s1--;
						clockTik(s1 , "clock_s1");
						
						if(s1 == 9){
							if(s2 == 0){
								s2 = 6;	
							}
							s2--;
							clockTik(s2 , "clock_s2");
						}
						
						if(s2 == 5 && s1 == 9){
							if(m1 == 0){
								m1 = 10;	
							}
							m1--;
							clockTik(m1 , "clock_m1");
						}
						
						if(m1 == 9 && s2 == 5 && s1 == 9){
							if(m2 == 0){
								m2 = 6;	
							}
							m2--;
							clockTik(m2 , "clock_m2");
						}
						
						if(m2 == 5 && m1 == 9 && s2 == 5 && s1 == 9){
							if(h1 == 0){
								if(options.hour_type == 'daily' || options.show_day){
									if(h2 == 0){
										h1 = 4;
										ended = true;
									}
									else{
										h1 = 10;	
									}
								}
								else{
									h1 = 10;	
								}
							}
							h1--;
							clockTik(h1 , "clock_h1");
						}
						
						if((h1 == 9 || (h1 == 3 && (options.hour_type == 'daily' || options.show_day))) && m2 == 5 && m1 == 9 && s2 == 5 && s1 == 9){
							if(h1 == 9){
								if(h2 == 0 && options.hour_type != 'daily' && !options.show_day){
									h2 = 10;
								}
							}
							else if(h1 == 3){
								if(h2 == 0 && ended){
									h2 = 3;
								}
								else{
									return false;	
								}
							}
							h2--;
							clockTik(h2 , "clock_h2");
						}
						
						if(options.show_day){	
							if(h2 == 2 && h1 == 3 && m2 == 5 && m1 == 9 && s2 == 5 && s1 == 9){
								if(d1 == 0){
									d1 = 10;	
								}
								d1--;
								clockTik(d1 , "clock_d1");
							}
								
							if(d1 == 9 && h2 == 2 && h1 == 3 && m2 == 5 && m1 == 9 && s2 == 5 && s1 == 9){
								if(d2 == 0){
									d2 = 10;	
								}
								d2--;
								clockTik(d2 , "clock_d2");
							}
								
							if(d2 == 9 && d1 == 9 && h2 == 2 && h1 == 3 && m2 == 5 && m1 == 9 && s2 == 5 && s1 == 9){
								if(d3 == 0){
									d3 = 10;	
								}
								d3--;
								clockTik(d3 , "clock_d3");
							}
						}
						
					} , 1000);
				}
				
			});	// End of each
			
		}	// End of createClocks function
			
		// If the css file is already loaded, create clocks immediately
		if($('head link#flip_clock_'+ options.theme +'_theme').attr('isloaded') == 'true'){
			createClocks($container);
		}
		
		// Else wait untill css file load, then create clocks
		else{
			$('head link#flip_clock_'+ options.theme +'_theme').load(function(){
				$(this).attr('isloaded', 'true');
				createClocks($container);
			});
		}
		
		return this;
	}
})(jQuery);
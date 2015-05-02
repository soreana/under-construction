$(document).ready(function() {
	
	// Get end timestamp
	end_date = end_date.split('/');
	end_time = end_time.split(':');
	
	date = new Date(end_date[0], (end_date[1] - 1), end_date[2], end_time[0], end_time[1], end_time[2]);
	end_timestamp = Math.floor(date.getTime() / 1000);
	
	// Maximize compatibility
	if (!Date.now) {
		Date.now = function() { return new Date().getTime(); }
	}
	
	// Define variables
	timestamp = end_timestamp - Math.floor(Date.now() / 1000);
	
	if(timestamp < 0){ timestamp = 0; }
	
	day = Math.floor( timestamp / (60*60*24) );
	timestamp -= (day * (60*60*24));
	
	hour = Math.floor( timestamp / (60*60) );
	timestamp -= (hour * (60*60));
	
	minute = Math.floor( timestamp / (60) );
	timestamp -= (minute * (60));
	
	second = timestamp;
	
	// Run plugin
	$('div.clock_parent').flipClock({theme:'matte_white_1_medium', type:'countdown', show_day:true, second:second, minute:minute, hour:hour, day:day});
		
	// Apply height of container	
	var $height = $('div.general_container').height() + 100;
	$('div.general_container').height($height).addClass('center');
	
});
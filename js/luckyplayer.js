(function($) {
	
$.fn.luckyplayer = function(o) {
	
    	o = $.extend({
	
	        pauseLength: 6000,		// animation interval when playing
	        loop: true,		// loop when end of image list is reached
		imageLocation: '/Luckyplayer/js/', // location of images on server
		bgOpacity: 0.95, // opacity of 'shadow'
		autoPlay: false	// start slideshow when plugin is initialized

    	}, o || {});

	// Append the html
	$('body').append(
		'<div id="lp_frame">'+
			'<img id="lp_image">'+
			'<img id="lp_spinner" src="'+o.imageLocation+'loader.gif">'+
		'</div>'+
		'<div id="lp_toolbar">'+
			'<div id="lp_play"></div>'+
			'<div id="lp_prev"></div>'+
			'<div id="lp_next"></div>'+
			'<div id="lp_close"></div>'+
		'</div>'+
		'<div id="lp_shadow"></div>'+
		'<img id="lp_preload">'
	);
	
	// Styling for the shadow
	var shadow = $("#lp_shadow").css({
		overflow: "hidden",
		position: "fixed",
		zIndex: 1101, // Seriously twitter?  A z-index of 1030 on navbars?
		left: 0,
		top: 0,
		display: "none",
		width: "100%",
		height: "100%",
		opacity: o.bgOpacity,
		backgroundColor: "black"
	});
	
	// Styling for the toolbar
	var toolbar = $("#lp_toolbar").css({
		position: "fixed",
		zIndex: 1102,
		top: "100%",
		left: 0,
		width: "100%",
		height: "35px",
		marginTop: "-35px",
		backgroundColor: "black",
		opacity: 0.9,
		color: "white",
		display: "none"
	});
	
	// Styling for the frame
	var frame  = $("#lp_frame").css({
		position: "fixed",
		display: "none",
		zIndex: 1102,
		top: 0,
		left: 0,
		width: "100%",
		height: "100%",
	});

	// Styling for the image
	var image = $("#lp_image").css({
		position: "absolute",
		left: "50%",
		top: "50%",
		display: "none",
		maxWidth: "100%",
		maxHeight: "100%",
		zIndex: 1104
	});
	
	// Styling for the loading animation
	$("#lp_spinner").css({
		position: "absolute",
		left: "50%",
		top: "50%",
		marginLeft: "-25px",
		marginTop: "-25px",
		zIndex: 1103
	});
	
	// Styling for the img tag used for caching
	var preload = $("#lp_preload").css({
		display: "none"
	});

	// Styling for the buttons
	toolbar.find("div").css({
		width: "25%",
		height: "100%",
		float: "left",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center"
	});
	var icon = toolbar.find("#lp_play").css("backgroundImage", 'url('+o.imageLocation+'play.png)');
	toolbar.find("#lp_next").css("backgroundImage", 'url('+o.imageLocation+'next.png)');
	toolbar.find("#lp_prev").css("backgroundImage", 'url('+o.imageLocation+'prev.png)');
	toolbar.find("#lp_close").css("backgroundImage", 'url('+o.imageLocation+'close.png)');

	// Image variables
	var thumbs = $(this).find("li > a"),	// Set of thumbs/links
		cur = 0,	// Index of current image
		count = thumbs.size()-1;	// images - 1 to match indeces

	// Global timer variables
	o.player = false;	// Slideshow timer
	o.tb = false;		// Toolbar hide timer

	// Add index info to elements for navigation
	thumbs.each(function(i){
		$(this).attr('data-index', i);
	});

	// Display image at index i
	function show(i) {

		// Hide the image 
		image.hide();
		
		// If the slideshow is running, preload the next image
		if (o.player) {
			preload.attr("src", thumbs[i+1].href);
		}
		
		// Load the image
		image.attr("src", thumbs[i].href);

	}
	
	// Show the lightbox
	thumbs.click(function(){
		
		// Cache the current element
		var me = $(this);
		
		// Show the shadow and frame
		shadow.show();
		frame.show();
		
		// Slide up the toolbar
		toolbar.slideDown(500);
		
		// Update the current index and show the image
		cur = me.attr('data-index');
		show(cur);
		
		// Hide the toolbar after a delay
		o.tb = setTimeout(function() {
			toolbar.slideUp(500);
		},3000);
		
		// Prevent external navigation
		return false;
	
	});
	
	// Show the toolbar
	function showtb() {
		
		// Clear the timeout if there is one
		clearTimeout(o.tb);
		
		// Slide in the toolbar
		toolbar.slideDown(500);
		
		// Start new timer
		o.tb = setTimeout(function(){
			toolbar.slideUp(500);
		},3000);
		
	}
	
	// Show the toolbar temporarily on image click
	image.click(function(){
		showtb();
	})
	frame.click(function(){
		showtb();
	});
	
	// Keep the toolbar up if we're hovering on it
	toolbar.hover(
		// Clear timer on mouse in
		function(){
			clearTimeout(o.tb);
		},
		// Restart timer on mouse out
		function(){
			o.tb = setTimeout(function(){
				toolbar.slideUp(500);
			},3000);
		}
	);
	
	function position() {
		
		// Get dimensions
		var xoffset = image.width() / 2;
		var yoffset = image.height() / 2;

		// Adjust offset to center image
		image.css({
			marginLeft: "-"+xoffset+"px",
			marginTop: "-"+yoffset+"px"
		});
		
	}

	// Set position before loading image and hiding spinner
	image.on("load", function(){

		// Set position of the image
		position();
		
		// Show the image
		image.fadeIn(500);
		
	});

	// Re-position image if the window size changes
	$(window).resize(function(){
		position();
	});
	
	// Move slideshow to next image
	function next() {

		// If the current element is the last check loop setting
		if (cur == count) {
			
			if (o.loop) {
				// Go to the start of the thumbs
				cur = 0;
			}
			else {
				// GTFO
				return false;
			}
		}
		// Otherwise increment the index and proceed
		else {
			cur++;
		}
		
		// Show the new image
		show(cur);
		
		return false;
		
	}
	// Set listener
	$("#lp_next").click(function(){
		next();
	});
	
	// Move slideshow to previous image
	function prev() {
		
		// If the current element is the first check loop setting
		if (cur == count) {
			
			if (o.loop) {
				// Go to the end of the thumbs
				cur = count;
			}
			else {
				// GTFO
				return false;
			}

		}
		// Otherwise decrement the index and proceed
		else {
			cur--;
		}
		
		// Show the new image
		show(cur);
		
		return false;
		
	}
	// Set listener
	$("#lp_prev").click(function(){
		prev();
	});
	
	// Start/Stop slideshow
	$("#lp_play").click(function(){
		
		// If we're playing then stop
		if (o.player) {
			
			// Switch icon to play
			icon.css("backgroundImage", 'url('+o.imageLocation+'play.png)');
			
			// Clear the timer and set variable to false
			clearInterval(o.player);
			o.player = false;
			
		}
		// Otherwise start the show
		else {
			
			// Switch icon to pause
			icon.css("backgroundImage",'url('+o.imageLocation+'pause.png)');
			
			// Set the timer to advance images
			o.player = setInterval(function(){
				next();
			}, o.pauseLength)
			
		}
		
	});
	
	// Close the lightbox
	$("#lp_close").click(function(){
	
		// Clear the toolbar hide timer
		clearTimeout(o.tb);
		
		// Clear slideshow timer and reset controls
		clearTimeout(o.player);
		o.player = false;
		icon.css("backgroundImage", 'url('+o.imageLocation+'play.png)');
		
		// Hide the lightbox and controls
		toolbar.hide();
		frame.hide();
		shadow.hide();
		
		// Reset the image src
		image.attr("src", "");
		
		return false;
		
	});

	// Start autoPlay - don't pop up toolbar, start at first image
	if (o.autoPlay === true) {
		
		// Show the shadow and frame
		shadow.show();
		frame.show();
		
		// Show first image
		show(cur);
		
		// Swap button icon and play
		icon.css("backgroundImage",'url('+o.imageLocation+'pause.png)');
		o.player = setInterval(function(){
			next();
		}, o.pauseLength)
		
	}
    
};

})(jQuery);

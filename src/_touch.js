/// touch function
function tabletTouch() {
 
	/// Settings Object
	var settings = {
		objHoverItem: '.hoverItem',
		objClickItem: '.clickItem'
	};
	/// Scan For Touch Device
	if ("ontouchstart" in document.documentElement) {
		//Set our event strings to be touch events
		strClick = 'touchend';
		strOver = 'touchstart';
		//A string that determines which device we are using
		strDevice = 'Touch Device';
	}
	else {
		//Set our event strings to be mouse events
		strClick = 'click';
		strOver = 'mouseover';
		//A string that determines which device we are using
		strDevice = 'Normal Device';
	} 
}
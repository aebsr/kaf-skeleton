
//var $mobilePanels = $('.exp-controller');
var wasMobile;

//Check if Mobile
function checkMobile(cMobileFunction, cDTPFunction) {
   var mobile = (window.innerWidth < 500) ? true : false;

   if (mobile != wasMobile) { 
   // if state has changed then do something
    if(mobile) { // in mobile mode
			isMobile();
			JsExpanders();
			if(cMobileFunction) {cMobileFunction();}
		} else { // desktop mode
			notMobile();
			deleteJsExpanders();
			if(cDTPFunction) {cDTPFunction();}
		}
	}
	// update wasMobile to reflect last state
	wasMobile = mobile;
	// console.log(wasMobile);
}

function JsExpanders() {
	//$('.exp-controller').addClass('exp-style').prepend('<div class="exp-icon"></div>').next('.expandable').hide();
	//console.log('mobile panels added');
	$('.exp-controller').addClass('exp-style').append('<i class="fa fa-plus"></i>').next('.expandable').hide();
	$('.exp-style').on('click', function(e) {
		//console.log('mobile panel clicked');
		//$(this).toggleClass('expanded').next('.expandable').slideToggle();
		$(this).find('i').toggleClass('fa-plus').toggleClass('fa-minus').parent().next('.expandable').slideToggle();
		e.preventDefault();
	});
}
function deleteJsExpanders() {
	//$('.exp-controller').removeClass('exp-style');
	$('.exp-controller > i').remove();
	$('.exp-style').off().removeClass('exp-style').next('.expandable').show();
	//console.log('mobile panels removed');
}

function isMobile() { 
	console.log("IS mobile");
}

function notMobile() { 
	console.log("is NOT mobile");
}








jQuery(document).ready(function($){ 


$(window).load(function() {
    checkMobile();
});
$(window).smartresize(function() {
    checkMobile();
});


}); // end domready
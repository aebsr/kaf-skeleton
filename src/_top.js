/* scroll to top */

jQuery(document).ready(function($){ 


// scroll to top
$(window).scroll(function(){
	var $scrollid = $('#scrollup');
	if ($(this).scrollTop() > 100) {
		$scrollid.fadeIn();
	} else {
		$scrollid.fadeOut();
	}
});

$('#scrollup').on('click', function(){
	$("html, body").animate({ scrollTop: 0 }, 600);
	return false;
});


}); // end domready
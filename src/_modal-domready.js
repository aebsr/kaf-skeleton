/* modal-domready */

jQuery(document).ready(function($){ 

// new modal box 
$('a.modalbox').on('click', function(e) {
	var URLtoload = $(this).attr('href'); 
	$.get(URLtoload, function(data){
		ajaxcontent = $('[data-role="data-ajax"]',data);
		modal.open({content: ajaxcontent});
	});
	return false;
});

// new modal box for product page popups
$('a.modalboxprod').on('click', function(e) {
	var URLtoload = $(this).attr('href'); 
	$.get(URLtoload, function(data){
		ajaxcontent = $('[data-role="data-ajax-product"]',data);
		modal.open({content: ajaxcontent});
	});
	return false;
});

}); // end domready
/* _promo.js */

jQuery(document).ready(function($){ 


// NEW display promo
$.ajax({
	type: 'GET', 
	url: '/shop/CurrentPromo',
	datatype: 'xml', 
	headers: { Accept: 'application/xml' },
	success:function(data){
	
		var sitepromo = $(data).find('promoText').text();
		var promoUrl = $(data).find('promoUrl').text();
		if (sitepromo != 'promotion') {
		
			var targets = '#promo .sitewidepromo'; // use as target until promo module is updated
			if (window.location.href.indexOf("shop") >= 0 || window.location.href.indexOf("essentials") >= 0) {
			// this is a shop or gallery page, show link to promoUrl 
			//console.log('shoppage: ' + window.location.href);
				$(targets).empty().append('<a href="' + promoUrl + '">' + sitepromo + '</a>');
			} else {
				// send user to shop section
				$(targets).empty().append('<a href="/shop/">' + sitepromo + '</a>');
			}
			$(targets).fadeIn();
		}
   }
});



}); // end domready

/* domready-search */

jQuery(document).ready(function($){ 


$('.primary li:nth-child(odd)').addClass('ieodd');
$('.primary li:nth-child(even)').addClass('ieeven');
$('.primary li:nth-child(3n+1)').addClass('ie3n1');
$('.primary li:nth-child(4n+1)').addClass('ie4n1');


$('#nav-mobile').mmenu({
	slidingSubmenus: false,
	//moveBackground: false
});


}); // end domready
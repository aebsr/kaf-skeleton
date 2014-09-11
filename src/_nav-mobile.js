/* mobile-nav */

jQuery(document).ready(function($){ 

$.ajax({
	type: 'GET', 
	url: '/ajax/nav-mobile.html',
	datatype: 'html', 
	success:function(data){
		$('#nav-mobile').html(data).mmenu({
			slidingSubmenus: false,
			//moveBackground: false
		});
	},
	error: _gotAjaxError
});

}); // end domready
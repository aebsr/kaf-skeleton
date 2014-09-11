/* ajaxed footer */

jQuery(document).ready(function($){ 


$('#nav-footer').hide();

$.ajax({
	type: 'GET', 
	url: '/ajax/nav-footer-v2.html',
	datatype: 'html', 
	success:function(data){
		$('#nav-footer').html(data).slideDown();
	},
	error: _gotAjaxError
});


}); // end domready
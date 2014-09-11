/* signup-trim */

jQuery(document).ready(function($){ 

// remove spaces from input
$('.emailsignup-input, .bec-emailsignup-input').keyup(function() {
	$(this).val($(this).val().trim());
});

}); // end domready
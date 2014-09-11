

function _gotAjaxError(xhr, status, error) {
  // Show server script errors in the console.
  if( xhr.status == 500 ) {
    var response = xhr.responseText;
    response = response.replace( /\r?\n/g, "" )
                       .replace( /(<\/)/g, "\n$1" )
                       .replace( /<[^>]+>/g, "" )
                       .replace( /^\s+/, "" )
                       .replace( /\s+$/, "" );
    console.log(response);
  }
	//alert("I'm sorry...\n\n"
    //  + "Unfortunately an error occured while communicating with the server.\n"
    //  + "Please try again later.");
}
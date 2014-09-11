
(function($){ 



//    http://webcloud.se/log/Building-modal-panels-with-jQuery/ 
$.fn.extend({
      modalPanel: function() {
          //Create our overlay object
          var overlay = $('<div id="modal-overlay"></div>');
          var modalWindow = $('<div id="modal-window"></div>');

          return this.each(function() {
              //Listen for clicks on objects passed to the plugin
              $(this).click(function(e) {

                  //Append the overlay to the document body
                  $('body').append(overlay.click(function() { modalHide(); }));
                  $('body').on('click', 'a.close', function() { modalHide(); });

                  //Set the fade in our overlay and prevent following link
                  overlay.fadeIn(150);
                  e.preventDefault();
	 
                  //Activate a listener 
                  $(document).keydown(handleEscape);	
                  
                  //Load the page
					$.ajaxSetup ({ cache: false  });  
					var ajax_load = "<img src='images/ui/ajax-loading.gif' alt='loading...' /> loading..."; 
					var loadUrl = $(this).attr("href"); 
					//alert( loadUrl );
					modalWindow.html(ajax_load).load(loadUrl + ' .ajax-container');  
					//modalWindow.html(ajax_load).load(loadUrl + ' #ajax-infobox');  
						$(this).addClass("ajax-clicked");
						$("body").append(modalWindow);
						modalWindow.fadeIn(50);
              });
          });

        // function for hiding the modal box
		function modalHide() {
				$(document).unbind("keydown", handleEscape);
				var remove = function() { $(this).remove(); };
				overlay.fadeOut(remove);
				modalWindow.fadeOut(remove).empty();
		}

        // function that listens for escape key.
        function handleEscape(e) {
              if (e.keyCode == 27) { modalHide(); }
          }
      }
  });
  
  
})(jQuery);      // end jQuery
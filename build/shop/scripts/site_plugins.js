/* 
	site-plugins.js
	sitewide plugins and functions
	
	cookies, login, add to cart, popups, ajax
	
*/






/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);



/* end cookie plugin */














/*	LOGIN	*/

// depends on jquery
// makes request to LoginForm servlet
// accepts response and composes a div layer on the page
// triggered by links whose names is:
// trigger-login:[id_of_region-to-put-login-form]:[post-form-as-ajax-or-not]:[override-existing-tomcat-session(TRUE|FALSE)]

(function($) {

// does the ajax post and response to retrieve the form markup
$.fn.retrieveLoginFormMarkup = function(trigger_link,override_tomcat_session) {
					
			// tigger link was clicked or loaded
			// "name" attribute of the trigger link has needed info in the form of:
			// name="trigger-login:[id_of_region-to-put-login-form]:[post-form-as-ajax-or-not]:[override-existing-tomcat-session(TRUE|FALSE)]:[ANON-OK/NOT]"
			// example: name="trigger-login:login-area:ajax-Y:FALSE:ANON-NOT" 
			// the HREF value should contain the destination or function you'd like to have happen if successful login
			var form_info = trigger_link.attr("name");
			var target_div = form_info.split(":")[1];
			var ajax_toggle = form_info.split(":")[2].split("-")[1];
			var forward_url = trigger_link.attr("href");	
			var anon_ok = form_info.split(":")[4];	
			
			var map = {}; 			
			map['target_div']=target_div;
			map['ajax_toggle']=ajax_toggle;
			map['forward_url']=forward_url;
			map['override_tomcat_session']=override_tomcat_session;
			map['anon_ok']=anon_ok;	
			
			// if coder wants a popup instead of inline div,
			// expect target_div to be "div_id|popup|left_offset|right_offset"
			// example: name="trigger-login:login-area|popup|-50|+25:ajax-Y" 
			if(target_div.indexOf('popup')>-1){	
				var left = target_div.split("|")[2];
	 			var top = target_div.split("|")[3];			
				var offset = trigger_link.offset();
				//alert("offset: "+offset.left+ ", "+offset.top);
				map['target_div']=target_div.split("|")[0];
				map['left']=offset.left-left;
				map['top']=offset.top-top;
				map['popup']='Y';
			}
		
			//alert('requesting login form, click "ok" to proceed');
			$.post("/shop/LoginForm", map,
  				function(data){
  					//alert('got ajax data back');
					$().renderLoginForm(data, map);
				},"text");

} // end retrieveLoginFormMarkup


// takes the login from ajax response and puts the markup on the page
$.fn.renderLoginForm = function(data, map) {

		//alert('in renderlogin function '+data);
		
		var target_div = map['target_div'];
		var forward_url = map['forward_url'];
		var ajax_toggle = map['ajax_toggle'];
		
		// ***ALREADY LOGGED IN*** AND INTENDED FOR NEW PAGE, JUST FORWARD TO REQUESTED PAGE
		// FOR EXAMPLE, LINK TO "RATE/REVIEW" IS CLICKED, WHICH GETS THIS AJAX, WHICH INFORMS THE 
		// BROWSER TO FORWARD TO THE "RATE/REVIEW" PAGE SINCE THE USER IS AUTHORIZED TO DO A RATING
		if(data.indexOf('logged in')>-1 && forward_url!='none'){
			//alert('about to forward with '+forward_url);
			window.document.location=forward_url;
			return;
		}
		
		// ***ALREADY LOGGED IN*** AND BROWSER STAYING ON THE SAME PAGE 
		// SHOW/HIDE THE FORM BASED ON WHETHER ALREADY LOGGED IN
		if(data.indexOf('logged in')>-1 && forward_url=='none'){
			return;
		}		
		
				//alert('later in renderlogin function '+data);
		
		// NOT LOGGED IN, SHOW LOGIN FORM		
		$("#"+target_div).html(data);
		$("#login_forward_url_"+target_div).val(forward_url);
		$("#login_ajax_toggle_"+target_div).val(ajax_toggle);

	    // float a popup instead of an inline region
	    //alert(target_div);
	 	if(map['popup']=='Y'){
	 				var left=map['left'];
	 				var top=map['top'];
				    $("#"+target_div).css("top",top+"px");
				    $("#"+target_div).css("left",left+"px");
	 	}

	   // put the login form in visible state
	   $("#"+target_div).css("display","inline");
	   //alert(target_div + ' inline');

} // end renderLoginForm



/*
 * DUP of function in login-form.js.
 * If login-form.js and site-plugins.js are used in the same file, undefined results are possible
 */
// accepts the login form submission
$.fn.submitLoginForm = function(formId) {
		
		// gather params
		var map = {};
		map['email']=$("#login_email_"+formId).val();
		map['pass']=$("#login_pass_"+formId).val();
		map['ajax']=$("#login_ajax_toggle_"+formId).val();
		
		
		// post ajax, sending result to "handle login response"
		// get value of forward_url so handleResponse method can send user somewhere
		var forward_url = $("#login_forward_url_"+formId).val();
		$.post("/shop/AcceptLogin", map,
  				function(data){
					$().handleLoginResponse(data, formId, forward_url);
				},"xml");
		
} // end submitLoginForm



//accepts the login form submission
$.fn.submitLoginFormWP = function(formId) {
		
		// gather params
		var map = {};
		map['email']=$("#login_email_"+formId).val();
		map['pass']=$("#login_pass_"+formId).val();
		map['ajax']=$("#login_ajax_toggle_"+formId).val();
		
		
		// post ajax, sending result to "handle login response"
		// get value of forward_url so handleResponse method can send user somewhere
		var forward_url = $("#login_forward_url_"+formId).val();
		$.post("/shop/AcceptLogin", map,
  				function(data){
					$().handleLoginResponse(data, formId, forward_url);
				},"xml");
		
} // end submitLoginForm



//handles the login response
$.fn.handleLoginResponse = function(data, formId, forward_url) {
         var success = data.documentElement.getAttribute("success");
         var forwardUrl = data.documentElement.getAttribute("drupal_forward_url");
         var hostname = window.location.hostname;
         var tmp = hostname.split('.')[0];

         // LOGIN WAS SUCCESSFUL, set cookies, forward to destination
         if(success=='true'){

              $.ajaxSetup({async:false});
             // SET THE THREE BLOG COOKIES (type 1,2,3 for drupal, wp-author, wp-email, and wp-url)
             $.get("/shop/WpCookieSetter?type=1");
             $.get("/shop/WpCookieSetter?type=2");
             $.get("/shop/WpCookieSetter?type=3");
             if (!forward_url) {
            	 forward_url = '/';
             }
             if (forwardUrl && tmp == 'community') {
                 forwardClient(forwardUrl);
             }
             else {
                 forwardClient(forward_url);
             }
             return;
         }

         // LOGIN NOT SUCCESSFUL, show comment to customer in login panel
         var comment = data.getElementsByTagName("comment")[0].childNodes[0].nodeValue;
         $("#login_comment_"+formId).html(comment);

} // end handleLoginResponse

// does the logout form post
$.fn.submitLogoutForm = function(forward_url) {
		
		// gather params
		var map = {};
		map['logout']="Y";
		map['ajax']="Y";
		//alert("logging out in login.js");
		$.post("/shop/AcceptLogin", map,
  				function(data){
  					$.ajaxSetup({async:false});    
					// SET THE THREE BLOG COOKIES (type 1,2,3 for drupal, wp-author, wp-email, and wp-url)
					$.get("/shop/WpCookieSetter?logout=Y&type=1");
					$.get("/shop/WpCookieSetter?logout=Y&type=2");
					$.get("/shop/WpCookieSetter?logout=Y&type=3");
  				
  				    //alert("supposed to forward in post callback");
  					forwardClient("/");
				},"xml");
		
} // end logout form

})(jQuery);


/*
 * DUP of function in login-form.js.
 * If login-form.js and site-plugins.js are used in the same file, undefined results are possible
 */
function clickLoginForm(formId){
  //alert("submit the form");
  $().submitLoginFormWP(formId);
}

function autoLoadLogin(trigger_element_id, override_tomcat_session){
  //alert('autoLoadLogin');
  var trigger_element = $("#"+trigger_element_id);
  $().retrieveLoginFormMarkup(trigger_element,override_tomcat_session);
}


/*
* FOR FORWARDING CLIENT AFTER SUCCESSFUL LOGIN
* ONCE LOGIN IS MADE, SCREEN USUALLY HAS TO BE FORWARDED OR RELOADED (OR BOTH)
* FOR THE LOGGED-IN STATUS TO BE EXPRESSED TO THE CUSTOMER
*/
function forwardClient(forward_url){
  
  // STAY ON THE SAME PAGE IF FORWARD_URL IS "NONE"
  // OTHERWISE, SEND CLIENT TO THE FORWARD_URL
  if(forward_url!='none'){
    window.document.location=forward_url;
  }
  
  // RELOAD THE CURRENT PAGE IF STAYING ON THE SAME PAGE
  if( forward_url.indexOf("none")>-1 ) {
    window.location.reload();
  }
  
  // RELOAD THE PAGE IF DESTINATION WAS A BLOG COMMENT URL WITH #-PAGE ANCHOR
  // OTHERWISE, THE window.document.location ASSIGNMENT TWO BLOCKS ABOVE HAS NO REAL EFFECT (with the # anchor)
  // SET BLOG COOKIES FIRST, SINCE THE LOGIN=WIDGET WILL NOT LOAD BEFOREHAND ON THE FIRST BLOG PAGE
  if(forward_url.indexOf("#")>-1 && forward_url.indexOf("blog")>-1) {
	window.location.reload();
  }
  
}


/*	end LOGIN	*/
/* group add to cart */

// function for list page
function groupAddToCart(event, sku, isQty) {
	
	//alert('add to cart');
	// The javascript that initiates the add-to-cart
	// param sku: the item sku ('3914STRCRM') to add
	// param isQty: true if function should look for qty field in "mainForm", false otherwise

	if (! event) event = window.event;

	var qty = 1;
	if (isQty) {
		var val = document.mainForm.elements['qty'].value;
		if (isInt(val))
			qty = parseInt(val);
	}


	var map = {}; 
	map ['igid'] = sku;
	$.post("/shop/GroupAddAjax", map,
  		function(data){
//  		alert('should have ajax resp');
  		$("#group_item_add").html(data);
  		var l = getMouseX(event) - 280;
  		var t = getMouseY(event) - 50;
        $("#group_item_add").css("top", t);
        $("#group_item_add").css("left", l);
  		$("#group_item_add").show();
	},"text");


}



// function for DETAIL page
function switchVariation(sku) {

	$("#core-item-region").load("/shop/Detail?FriendlyConverted=Y&ajax=Y&ajax-target=item&id="+sku+" #core-item-region-response");
	$("#main-item-photo-region").load("/shop/Detail?FriendlyConverted=Y&ajax=Y&ajax-target=photo&id="+sku+" #main-item-photo-region-response");

}


/* end group add to cart */













/* reviews */


function getReviews(currentPage, objId, objType) {
	
	//$("div.pagination a.active").toggleClass("active");
	//$("#reviewpaget" + currentPage).attr("class","active");

	var params = '';
	var targetUrl = '';
	if (objType == 'item') {
		params = "item_id=" + objId + "&currentPage=" + currentPage;
		targetUrl = "/shop/ItemReviewAjax";
	}
	
	else if (objType == 'recipe') {
		params = "recipe_id=" + objId + "&currentPage=" + currentPage + "&sort_by=" + $("#sort").val();	
		targetUrl = "/shop/RecipeReviewAjax";
	}
	
	$.ajax({
	    url: targetUrl,
	    type: 'POST',
	    data: params,
	    dataType: "xml",
	    error: function(){
	        alert('Error loading XML document');
	    },
	    success: function(xml) {
	    	processXML(xml);
	    }
	});
	
	//change current page mark
	if (currentPage != '99999') {
		$("a[name='paginate']").show();
		$("#paginationMarkTop").insertAfter("#paginationURLTop" + currentPage).text(parseInt(currentPage) + 1);
		$("#paginationMarkBottom").insertAfter("#paginationURLBottom" + currentPage).text(parseInt(currentPage) + 1);
		$("#paginationURLTop" + currentPage).hide();
		$("#paginationURLBottom" + currentPage).hide();
	} else {
		$("a[name='paginate']").show();
		$("#paginationMarkTop").insertAfter("#paginationURLTop" + currentPage).text("All");
		$("#paginationMarkBottom").insertAfter("#paginationURLBottom" + currentPage).text("All");
		$("#paginationURLTop" + currentPage).hide();
		$("#paginationURLBottom" + currentPage).hide();
	}
	// next page and previouse page buttons
	$("#paginationPreviousURLTop").unbind("click");
	$("#paginationNextURLTop").unbind("click");
	$("#paginationNextURLTop").removeAttr("onclick");
	
	$("#paginationPreviousURLBottom").unbind("click");
	$("#paginationNextURLBottom").unbind("click");
	$("#paginationNextURLBottom").removeAttr("onclick");
	
	$("#paginationPreviousURLTop").bind("click", {currentPage:currentPage, objId:objId, objType:objType}, function (event) {
		event.stopPropagation();
		if (event.data.currentPage != "0" && event.data.currentPage != "99999") {
			getReviews("" + (parseInt(event.data.currentPage) - 1), event.data.objId, event.data.objType);
		}	
	});
	var numberOfPages = $("#paginationURLTop99999").attr("pages");
	$("#paginationNextURLTop").bind("click", {currentPage:currentPage, objId:objId, objType:objType, numberOfPages: numberOfPages}, function (event) {
		event.stopPropagation();
		if (event.data.currentPage != numberOfPages && event.data.currentPage != "99999") {
			getReviews("" + (parseInt(event.data.currentPage) + 1), event.data.objId, event.data.objType);
		}	
	});
	
	$("#paginationPreviousURLBottom").bind("click", {currentPage:currentPage, objId:objId, objType:objType}, function (event) {
		event.stopPropagation();
		if (event.data.currentPage != "0" && event.data.currentPage != "99999") {
			getReviews("" + (parseInt(event.data.currentPage) - 1), event.data.objId, event.data.objType);
		}	
	});
	var numberOfPages = $("#paginationURLBottom99999").attr("pages");
	$("#paginationNextURLBottom").bind("click", {currentPage:currentPage, objId:objId, objType:objType, numberOfPages: numberOfPages}, function (event) {
		event.stopPropagation();
		if (event.data.currentPage != numberOfPages && event.data.currentPage != "99999") {
			getReviews("" + (parseInt(event.data.currentPage) + 1), event.data.objId, event.data.objType);
		}	
	});
	
}

function processXML(xml) {
	
	// remove all the previous reviews
	$(".realreview").remove();
	
	$(xml).find("review").each(function (reviewId) {

		var tmpObj = $("#RatingRow").clone(true);
		$("#RatingRow").addClass("realreview").attr("id", "RatingRow" + reviewId);
		$("#RatingRow" + reviewId).attr("style", "display: block");
		var stars = $(this).find("stars").text();
		
		if (parseInt(stars) > 0){
			$("#rating").attr("class", "star-rating stars"+stars);
	 	}
		else
			$("#rating").attr("style", "display:none");
	
		$("#comments").html($(this).find("comments").text());
		$("#submitted").text($(this).find("submitted").text());
		$("#name").html($(this).find("name").text());
		$("#city_state").html($(this).find("city_state").text());
		$("#rating").attr("id", "rating" + reviewId);
		$("#comments").attr("id", "comments" + reviewId);
		$("#submitted").attr("id", "submitted" + reviewId);
		$("#name").attr("id", "name" + reviewId);
		$("#city_state").attr("id", "city_state" + reviewId);
	
		tmpObj.insertAfter("#RatingRow" + reviewId);
	
		//alert(" supposedly inserted review ");
		
	});

	$("#review-count").text($(xml).find("ReviewCount").text());
	$("#RatingRow").attr("style", "display: none");
}

/* end reviews */






/* waiting.js */

// javascript for gift-card functions
// relies on jQuery -- /shop/js/jquery.js

// processOrder
$.fn.processOrder = function() {

			var orderNum = $().getParamVal('param','un-set')
			var origin = $().getParamVal('origin','Payment');
			//alert(orderNum);
			//alert(origin);
											
			var map = {}; 
			map['param'] = orderNum;
			map['origin'] = origin;
			
			$.post("/shop/ProcessOrder", map,
  				function(data){
					$().doOrderResponse(data);
				},"xml");

}


$.fn.doOrderResponse = function(data)
{
	var success = data.documentElement.getAttribute("success");
	if(success=='true'){
		document.location="/shop/Confirmation";
	} else {
		var origin_page = data.documentElement.getAttribute("origin_page");
		document.location="/shop/"+origin_page+"#cc_error";  
	}
}


$.fn.getParamVal = function (key, default_)
{
  if (default_==null) default_="";
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}

/* end waiting.js */





/* register.js */
// show-hide pro baker section
$.fn.proBakerSection = function(){
	if($("#baker_y").is(':checked')){
	   	$("#bakery_span").removeAttr("class");
	} else {
	 	$("#bakery_span").attr("class","none");
	}
};

/* end register.js */
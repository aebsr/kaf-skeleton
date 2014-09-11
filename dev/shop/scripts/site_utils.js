/**
 * jQuery Cookie plugin
 * 
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de) Dual licensed under the MIT and
 * GPL licenses: http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * 
 */
jQuery.cookie = function(key, value, options) {

	// key and at least value given, set cookie...
	if (arguments.length > 1 && String(value) !== "[object Object]") {
		options = jQuery.extend({}, options);

		if (value === null || value === undefined) {
			options.expires = -1;
		}

		if (typeof options.expires === 'number') {
			var days = options.expires, t = options.expires = new Date();
			t.setDate(t.getDate() + days);
		}

		value = String(value);

		return (document.cookie = [
				encodeURIComponent(key),
				'=',
				options.raw ? value : cookie_encode(value),
				options.expires ? '; expires=' + options.expires.toUTCString()
						: '', // use
				// expires
				// attribute,
				// max-age
				// is
				// not
				// supported
				// by
				// IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : '' ].join(''));
	}

	// key and possibly options given, get cookie...
	options = value || {};
	var result, decode = options.raw ? function(s) {
		return s;
	} : decodeURIComponent;
	return (result = new RegExp('(?:^|; )' + encodeURIComponent(key)
			+ '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

function cookie_encode(string) {

	// full uri decode not only to encode ",; =" but to save uicode charaters
	var decoded = encodeURIComponent(string);

	// encod back common and allowed charaters {}:"#[] to save space and make
	// the cookies more human readable
	var ns = decoded.replace(/(%7B|%7D|%3A|%22|%23|%5B|%5D)/g, function(
			charater) {
		return decodeURIComponent(charater);
	});
	return ns;
}

/**
 * END jQuery Cookie plugin ---
 */

/*******************************************************************************
 * 
 * ADD TO CART FUNCTIONS
 * 
 ******************************************************************************/

// HTTP Up To AddToCart Servlet
$.fn.addToCart = function(event, id, qty) {

	// alert (event.pageX+" "+event.pageY);
	var map = {};
	map["id"] = id;
	map["qty"] = qty;
	map["mode"] = "ajax-full";
	$.get("/shop/servlet/AddItem", map, function(data) {
		$().doAddCartResponse(data);
	}, "text");

} // end addToCart

// HTTP Up To AddToCart Servlet
$.fn.addBecClassToCart = function(event, id, qty) {
	$.get("/shop/servlet/AddItem", {becClass: id, qty: qty}, function(data) {
		$().doAddCartResponse(data);
	}, "text");

};// end addBecClassToCart

// HANDLE RESPONSE FROM AddToCart Servlet
$.fn.doAddCartResponse = function(data) {

	// $("div#ajax-infobox").html(data);
	// $("div#ajax-infobox").fadeIn(500);
	$("div#ajax-infobox").html(data).slideDown(); // new line
	$("#cart-count").load(
			"/shop/CartDisplay?for-cart-count=Y&v=" + new Date().getTime());

};

/*******************************************************************************
 * 
 * ADD TO WISHLIST FUNCTIONS
 * 
 ******************************************************************************/

// HTTP Up To AddToWishlist Servlet
$.fn.addToWishList = function(id) {

	var map = {};
	map["id"] = id;
	map['ajax'] = 'Y';
	$.get("/shop/WishListDisplay", map, function(data) {
		$("a[title='Add " + id + " to wishlist']").hide();
		$("a#on-wishlist-" + id).fadeIn(400);
	}, "text");

} // end addToCart

/*******************************************************************************
 * 
 * LOGIN FORM FUNCTIONS
 * 
 ******************************************************************************/
// accepts the login form submission
$.fn.submitLoginForm = function() {

	// alert("start login form submit");

	$("#ajax-spinner").fadeIn(400);

	// gather params
	var map = {};
	map['email'] = $("#login_email").val();
	map['pass'] = $("#login_pass").val();
	map['ajax'] = 'Y';

	// get optional "forward url" to send the user to if login success
	var forward_url = $("#login_forward_url").val();
	// alert("in submit method forward_url is "+forward_url);

	$.post("/shop/AcceptLogin", map, function(data) {
		$().handleLoginResponse(data, forward_url);
		$("#ajax-spinner").fadeOut(400);
	}, "xml");

} // end submitLoginForm

// handles the login response
$.fn.handleLoginResponse = function(data, forward_url) {

	var success = data.documentElement.getAttribute("success");
	var forwardUrl = data.documentElement.getAttribute("drupal_forward_url");
	var hostname = window.location.hostname;
	var tmp = hostname.split('.')[0];

	// LOGIN WAS SUCCESSFUL, set cookies, forward to destination
	if (success == 'true') {

		$.ajaxSetup({
			async : false
		});

		// SET THE THREE BLOG COOKIES (type 1,2,3 for drupal, wp-author,
		// wp-email, and wp-url)
		$.get("/shop/WpCookieSetter?type=1");
		$.get("/shop/WpCookieSetter?type=2");
		$.get("/shop/WpCookieSetter?type=3");
		if (!forward_url) {
			forward_url = '';
		}

		if (forwardUrl && tmp == 'community') {
			forwardClient(forwardUrl);
		} else {
			forwardClient(forward_url);
		}

		return;
	}

	// LOGIN NOT SUCCESSFUL, show comment to customer in login panel
	var comment = data.getElementsByTagName("comment")[0].childNodes[0].nodeValue;
	$("#login_comment").html(comment);

} // end handleLoginResponse

/*******************************************************************************
 * 
 * FORWARD CLIENT
 * 
 * 
 * FOR FORWARDING CLIENT AFTER SUCCESSFUL LOGIN. ONCE LOGIN IS MADE, SCREEN
 * USUALLY HAS TO BE FORWARDED OR RELOADED (OR BOTH) FOR THE LOGGED-IN STATUS TO
 * BE EXPRESSED TO THE CUSTOMER.
 * 
 * 
 ******************************************************************************/
function forwardClient(forward_url) {

	/***************************************************************************
	 * login form was triggered by adding-to-wishlist from detail page. perform
	 * add-to-wishlist as side-effect of login.
	 **************************************************************************/
	if (forward_url == 'add-to-wishlist') {

		var itemId = "";

		// get item id, check for hidden type first then item-variation style
		// (radio buttons) second. Then invoke AddToWishlist function
		if ($("input#item-id").attr("type") == 'hidden') {
			itemId = $("input#item-id").val();
		} else {
			itemId = $('input:radio[name=item-id]:checked').val();
			var tmp = $("a[title*='to wishlist']").attr("title");
			var oldItemId = tmp.split(" ")[1];
			$("a[title='Add " + oldItemId + " to wishlist']").attr("title", "Add " + itemId + " to wishlist");
			$("#on-wishlist-" + oldItemId).attr("id", "on-wishlist-" + itemId);
		}
		$().addToWishList(itemId);

		// not going anywhere,so hide modal panel and reload the profile block
		$("div#modal-overlay").click();
		$("#account-container-mobile").load("/shop/AccountWidget",{});
		$("#account-container").load("/shop/AccountWidget", {}, function() {
			$('a[rel*=modalPanel]').modalPanel();
		});

	} else if (forward_url.indexOf('cart-add-to-wishlist') > -1) {
		/***********************************************************************
		 * login form was triggered by adding-to-wishlist, called from
		 * cart-page. perform add-to-wishlist as side-effect of login.
		 **********************************************************************/

		var itemId = forward_url.split(":")[1];
		$().addToWishList(itemId);

		// not going anywhere,so hide modal panel and reload the profile block
		$("div#modal-overlay").click();
		$("#account-container-mobile").load("/shop/AccountWidget", {});
		$("#account-container").load("/shop/AccountWidget", {}, function() {
			$('a[rel*=modalPanel]').modalPanel();
		});

	} else if (forward_url == 'header-login') {
		/***********************************************************************
		 * login form was triggered by normal header link to "sign-in". not
		 * going anywhere,so hide modal panel and reload the profile block
		 **********************************************************************/
		$("div#modal-overlay").click();
		$("#account-container-mobile").load("/shop/AccountWidget",{});
		$("#account-container").load("/shop/AccountWidget", {}, function() {
			$('a[rel*=modalPanel]').modalPanel();
		});
		$().updateRecipeLinksAfterLogin();
	} else {

		// STAY ON THE SAME PAGE IF FORWARD_URL IS "NONE"
		// OTHERWISE, SEND CLIENT TO THE FORWARD_URL
		if (forward_url != 'none') {
			window.document.location = forward_url;
		}

		// RELOAD THE CURRENT PAGE IF STAYING ON THE SAME PAGE
		if (forward_url.indexOf("none") > -1) {
			window.location.reload();
		}

	}

}

$.fn.updateRecipeLinksAfterLogin = function () {
	$("#add-recipebox-container").load("/shop/RecipeBoxWidget", 
				{
					nologin_pick_element: "RecipeBox_NoLogin", 
					nologin_forwarding_elemnts:["RecipeBox_NoLogin1", "RecipeBox_NoLogin2"],
					nologin_drupal_link: "Y",
					nologin_forward_url: "/recipebox/myrecipebox",
					login_pick_element: "RecipeBox_Login", 
					login_forwarding_elemnts:["my-recipes-url-img", "my-recipes-url"],
					login_drupal_link: "Y",
					login_forward_url: "/recipebox/myrecipebox"
				}, 
				function() {
					$("a[rel=modal_Panel]").modalPanel();
					return false;
				}
			);
		$("#add-recipe").load("/shop/RecipeBoxWidget", 
				{
					nologin_pick_element: "AddToRecipeBoxURL_NoLogin", 
					nologin_forwarding_elemnts:["AddToRecipeBoxURL_NoLogin"],
					nologin_drupal_link: "N",
					nologin_forward_url: "/shop/RecipeBoxPage?add=" + $("#PrintID").val(),
					login_pick_element: "AddToRecipeBoxURL_Login", 
					login_forwarding_elemnts:["AddToRecipeBoxURL_Login"],
					login_drupal_link: "N",
					login_forward_url: "/shop/RecipeBoxPage?add=" + $("#PrintID").val()
				}, 
				function() {
					$("a[rel=modal_Panel_AddUrl]").modalPanel();
					return false;
				}
		);
}

// LOGOUT FUNCTION
$.fn.submitLogoutForm = function(forward_url) {

	// gather params
	var map = {};
	map['logout'] = "Y";
	map['ajax'] = "Y";
	// alert("logging out in login.js");
	$.post("/shop/AcceptLogin", map, function(data) {
		$.ajaxSetup({
			async : false
		});
		// SET THE THREE BLOG COOKIES (type 1,2,3 for drupal,
		// wp-author, wp-email, and wp-url)
		$.get("/shop/WpCookieSetter?logout=Y&type=1");
		$.get("/shop/WpCookieSetter?logout=Y&type=2");
		$.get("/shop/WpCookieSetter?logout=Y&type=3");

		// alert("supposed to forward in post callback");
		forwardClient("/");
	}, "xml");

} // end logout form

/*******************************************************************************
 * 
 * NOTIFY ME FUNCTION (NOTIFY WHEN BACK In STOCK)
 * 
 ******************************************************************************/
function notifyMe() {

	var map = {};
	map['email-field'] = $("#email").val();
	map['item-field'] = $("input#item").val();
	map['DAOname'] = $("input#DAOname").val();
	map['ajax'] = 'Y';

	$.post("/shop/PostDAO", map, function(data) {

		$("#success").fadeIn(500);

	}, "text");

}

/*******************************************************************************
 * 
 * Cart count method to defeat
 * 
 ******************************************************************************/
function notifyMe() {

	var map = {};
	map['email-field'] = $("#email").val();
	map['item-field'] = $("input#item").val();
	map['DAOname'] = $("input#DAOname").val();
	map['ajax'] = 'Y';

	$.post("/shop/PostDAO", map, function(data) {

		$("#success").fadeIn(500);

	}, "text");

}

/*******************************************************************************
 * *****************************************************************************
 * Load recipebox link 
 * ****************************************************************************
 ******************************************************************************/
$.fn.loadRecipeBoxLink = function () {
	if ($("#add-recipebox-container")) {
		$("#add-recipebox-container").load("/shop/RecipeBoxWidget", 
			{
				nologin_pick_element: "RecipeBox_NoLogin", 
				nologin_forwarding_elemnts:["RecipeBox_NoLogin1", "RecipeBox_NoLogin2"],
				nologin_drupal_link: "Y",
				nologin_forward_url: "/recipebox/myrecipebox",
				login_pick_element: "RecipeBox_Login", 
				login_forwarding_elemnts:["my-recipes-url-img", "my-recipes-url"],
				login_drupal_link: "Y",
				login_forward_url: "/recipebox/myrecipebox"
			}, 
			function() {
				$("a[rel=modal_Panel]").modalPanel();
				return false;
			}
		);
	}
	if ($("#add-recipe")) {
		$("#add-recipe").load("/shop/RecipeBoxWidget", 
			{
				nologin_pick_element: "AddToRecipeBoxURL_NoLogin", 
				nologin_forwarding_elemnts:["AddToRecipeBoxURL_NoLogin"],
				nologin_drupal_link: "N",
				nologin_forward_url: "/shop/RecipeBoxPage?add=" + $("#PrintID").val(),
				login_pick_element: "AddToRecipeBoxURL_Login", 
				login_forwarding_elemnts:["AddToRecipeBoxURL_Login"],
				login_drupal_link: "N",
				login_forward_url: "/shop/RecipeBoxPage?add=" + $("#PrintID").val()
			}, 
			function() {
				$("a[rel=modal_Panel_AddUrl]").modalPanel();
				return false;
			}
		);
	}
}

/*******************************************************************************
 * *****************************************************************************
 * DOCUMENT READY FUNCTION. BELOW HERE, ALL TRIGGERS.
 * 
 * ****************************************************************************
 ******************************************************************************/
//$(document).ready(
$.fn.onPageShowHandler = function() {
	
		
			/*******************************************************************
			 * cart count tag loaded
			 * these are done as post requests (notice map object)
			 * supposedly because IE9 won't do jquery load() as get
			 ******************************************************************/
			$(".cartCount").load(
						"/shop/CartDisplay?for-cart-count=Y&v="
							+ new Date().getTime(), {});
			$("#cartCount").load(
					"/shop/CartDisplay?for-cart-count=Y&v="
							+ new Date().getTime(), {});
			$("#cartCount-m").load(
					"/shop/CartDisplay?for-cart-count=Y&v="
							+ new Date().getTime(), {});
			
			/*******************************************************************
			 * LOAD DYNAMIC MARKUP INTO HEADER ACCOUNT CONTAINER
			 * One req for mobile, one req for regular
			 * (note the post meth here is to force IE into the right behavior despite IE bug)
			 ******************************************************************/
			var forwardUrl = document.URL;
			var acctPost = "/shop/AccountWidget?forward-url="+forwardUrl;
			$("#account-container-mobile").load(acctPost,{});
			$.post(acctPost, {}, function(data) {
				$("#account-container").html(data);
				$('a[rel*=modalPanel]').modalPanel();
			}, "text");
			

			/*******************************************************************
			 * add-to-cart pressed from full product page
			 ******************************************************************/
			$("form#addtocart").attr("action","javascript:void(0)");
			$("input#add-to-cart-button").click(function(event) {

				var qty = $("input#qty").val();
				var itemId = "";

				// get item id, check for hidden type first then item-variation
				// (radio buttons) second. Then invoke AddToCart function
				if ($("input#item-id").attr("type") == 'hidden') {
					itemId = $("input#item-id").val();
				} else {
					itemId = $('input:radio[name=item-id]:checked').val();
				}

				// invoke function to add item
				$().addToCart(event, itemId, qty);

			});

			$('.btn-add2cart').click( function (e) {
				var qty = $('#quantity').val();
				var classAndSession = $('[data-server-id=sessionCheckbox]:checked').val();
				$(this).addBecClassToCart(e, classAndSession, qty);
			});

			/*******************************************************************
			 * add-to-cart pressed from subcat page or attribute list page
			 ******************************************************************/
			$("a#item-add-url").attr("href","javascript:void(0)");
			$("a#item-add-url").click(
					function(event) {

						var qty = 1;
						var itemId = "";

						// get item id, check 'name' attribute of anchor tag
						// first. Then item-variation style
						// (radio buttons) second. Then invoke AddToCart
						// function
						if ($(this).attr("name") != 'variation') {
							itemId = $(this).attr("name");
						} else {
							itemId = $(this).parentsUntil('form').find(
									'option:selected').val();
						}

						// alert(itemId);

						// invoke function to add item
						$().addToCart(event, itemId, qty);

					});

			/*******************************************************************
			 * Add-to-wishlist clicked from product page, already logged in
			 ******************************************************************/
			$("a#add-to-wishlist").click(function() {

				var itemId = "";

				// get item id, check for hidden type first then item-variation
				// style
				// (radio buttons) second. Then invoke AddToCart function
				if ($("input#item-id").attr("type") == 'hidden') {
					itemId = $("input#item-id").val();
				} else {
					itemId = $('input:radio[name=item-id]:checked').val();
					var tmp = $("a[title*='to wishlist']").attr("title");
					var oldItemId = tmp.split(" ")[1];
					$("a[title='Add " + oldItemId + " to wishlist']").attr("title", "Add " + itemId + " to wishlist");
					$("#on-wishlist-" + oldItemId).attr("id", "on-wishlist-" + itemId);
				}

				// invoke function to add item
				$().addToWishList(itemId);

			});

			/*******************************************************************
			 * Add-to-wishlist clicked from cart page, already logged in
			 ******************************************************************/
			$("a#cart-add-to-wishlist-login").modalPanel();
			$("a#cart-add-to-wishlist").click(function() {

				var itemId = $(this).attr("name");
				$().addToWishList(itemId);

			});

			/*******************************************************************
			 * Attribute filtering on sub-category/attr-list page from left nav
			 ******************************************************************/
			$("a#attr-val-label").click(
					function() {

						var preChosenAttrs = $("input#chosen-attrs").val();
						var newChosenAttrs = "";

						// possible reset option means remove the attribute from
						// next page
						if ($(this).attr("name").indexOf("reset:") > -1) {
							var attrToRemove = $(this).attr("name").replace(
									"reset:", "");
							newChosenAttrs = preChosenAttrs.replace(
									attrToRemove, "")
						} else {
							newChosenAttrs = preChosenAttrs + ","
									+ $(this).attr("name");
						}

						$("input#chosen-attrs").attr("value", newChosenAttrs);
						$("form#sort-form").submit();

					});

			/*******************************************************************
			 * Attribute filtering on sub-category page from crumb-trail links
			 ******************************************************************/
			$("a#breadcrumb-attr").click(function() {

				$("input#chosen-attrs").attr("value", $(this).attr("name"));
				$("form#sort-form").submit();

			});

			/*******************************************************************
			 * CLEAR Attribute filtering on sub-category page or attr list page
			 ******************************************************************/
			$("a#clear-attr-selections").click(function() {
				$("input#chosen-attrs").attr("value", "");
				$("form#sort-form").submit();
			});



			/*******************************************************************
			 * PREP THE NOTIFY-ME LINK TO USE MODAL-PANEL
			 ******************************************************************/
			$("a#boURL").modalPanel();

			/*******************************************************************
			 * PREP THE ADD-TO-WISHLIST-(NOT-LOGGED-IN) LINK TO USE MODAL-PANEL
			 ******************************************************************/
			$("a#add-to-wishlist-login").modalPanel();
			
			$().loadRecipeBoxLink();
}
		//});


//if (!window.addEventListener) {
	//window.attachEvent("pageshow", function () {$().onPageShowHandler();});
//    alert("js about to call window.attacheEvent in if clause");
//	window.attachEvent("onload", function () {$().onPageShowHandler();}); // IE8
 //   alert("js done calling window.attacheEvent in if clause");

//} //else {
  //  alert("js about to call window.attacheEvent in else clause");
//	window.addEventListener("pageshow", function () {$().onPageShowHandler();}, false );
 //   alert("js done calling window.attacheEvent in else clause");

//}

window.onload = function () {$().onPageShowHandler();};

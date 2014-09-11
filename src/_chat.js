
/*
	Salesforce chat custom function
	
	author: Julie Berlin
	date: Oct 7, 2013
	file path: /ui-assets/v5/js/chat.js
	purpose: chat instantiation failed unless all ids are found, 
	changed code to be dependent on finding each id in dom before proceeding
		
*/

if (!window._laq) { window._laq = []; }

if(document.getElementById('liveagent_button_online_573A0000000CadV')) {
	// CS Button 1: graphic
	window._laq.push(function(){
		liveagent.showWhenOnline('573A0000000CadV', document.getElementById('liveagent_button_online_573A0000000CadV'));
		liveagent.showWhenOffline('573A0000000CadV', document.getElementById('liveagent_button_offline_573A0000000CadV'));
	});
}

if(document.getElementById('liveagent_button_online_573A0000000CauG')) {
	// CS Button 2: text
	window._laq.push(function(){
		liveagent.showWhenOnline('573A0000000CauG', document.getElementById('liveagent_button_online_573A0000000CauG'));
		liveagent.showWhenOffline('573A0000000CauG', document.getElementById('liveagent_button_offline_573A0000000CauG'));
	});
}
	
if(document.getElementById('liveagent_button_online_573A0000000Cau6')) {
	// Bakers Button 1: graphic
	window._laq.push(function(){
		liveagent.showWhenOnline('573A0000000Cau6', document.getElementById('liveagent_button_online_573A0000000Cau6'));
		liveagent.showWhenOffline('573A0000000Cau6', document.getElementById('liveagent_button_offline_573A0000000Cau6'));
	});
}

if(document.getElementById('liveagent_button_online_573A0000000CauL')) {
	// Bakers Button 2: text
	window._laq.push(function(){
		liveagent.showWhenOnline('573A0000000CauL', document.getElementById('liveagent_button_online_573A0000000CauL'));
		liveagent.showWhenOffline('573A0000000CauL', document.getElementById('liveagent_button_offline_573A0000000CauL'));
	});
}

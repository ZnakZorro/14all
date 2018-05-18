"use strict";

const $=(y)=>document.querySelector(y);

function getURLParameter(name) {
		return decodeURIComponent(
			(location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]
		);
}

document.addEventListener('DOMContentLoaded', function() {
	let menu14=["home","pogoda","radio","todo","3d","links"];
	let menu_place = $('nav');
	console.log('place=',menu_place);
	let arrpath = location.pathname.split('/');
	let path = arrpath[arrpath.length-1];
	console.log('path=',path);
	menu14.forEach(function(m){
		console.log(m);	
	});
});


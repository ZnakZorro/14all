"use strict";

const $=(y)=>document.querySelector(y);

function getURLParameter(name) {
		return decodeURIComponent(
			(location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]
		);
}

document.addEventListener('DOMContentLoaded', function() {
	let menu14=["pogoda","radio","todo","3d","links"];
	
	let xxyy = $('.content').getBoundingClientRect();
	let hh = window.innerHeight;	
	$('.content').style.height = (hh - xxyy.top + 10)+'px';
	let arrpath = location.pathname.split('/');
	console.log('arrpath=',arrpath);
	let path = arrpath[arrpath.length-2];
	console.log('path=',path);
	
	let menuHtml ='';
	menu14.forEach(function(m){
		let pre = './strony/';
		if (path != '14all') {pre = '../../strony/';}
		menuHtml += '<a href="'+pre+m+'" class="nava icon-'+m+'" title="'+m.toUpperCase()+'"><img src="/14all/css/'+m+'.svg" class="maska"></a>';
	});
	$('.nav').innerHTML += menuHtml;
});


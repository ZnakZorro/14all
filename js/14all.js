"use strict";

const $=(y)=>document.querySelector(y);

function getURLParameter(name) {
		return decodeURIComponent(
			(location.search.match(RegExp("[?|&]"+name+'=(.+?)(&|$)'))||[,null])[1]
		);
}

document.addEventListener('DOMContentLoaded', function() {
	let xxyy = $('.content').getBoundingClientRect();
	let hh = window.innerHeight;	
	console.log(xxyy);
	$('.content').style.height = (hh - xxyy.top + 10)+'px';
	
	let menu14=["home","pogoda","radio","todo","3d","links"];
	//let menu_place = $('div.nav');
	//console.log('place=',menu_place);
	let arrpath = location.pathname.split('/');
	console.log('arrpath=',arrpath);
	let path = arrpath[arrpath.length-2];
	console.log('path=',path);
	
	let menuHtml ='';
	//let newDiv = document.createElement('div');
	//newDiv.className="nav";
	menu14.forEach(function(m){
		console.log(m);	
		//newDiv.innerHTML += m+'<br';
		menuHtml += '<a href="./'+m+'" class="nava icon-'+m+'" title="'+m+'"><img src="/14all/css/'+m+'.svg" class="maska"></a>';
	});
	//console.log(newDiv);
	//$('.mobile-wrap').appendChild(newDiv);
	$('.nav').appendChild(newDiv);
});


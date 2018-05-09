console.log('1 ajax.js');

function showErrorMessage(err){
	$('#info').innerHTML = err;	
}

	function loadXHR(url, callback) {
		console.log('loadXHR===');
		let xhr=null;
		if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
		else {
			let versions = ["MSXML2.XmlHttp.5.0","MSXML2.XmlHttp.4.0","MSXML2.XmlHttp.3.0","MSXML2.XmlHttp.2.0","Microsoft.XmlHttp"]
			for(let i = 0, len = versions.length; i < len; i++) {
			try {xhr = new ActiveXObject(versions[i]);break;}
			catch(e){ console.log('WebWorkers ERROR::',e.toString());}
			}
		}
		
		xhr.onreadystatechange = ensureReadiness;
		function ensureReadiness() {
			if(xhr.readyState < 4) {return;}			
			if(xhr.status !== 200) {return;}
			// all is well	
			if(xhr.readyState === 4) {callback(xhr.responseText);} else {showErrorMessage('Błąd połaczenia z radiem','Problem z wifi -getXHR');}			
		}
		xhr.open('GET', url, true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");		
		xhr.send('');
	}


	function getXHR(url,callback){
		console.log('getXHR===');
		console.log('|'+url+'|');
		let xmlhttp=null;
        if   (window.XMLHttpRequest){xmlhttp = new XMLHttpRequest();}
        else {xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");}
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState==4){
				if (xmlhttp.status==200){
					var ret = xmlhttp.responseText;
					//console.log(ret)
					callback(ret);
				} else {showErrorMessage('Błąd połaczenia z radiem','Problem z wifi -getXHR');}
				
            }
        }
		try{
			xmlhttp.open("GET",url,true);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");	
			xmlhttp.send();
		}catch(err){showErrorMessage('Błąd połaczenia z radiem','Problem z wifi -getXHR');}
    }	
	
	
function ajx(url,callback){
	console.log('ajax===');
	fetch(url, {
		method: 'GET',
		timeout: 15000,
		cache: 'no-cache',
		mode: 'cors', 
		credentials: '*',
		redirect: 'follow',
		headers: new Headers({'Access-Control-Allow-Origin':'*','Content-Type': 'text/plain'})
		//headers: new Headers({'Content-Type': 'application/json'})
	}).then(function(response) {
		return response.text();
	}).then(function(tx) {
		console.log('ajx text=',tx);
		if(tx) callback(tx);
	}).catch(function(err) {
		console.log(err);
		console.log('Ajax radio problem','Problem z wifi - ajx');
	});	
	
}

	function ajxxx(method,url,callback,params){
		console.log('ajaxxx===');
		let api = '';
		if (params){
			if (typeof(params) === 'object'){
				api = params.join('/');
			}
		}
		
		let opt = {
			headers: {
				"Accept": "text/plain",
				"Content-Type": "application/x-www-form-urlencoded"
			},
			timeout:3000,
			method: method		
		};
		if (method==='POST') opt.body = api;
		let u = url+api; 
		fetch(u,opt)
		.then(function(e){return e.json()})
		.then(function(json){
			if(json){
				if (json[0]) callback(json[0]);
				else callback(json);
			}
		}).catch(function(err) {
			callback({error:err.toString()});
		});
	}



/*
	
var token = '';
function setHeader(xhr) {

  xhr.setRequestHeader('Authorization', token);
}	
	
	
	
	
	function jgetXHR(url,callback){
		$.ajax({
			xhrFields: {withCredentials: true},
			url: url,
			type: 'GET',
			crossDomain: true,
			dataType: 'json',
			done: function(r) { 
				console.log("Done",r); 
			},
			success: function(r) { 
				console.log("Success",r); 
			},
			error: function() { 
				console.log('Failed!'); 
			},
			beforeSend: setHeader
		});
	}

*/

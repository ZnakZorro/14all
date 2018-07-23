//requiring path and fs modules
let path = require('path');
let fs = require('fs');

Array.prototype.shuffle=function(){
   var len = this.length,temp,i
   while(len){
    i=Math.random()*len-- |0;
    temp=this[len],this[len]=this[i],this[i]=temp;
   }
   return this;
}



let musicdirs = ['1-VocalLegends','2-JazzBallads'];
var allmusic=[];


	musicdirs.forEach(function(dir){
		let directoryPath = path.join(__dirname, dir);
		let files = fs.readdirSync(directoryPath)
		
		let pliki = files.map(function(f) {
			return directoryPath+"\\"+f;
		});			
			allmusic = allmusic.concat(pliki);
	} );
	
	allmusic = allmusic.shuffle()
	//console.log(allmusic); 
	//console.log(allmusic.length); 
	let arr = []
	let j=0;
	allmusic.forEach(function (x,i) {
		j=i;		
		//console.log(i,x); 
		arr.push(x)
		if (i%100===0){
			//console.log(i,arr.length)
			zapisz(arr,i)
			arr.length=0;
		}
	})
	zapisz(arr,j)
	
	
	function zapisz(arr,i){
		console.log('===============');
		console.log(i);
		console.log(arr.join('\n'));
	}
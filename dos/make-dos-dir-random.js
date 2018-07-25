//requiring path and fs modules
let path = require('path');
let fs = require('fs');

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

Array.prototype.shuffle=function(){
   var len = this.length,temp,i
   while(len){
    i=Math.random()*len-- |0;
    temp=this[len],this[len]=this[i],this[i]=temp;
   }
   return this;
}

	function readDirs(pat){
		pat = pat || '.';
		let out=[];
		let directoryPath = path.join(__dirname, pat);
		let dires = fs.readdirSync(directoryPath)
		//console.log(dires)
		dires.forEach(function(path){
			let stat = fs.statSync(path);
			if (stat.isDirectory(path)) {
				out.push(path);
			}
		});
		return out;
	}

	
/*****************************/
/*****************************/
let divider    = 100;
let globalpath = '@randomMusic';
let batFile    = 'copyrandomfiles.bat';
/*****************************/

let musicdirs = readDirs();//['1-VocalLegends','2-JazzBallads'];
let allmusic=[];
let outText = 'mkdir '+globalpath+'\n';

	musicdirs.forEach(function(dir){
		if (dir.toUpperCase() != 'ZAPAS' && dir.toUpperCase() != globalpath.toUpperCase()){
			let directoryPath = path.join(__dirname, dir);
			let files = fs.readdirSync(directoryPath)
			let pliki = files.map(function(f) {
				return directoryPath+"\\"+f;
			});			
		allmusic = allmusic.concat(pliki);
		}	
	});
	
	//allmusic = allmusic.shuffle()
	shuffleArray(allmusic);
	shuffleArray(allmusic);
	shuffleArray(allmusic);
	//console.log(allmusic); 
	//console.log(allmusic.length); 
	let arr = []
	let j=0;
	allmusic.forEach(function (x,i) {
		j=i;		
		//console.log(i,x); 
		arr.push(x)
		if (i%divider === 0 && i>0){
			//console.log(i,arr.length)
			zapisz(arr,i)
			arr.length=0;
		}
	})
	zapisz(arr,j)
	
	
	function zapisz(arr,i){
		outText += "\nmkdir .\\"+globalpath+"\\"+i+"\n";
		//console.log('===============');
		console.log(i);
		//console.log(arr.join('\n'));
		arr.forEach(function(f){
			let o = f.split('\\').pop();
			o = o.replace(/[^a-zA-Z0-9\.]/g,'-');	// dzikie znaki na myślnik
			o = o.replace(/\-+/g, '-');			// wiele myslników na jeden
			o = o.replace('-.', '.');			// 
			outText += 'copy "'+f+'" ".\\'+globalpath+'\\'+i+'\\'+o+'" /Y\n';
		})
		
	}

	
console.log('===============');
	console.log(outText);
console.log('===============');


fs.writeFile(batFile, outText, function(err) {
	if(err) {
		return console.log(err);
	}
	console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
	console.log(' The file was saved to => '+globalpath+' => '+batFile);
	console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
	console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
});



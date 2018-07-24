//requiring path and fs modules
const path = require('path');
const fs = require('fs');

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
let globalpath = 'randomMusic';
let batFile    = 'randomfiles.bat';
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

	
/*.............................*/
function copyFile(source, target) {
  var rd = fs.createReadStream(source);
  var wr = fs.createWriteStream(target);
  return new Promise(function(resolve, reject) {
    rd.on('error', reject);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  }).catch(function(error) {
    rd.destroy();
    wr.end();
    throw error;
  });
}	
function mkdirpath(dirPath){
    if (!fs.existsSync(dirPath)){
        try{fs.mkdirSync(dirPath);}
        catch(e){
            mkdirpath(path.dirname(dirPath));
            mkdirpath(dirPath);
        }
    } else {console.log(dirPath+ ' exist')}
}
/*.............................*/


	function zapisz(arr,i){
		let ii = Math.ceil(i/100)*100;
		let dir = ".\\"+globalpath+"\\"+ii+"\\";
		mkdirpath(dir);
		arr.forEach(function(src,x){
			let dest = src.split('\\').pop();
			dest = dest.replace(/[^a-zA-Z0-9\.]/g,'-');	// dzikie znaki na myślnik
			dest = dest.replace(/\-+/g, '-');			// wiele myslników na jeden
			dest = dest.replace('-.', '.');
			dest = dir+dest;
			console.log(i,x,dir,"src="+src, "dest="+dest);
			copyFile(src, dest);
		})
	}

	
console.log('===============');
console.log(' - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');



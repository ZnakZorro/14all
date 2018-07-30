const fs = require('fs');
const convnetjs = require("../js/convnet");
	
function getArgs(name,def=null){
	let args = process.argv.slice(2) || [];
	//console.log('args=',args);
	let out = def;
	args.forEach(function(el){
		let arr = el.split('=');
		if (arr[0]===name) {out= arr[1];}
	});
	return out;	
}


function readJsonData(file){
	let rawdata = fs.readFileSync('data/'+file);  
	let dane = JSON.parse(rawdata);  
	return dane;
}

function readJsonModel(file){
	let rawdata = fs.readFileSync('models/'+file);  
	let moda = JSON.parse(rawdata);  
	return moda;
}

function readModelsFromFiles(){
	let path = __dirname.replace('node_modules','')+'models';
	let mody = fs.readdirSync(path);
	return mody;
}

function saveModelsToFiles(net,netname){
	let path = __dirname.replace('node_modules','')+'models/'+netname;
	var json = net.toJSON();
	var jsonstr = JSON.stringify(json);		
	fs.writeFileSync(path, jsonstr);
	
}


	function oneToByte(x) {
		x = (x*255);
		if (x < 0) return 0;
		else if (x>255) return 255;
		else return x;
	}
	function arrOneToByte(arr) {
		return arr.map(function(x){return Math.floor(oneToByte(x))});
	}

	function compileNewNet(netConfig,net,layer_count,num_neurons,active,batch_size){
		layer_count  = layer_count || 3;
		num_neurons  = num_neurons || 9;
		active       = active      || 'relu';
		batch_size   = batch_size  || 100; 	// inner iteration
		
		//netName += '-'+active+'_'+layer_count+'_'+num_neurons+'_'+batch_size;
		// create neural net
		let layer_defs = [];
			layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:3}); // 3 inputs: r,g,b
		for (let x=0; x<layer_count; x++){
			layer_defs.push({type:'fc', num_neurons:num_neurons, activation:active});
		}
		layer_defs.push({type:'regression', num_neurons:3}); // 3 outputs: r,g,b	
		net.makeLayers(layer_defs);		
		let trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.9, batch_size:batch_size, l2_decay:0.0});
		trainer.netName = 'cNet-'+active+'_'+layer_count+'_'+num_neurons+'_'+batch_size;
		return trainer;
	}

	function trainNet(trainer,zeroData,valINPUT,netConfig){
		// TRAINING
		if (netConfig.debug) console.time("TRAINING-time");
		let loss = 0;
		for (let iters=0;iters<trainer.batch_size;iters++) {
				let lossi = 0;
				loss = 0;
				for(let i=0;i<netConfig.iterations;++i) {
					zeroData.forEach(function(ret){
						valINPUT.w[0] = ret.in[0];
						valINPUT.w[1] = ret.in[1];
						valINPUT.w[2] = ret.in[2];
						let stats = trainer.train(valINPUT,ret.out);
						loss += stats.loss;
						lossi += 1;
					});
				}	
				loss /= lossi;
				if (netConfig.debug) console.log(iters,'loss=',loss);
		}
		if (netConfig.debug) console.timeEnd("TRAINING-time");
		return loss;
	}
		
		
function predictionNET(net,dataDATA,valINPUT,config){
		valINPUT.w[0] = dataDATA.in[0];
		valINPUT.w[1] = dataDATA.in[1];
		valINPUT.w[2] = dataDATA.in[2];
		let pre = net.forward(valINPUT);
		let arrout = arrOneToByte(pre.w);
		//if (config.debug) console.log(dataDATA, arrout);
	return arrout;
}		

	function help(short){
		if (short) {
			console.log('EXAMPLE: node index.js l=3 n=9 i=1000 model=cNet d=true');
		}else {
		console.log('-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-');
		console.log('node index.js l=3 n=9 i=1000 model=cNet');
		console.log('l= layers');
		console.log('n= neurons');
		console.log('i= iterations');
		console.log('m= model name');
		console.log('d= debug false|true');
		console.log('-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-');
		}
		
	}
	
	
module.exports = {
    getArgs: getArgs,
	readJsonData: readJsonData,
	compileNewNet:compileNewNet,
    readJsonModel: readJsonModel,
	readModelsFromFiles:readModelsFromFiles,
	saveModelsToFiles:saveModelsToFiles,
	arrOneToByte:arrOneToByte,
	trainNet:trainNet,
	predictionNET:predictionNET,
	help:help
  
};



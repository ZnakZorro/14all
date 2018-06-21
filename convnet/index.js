#!/usr/local/bin/node
"use strict";
var fs = require('fs');
const convnetjs = require("./js/convnet");


//process.argv.forEach(function (val, index, array) {	console.log(index + ': ' + val);});
let args = process.argv.slice(2) || [];
	console.log('args=',args);
	
function getArgs(args,name,def=null){
	let out = def;
	args.forEach(function(el){
		let arr = el.split('=');
		if (arr[0]===name) {out= arr[1];}
	});
	return out;	
}

let hiddenLayers = getArgs(args,'l',3);
	console.log('hiddenLayers=',hiddenLayers);

let neurons = getArgs(args,'n',9);
	console.log('neurons=',neurons);

let iteration = getArgs(args,'i',100);
	console.log('iteration=',iteration);

let jsonmodel = getArgs(args,'model',null);
	console.log('jsonmodel=',jsonmodel);



	let trainer = null;
	let net     = null;
	let netName = 'cNet';

	function makeNewNet(layer_count,num_neurons,active,batch_size){
		layer_count  = layer_count || 3;
		num_neurons  = num_neurons || 9;
		active       = active      || 'relu';
		batch_size   = batch_size  || 100; 	// inner iteration
		
		
		netName += '-'+active+'_'+layer_count+'_'+num_neurons+'_'+batch_size;
		
		// create neural net
		let layer_defs = [];
			layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:3}); // 3 inputs: r,g,b
		
		for (let x=0; x<layer_count; x++){
			layer_defs.push({type:'fc', num_neurons:num_neurons, activation:active});
		}
			layer_defs.push({type:'regression', num_neurons:3}); // 3 outputs: r,g,b
			
		net = new convnetjs.Net();
		net.makeLayers(layer_defs);
		
		trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.9, batch_size:batch_size, l2_decay:0.0});
		
	}
	console.log('\n... models on Json......');
	fs.readdirSync(__dirname+'/models/').forEach(file => {
		console.log('\t\tModelSync= '+file);
	});
			/*
			fs.readdir(__dirname+'/models/', (err, files) => {
				files.forEach(file => {
					console.log('ModelAsync= '+file);
				});
			});
			*/	
	console.log('... models on Json......\n');

//qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
		  //makeNewNet(layer_count,num_neurons,active,batch_size)
	let t = makeNewNet(hiddenLayers,neurons,'relu',iteration); //sigmoid,tanh,relu,maxout
//qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
	
	//console.log(net)
	//console.log(trainer)
	
let batches_per_iteration = 20;
let valin = new convnetjs.Vol(1,1,3); //1x1x3
let arr =[];


let zeroData=[];
let netData =
[{
	"in":  [255, 0, 0],	//red to green
	"out": [0, 255, 0]
}, {
	"in":  [0, 255, 0],
	"out": [0, 0, 255]
}, {
	"in":  [0, 0, 255],
	"out": [255, 0, 0]
}, {
	"in":  [255, 255, 0],
	"out": [0, 255, 255]
}, {
	"in":  [0, 255, 255],
	"out": [255, 255,0]
}, {
	"in":  [255, 0, 255],
	"out": [0, 255, 255]
}];

//console.log(netData)
netData.forEach(function(ret,x){
	zeroData.push({"in":[ret.in[0]/255, ret.in[1]/255, ret.in[2]/255],"out":[ret.out[0]/255, ret.out[1]/255, ret.out[2]/255]});
	//console.log(ret.in,ret.out)
});
console.log(netData);
console.log('------------------------');
console.log(zeroData);
console.log('========================');




// TRAINING
console.time("TRAINING");
let loss = 0;
for (let iters=0;iters<trainer.batch_size;iters++) {
		let lossi = 0;
		loss = 0;
		for(let i=0;i<batches_per_iteration;++i) {
			
			zeroData.forEach(function(ret){
				valin.w[0] = ret.in[0];
				valin.w[1] = ret.in[1];
				valin.w[2] = ret.in[2];
				let stats = trainer.train(valin,ret.out);
				loss += stats.loss;
				lossi += 1;
			});
			
		}	
		loss /= lossi;
		console.log(iters,'loss=',loss)
	
}

	
	console.log('-----------------------------------------')
	console.log('Actual model = '+netName);
	console.log('LOSS=',loss)
	console.timeEnd("TRAINING");
	console.log('-----------------------------------------')
	
	
	
					// save to JSON
					var json = net.toJSON();
					var jsonstr = JSON.stringify(json);
					//console.log(__dirname, 'netName='+netName+'.json');
					//console.log(jsonstr);
					
					fs.writeFile(__dirname+'/models/'+netName+'.json', jsonstr, (err) => {  
						if (err) throw err;
						console.log('Saved model = '+netName);
					});	
					
					// load from json
					//var json = JSON.parse(str); // creates json object out of a string
					//var net2 = new convnetjs.Net(); // create an empty network
					//net2.fromJSON(json); //	


			
function inRange(x) {
	x = (x*255);
    if (x < 0) return 0;
	else if (x>255) return 255;
	else return x;
}
function arrinRange(arr) {
	//console.log(arr);
	return arr.map(function(x){return Math.floor(inRange(x))});
}



console.time("PREDICT");

zeroData.forEach(function(ret,i){
	valin.w[0] = ret.in[0];
	valin.w[1] = ret.in[1];
	valin.w[2] = ret.in[2];
	let pre = net.forward(valin);
	let arrout = arrinRange(pre.w);
	//let arrout = [arr[0], arr[1], arr[2]];
	console.log(i,netData[i].in, netData[i].out, arrout);
})
console.timeEnd("PREDICT");
console.log('------------------------------------------\n')











/*

https://cs.stanford.edu/people/karpathy/convnetjs/docs.html

DOCUMENTATION

{type:'fc', num_neurons:10, activation:'sigmoid'} // x->1/(1+e^(-x))
{type:'fc', num_neurons:10, activation:'tanh'} // x->tanh(x)
{type:'fc', num_neurons:10, activation:'relu'} // rectified linear units: x->max(0,x)
{type:'fc', num_neurons:10, activation:'maxout'} // rectified linear units: x->max(0,x)


// create a Vol of size 32x32x3, and filled with random numbers
let v = new convnetjs.Vol(32, 32, 3);
let v = new convnetjs.Vol(32, 32, 3, 0.0); // same volume but init with zeros
let v = new convnetjs.Vol(1, 1, 3); // a 1x1x3 Vol with random numbers
 
// you can also initialize with a specific list. E.g. create a 1x1x3 Vol:
let v = new convnetjs.Vol([1.2, 3.5, 3.6]);
 
// the Vol is a wrapper around two lists: .w and .dw, which both have 
// sx * sy * depth number of elements. E.g:
v.w[0] // contains 1.2
v.dw[0] // contains 0, because gradients are initialized with zeros
 
// you can also access the 3-D Vols with getters and setters
// but these are subject to function call overhead
let vol3d = new convnetjs.Vol(10, 10, 5);
vol3d.set(2,0,1,5.0); // set coordinate (2,0,1) to 5.0
vol3d.get(2,0,1) // returns 5.0
        switch(def.type) {
          case 'fc': this.layers.push(new global.FullyConnLayer(def)); break;
          case 'lrn': this.layers.push(new global.LocalResponseNormalizationLayer(def)); break;
          case 'dropout': this.layers.push(new global.DropoutLayer(def)); break;
          case 'input': this.layers.push(new global.InputLayer(def)); break;
          case 'softmax': this.layers.push(new global.SoftmaxLayer(def)); break;
          case 'regression': this.layers.push(new global.RegressionLayer(def)); break;
          case 'conv': this.layers.push(new global.ConvLayer(def)); break;
          case 'pool': this.layers.push(new global.PoolLayer(def)); break;
          case 'relu': this.layers.push(new global.ReluLayer(def)); break;
          case 'sigmoid': this.layers.push(new global.SigmoidLayer(def)); break;
          case 'tanh': this.layers.push(new global.TanhLayer(def)); break;
          case 'maxout': this.layers.push(new global.MaxoutLayer(def)); break;
          case 'quadtransform': this.layers.push(new global.QuadTransformLayer(def)); break;
          case 'svm': this.layers.push(new global.SVMLayer(def)); break;
          default: console.log('ERROR: UNRECOGNIZED LAYER TYPE!');
        }
*/

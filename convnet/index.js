	const convnetjs = require("./js/convnet");

	let trainer = null;
	let net     = null;

	function makeNewNet(layer_count,num_neurons,active,batch_size){
		batch_size   = batch_size  || 5
		layer_count  = layer_count || 7;
		num_neurons  = num_neurons || 20;
		active       = active      || 'relu';
		// create neural net
		var layer_defs = [];
		layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:2}); // 2 inputs: x, y \n\
		
		for (var x=0; x<layer_count; x++){
			layer_defs.push({type:'fc', num_neurons:num_neurons, activation:active});
		}
		layer_defs.push({type:'regression', num_neurons:3}); // 3 outputs: r,g,b
		net = new convnetjs.Net();
		net.makeLayers(layer_defs);
		
		trainer = new convnetjs.SGDTrainer(net, {learning_rate:0.01, momentum:0.9, batch_size:batch_size, l2_decay:0.0});
		
	}

	var t = makeNewNet(3,3,'relu');
	
	//console.log(net)
	//console.log(trainer)
	
let batches_per_iteration = 20;
let valin = new convnetjs.Vol(1,1,3); //1x1x3
let arr =[];

  var loss = 0;
  var lossi = 0;
 
for (var iters=0;iters<trainer.batch_size;iters++) {
		for(var i=0;i<batches_per_iteration;i++) {
			valin.w[0] = Math.random();
			valin.w[1] = Math.random();
			valin.w[2] = Math.random();
			arr[0]     = Math.random();
			arr[1]     = Math.random();
			arr[2]     = Math.random();
			var stats = trainer.train(valin, arr);
			loss += stats.loss;
			lossi += 1;
		}
		
		console.log(iters,'loss=',loss/lossi)
}
	loss /= lossi;
	console.log('LOSS=',loss)


for (var iters=0;iters<trainer.batch_size;iters++) {	
	valin.w[0] = Math.random();
	valin.w[1] = Math.random();
	valin.w[2] = Math.random();
	let pre = net.forward(valin);	
	let arrout = [Math.floor(255*pre.w[0]), Math.floor(255*pre.w[1]), Math.floor(255*pre.w[2])]
	console.log(arrout);
}
	
/*
DOCUMENTATION
// create a Vol of size 32x32x3, and filled with random numbers
var v = new convnetjs.Vol(32, 32, 3);
var v = new convnetjs.Vol(32, 32, 3, 0.0); // same volume but init with zeros
var v = new convnetjs.Vol(1, 1, 3); // a 1x1x3 Vol with random numbers
 
// you can also initialize with a specific list. E.g. create a 1x1x3 Vol:
var v = new convnetjs.Vol([1.2, 3.5, 3.6]);
 
// the Vol is a wrapper around two lists: .w and .dw, which both have 
// sx * sy * depth number of elements. E.g:
v.w[0] // contains 1.2
v.dw[0] // contains 0, because gradients are initialized with zeros
 
// you can also access the 3-D Vols with getters and setters
// but these are subject to function call overhead
var vol3d = new convnetjs.Vol(10, 10, 5);
vol3d.set(2,0,1,5.0); // set coordinate (2,0,1) to 5.0
vol3d.get(2,0,1) // returns 5.0

*/

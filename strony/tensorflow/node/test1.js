#!/usr/local/bin/node
"use strict";

//import * as tf from '@tensorflow/tfjs';	// ????????????????????????
const tf  = require("@tensorflow/tfjs");

let dataTrain =[
	[[0,0,0],		[0,0,0]],
	[[1,1,1],		[1,1,1]],
	
	[[0.3,0.3,0.3],	[0.3,0.3,0.3]],
	[[0.5,0.5,0.5],	[0.5,0.5,0.5]],
	[[0.8,0.8,0.8],	[0.8,0.8,0.8]],
	
	[[1,1,0],		[1,1,0]],	// yellow
	[[0.8,0.8,0],	[0.8,0.8,0]],	// yellow light
	[[0.5,0.5,0],	[0.5,0.5,0]],	// yellow dark
	[[1,0.8,0],		[1,0.8,0]],	// gold
	[[1,0.5,0],		[1,0.5,0]],	// dark gold
	
	
	[[1,0,0],		[1,0,0]],	// red
	[[0.8,0,0],		[0.8,0,0]],	// red light
	[[0.5,0,0],		[0.5,0,0]],	// red dark

	[[0,1,0],		[0.6,0.6,0.6]],	// green
	[[0.5,1,0.5],	[0.7,0.7,0.7]],	// lightgreen
	[[0,0.5,0],		[0.35,0.35,0.35]],	// darkgreen
	
	[[0,0,1],		[0.4,0.4,0.4]],	// blue
	[[0.5,0.5,1],	[0.5,0.5,0.5]],	// light blue
	[[0,0,0.5],		[0.25,0.25,0.25]],	// dark blue
	
	[[0,1,1],		[0.8,0.8,0.8]],
	[[1,0,1],		[0.7,0.7,0.7]]
	
	
];

let trainData  = [];
let targetData = [];

	dataTrain.forEach(function(dt,ix){
			function norm2rgb(norm){
				return [Math.round(norm[0]*255),Math.round(norm[1]*255),Math.round(norm[2]*255)];
			}		
			trainData.push(norm2rgb(dt[0]));
			targetData.push(norm2rgb(dt[1]));
			console.log('#49 trainData=',trainData);
			console.log('#50 targetData=',targetData);
		});




	async function modelRUN(epochs,iters,minLoss) {
		// Define a model for linear regression.
		const model = tf.sequential();
		//model.add(tf.layers.dense({units: 1, inputShape: [1]}));
		model.add(tf.layers.dense({units: 3, activation: 'sigmoid',inputShape: [3]}));
		model.add(tf.layers.dense({units: 12, activation: 'sigmoid',inputShape: [3]}));
		model.add(tf.layers.dense({units: 3, activation: 'sigmoid',inputShape: [3]}));

		// Prepare the model for training: Specify the loss and the optimizer.
		model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

		// Generate some synthetic data for training.
		const training_data = tf.tensor2d(trainData);
		const target_data   = tf.tensor2d(targetData);


		for (let i = 0; i < iters ; ++i) {
			console.log('#73===============================');
			console.log('#74=',i+'/'+iters);
			//var h = await model.fit(training_data, target_data, {epochs: epochs});
			// Train the model using the data.
			let h = await model.fit(training_data, target_data).then(() => {
				// Use the model to do inference on a data point the model hasn't seen before:
				model.predict(tf.tensor2d([[0,0,0]])).print();
				model.predict(tf.tensor2d([[128,128,128]])).print();
				/*
					let wyliczony = model.predict(tf.tensor2d([[0,0,0],[32,32,32], [128,128,128],[255,255,255]]));
					let val = wyliczony.buffer().values;
					console.log('val=',val);
					val.forEach(function(v){
						let red = Math.round(v*255);
						console.log(red,'v=',v);
					});
				*/
				console.log('.........................\n\n');
			});
			//console.log(i+'/'+iters+' loss:'+h.history.loss[0],' M=', Math.round(tf.memory().numBytes/1)+' B', 'Ts:'+tf.memory().numTensors);
		}
	}
	
	let epochs  = 30;
	let iters   = 4;
	let minLoss = 0.0001;
	modelRUN(epochs,iters,minLoss);
	
	

#!/usr/local/bin/node
"use strict";

//import * as tf from '@tensorflow/tfjs';	// ????????????????????????
const tf  = require("@tensorflow/tfjs");
const model = tf.sequential();

let trainData  = [];
let targetData = [];


let jsonName = "";
jsonName = "DataTrain_255.json";
jsonName = "DataTrain_01.json";

let dataTrain = require('/home/pi/app/tensorflow/jsons/'+jsonName);

	function norm2rgb(norm){return [Math.round(norm[0]*255),Math.round(norm[1]*255),Math.round(norm[2]*255)];}		
/*
var fs = require('fs');
fs.readFile('/path/to/file.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var obj = JSON.parse(data);
});
*/

	console.log(dataTrain);	
	dataTrain.forEach(function(dt){
			trainData.push(dt[0]);
			targetData.push(dt[1]);
		});
	
	
	function predykcja(rgb01,txt){
		let wyliczony = model.predict(tf.tensor2d([rgb01]));
		let buff = wyliczony.buffer().values;
		console.log(txt+':  ............................');
		console.log('rgb01=',rgb01);
		console.log('buff=',buff);
		buff.forEach(function(v){
			let testowy = Math.round(v*255);
			console.log(testowy,"v=",v);//,'norm=',norm2rgb(v));
		});		
	}

	async function modelRUN(epochs,iters,minLoss) {
		// Define a model for linear regression.
		
		//model.add(tf.layers.dense({units: 1, inputShape: [1]}));
		model.add(tf.layers.dense({units: 3, activation: 'sigmoid',inputShape: [3]}));
		model.add(tf.layers.dense({units: 12, activation: 'sigmoid',inputShape: [3]}));
		model.add(tf.layers.dense({units: 3, activation: 'sigmoid',inputShape: [3]}));

		// Prepare the model for training: Specify the loss and the optimizer.
		model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

		// Generate some synthetic data for training.
		const training_data = tf.tensor2d(trainData);
		const target_data   = tf.tensor2d(targetData);


		for (let i = 1; i <= iters ; ++i) {
			console.log('#45 @'+i+'/'+iters+' ===============================');
			//var h = await model.fit(training_data, target_data, {epochs: epochs});
			// Train the model using the data.
			let h = await model.fit(training_data, target_data).then((h) => {
					console.log('#50=',i+'/'+iters+' loss:'+h.history.loss[0],' M=', Math.round(tf.memory().numBytes/1)+'bajt', 'Ts:'+tf.memory().numTensors);
					predykcja([0,0,0],'czarny');
					predykcja([1,0,0],'czerwony');
					predykcja([0,1,0],'zielony');
					predykcja([0,0,1],'niebieski');
				
				console.log('.........................\n\n');
			});
			//console.log(i+'/'+iters+' loss:'+h.history.loss[0],' M=', Math.round(tf.memory().numBytes/1)+' B', 'Ts:'+tf.memory().numTensors);
		}
	}
	
	let epochs  = 30;
	let iters   = 200;
	let minLoss = 0.0001;
	modelRUN(epochs,iters,minLoss);
	
	

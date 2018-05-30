#!/usr/local/bin/node
"use strict";

//import * as tf from '@tensorflow/tfjs';	// ????????????????????????
const tf  = require("@tensorflow/tfjs");

  // Define a model for linear regression.
  const model = tf.sequential();
  //model.add(tf.layers.dense({units: 1, inputShape: [1]}));
	model.add(tf.layers.dense({units: 3, activation: 'sigmoid',inputShape: [3]}));
	model.add(tf.layers.dense({units: 12, activation: 'sigmoid',inputShape: [3]}));
	model.add(tf.layers.dense({units: 3, activation: 'sigmoid',inputShape: [3]}));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([[0,0,0],[128,128,128], [255, 255, 255]]);
  const ys = tf.tensor2d([[0,0,0],[128,128,128], [255, 255, 255]]);

  // Train the model using the data.
  model.fit(xs, ys).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    model.predict(tf.tensor2d([[0,0,0]])).print();
    model.predict(tf.tensor2d([[128,128,128]])).print();
	
		let wyliczony = model.predict(tf.tensor2d([[0,0,0],[32,32,32], [128,128,128],[255,255,255]]));
		let val = wyliczony.buffer().values;
		console.log('val=',val);
		val.forEach(function(v){
			let red = Math.round(v*255);
			console.log(red,'v=',v);
		});
	
  });

#!/usr/local/bin/node
"use strict";
let DS      = '/';
let moddir      = '/usr/local/lib/node_modules/';
const RPI = __dirname.indexOf('pi')>0 ? true:false;
if (!RPI) moddir = 'C:/Users/U1/AppData/Roaming/npm/node_modules/';
const express = require(moddir+'express');
const path = require('path');
const app = express();



const fs = require('fs');
const convnetjs = require("./js/convnet");


const getArgs = require('cnetlib').getArgs;
const readJsonData = require('cnetlib').readJsonData;
const readJsonModel = require('cnetlib').readJsonModel;
const readModelsFromFiles = require('cnetlib').readModelsFromFiles;
const saveModelsToFiles = require('cnetlib').saveModelsToFiles;
const compileNewNet = require('cnetlib').compileNewNet;
const help = require('cnetlib').help;
const arrOneToByte = require('cnetlib').arrOneToByte;
const trainNet = require('cnetlib').trainNet;
const predictionNET = require('cnetlib').predictionNET;


	let net     = new convnetjs.Net();
	let valINPUT = new convnetjs.Vol(1,1,3); //1x1x3

	let trainer = null;
	let netName = 'cNet-1';

	let hiddenLayers = getArgs('l',3);		    
	let neurons      = getArgs('n',9);			
	let iterations   = getArgs('i',100);		
	let jsonmodel    = getArgs('model',null);	
	let debug        = getArgs('d',false);	    
	
let netConfig = {
	input:[3,3],
	output:[3,3],
	hiddenLayers:hiddenLayers,
	neurons:neurons,
	iterations:iterations,
	jsonmodel:jsonmodel,
	netName:netName,
	debug:debug
}
	help(true);
if (netConfig.debug){
	help();
	console.log(netConfig);
}

	let netData  = readJsonData('netData.json');
	let zeroData = [];
	netData.forEach(function(ret,x){
		zeroData.push({"in":[ret.in[0]/255, ret.in[1]/255, ret.in[2]/255],"out":[ret.out[0]/255, ret.out[1]/255, ret.out[2]/255]});
	});

	if (netConfig.debug){
		console.log('\nnetData==========================\n',netData);
		console.log('\nzeroData=========================\n',zeroData);
	}

//qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
	 trainer = compileNewNet(netConfig,net,hiddenLayers,neurons,'relu',iterations); //sigmoid,tanh,relu,maxout
	 netConfig.netName = trainer.netName;
//qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
	



// TRAINING
	if (netConfig.debug) console.log('\nTRAINING-----------------------------------------');
	let loss = trainNet(trainer,zeroData,valINPUT,netConfig)
	if (netConfig.debug){
		console.log('-----------------------------------------');
		console.log('Actual model = '+netConfig.netName);
		console.log('LOSS=',loss);	
		console.log('-----------------------------------------');
	}
	
// SaveModel
	saveModelsToFiles(net,netConfig.netName+'.json')

// Prediction
	if (netConfig.debug) console.time("PREDICT-time");
	zeroData.forEach(function(ret,i){
		let out = predictionNET(net,ret,valINPUT,netConfig);
		console.log(i,netData[i].in, netData[i].out, out);
	})
	if (netConfig.debug) console.timeEnd("PREDICT-time");	
	

if (netConfig.debug) console.log(netConfig.netName+' ==================koniec---------------------------\n')


//let mody = readModelsFromFiles()
//console.log(mody);
//let moda = readJsonModel('cNet-relu_3_9_1500.json')
//console.log(moda);
//console.log(netConfig)



app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, './index.html'));
});
//app.get('/', (req, res) => res.send('Hello World!'))
//app.get('/mpc/play/*', (req, res) => res.send('MPC play Hello World!'));
app.listen(8099, () => console.log('Example app listening on port 8099!'))
help(true);

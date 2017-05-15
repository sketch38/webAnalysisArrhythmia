var express = require('express');
var csv = require('csvtojson');
var mysql = require('mysql');
var fs = require('fs');
var app = express();
app.use(express.static('analysisweb'));

var pool = mysql.createPool
({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'fileECG'
});
app.get('/filerecord',function(request,response){
	pool.getConnection(function(err, connection) {
  		connection.query('SELECT `name` FROM `record` GROUP BY `name`', function (error, results) { 
    		connection.release();
    		if (error){
    			response.json(error);
    		} 
    		else{
    			response.json(results);
    		}
  		});
	});
});
app.get('/timerecord/:namerecord',function(request,response){
	var record = request.params.namerecord;
	pool.getConnection(function(err, connection) {
  		connection.query("SELECT `name`, `time` FROM `record` WHERE `name` = '" + record +"'", function (error, results) {
    		connection.release();
    		if (error){
    			response.json(error);
    		} 
    		else{
    			response.json(results);
    		}
  		});
	});
});

function asyncWrap(fn) {  
  return (request,response, next) => {
    fn(request,response, next).catch(next);
  };
};
app.get('/demonstratePan/:filename', asyncWrap(async (request,response) =>{
	var file = request.params.filename;
	var csvFilePath= 'analysisweb/file/' + file;
	var arrayfile = [];
	var mlii = [];
	csv({
	    noheader: true
	})
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
		arrayfile =	arrayfile.concat(jsonObj)
	})
	.on('done',(error)=>{
		for(var i = 2; i < arrayfile.length; i++){
	        mlii.push(arrayfile[i].field2);
	    }
	    var lwf = panLowPassFilter(mlii);
	    var hpf = panHighPassFilter(lwf);
	    var diff = panDerivative(hpf);
	    var movingWindow = panMovingwindowand(diff);
	    var diff2 = panRisingSlope(movingWindow);
	    var peak = panthreshold(diff2,'default');
	    peak.shift();
	    var jsonfile = [{
			'original': arrayfile,
			'bandpass': hpf,
			'derivative':diff,
			'movingwindow': movingWindow,
			'risingslope':diff2,
			'threshold': peak
		}];
	    response.json(jsonfile);
	})
}));

app.get('/drawgraph/:filename/:threshold', asyncWrap(async (request,response) =>{
	var threshold = request.params.threshold;
	var file = request.params.filename;
	var csvFilePath= 'analysisweb/file/' + file;
	var jsonfile = [];
	var filetest = [];
	csv({
	    noheader: true
	})
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
		jsonfile =	jsonfile.concat(jsonObj)
	})
	.on('done',(error)=>{
		var result = panAndTompkins(jsonfile,threshold);
		var nowThreshold = result[result.length-1];
		result.shift();
		for(var i=0;i<result.length;i++){
			var test = {
				'time': jsonfile[i+2].field1,
				'value': result[i]
			};
			filetest = filetest.concat(test);
		}
	    console.log('convert file original end');

	    jsonfile =	jsonfile.concat(filetest);
	    jsonfile = jsonfile.concat(nowThreshold);
	    response.json(jsonfile);
	    // response.json(result);

	})
}));
app.get('/compare/:filename', asyncWrap(async (request,response) =>{
	var file = request.params.filename;
	var path = file.split(".");
	var annotation = path[0];
	var annotationfilePath = 'analysisweb/file/'+annotation+'.json'
	fs.readFile(annotationfilePath, (err, data) => {
	  	if (err) console.log(err);
	  	obj = JSON.parse(data);
	  	for(var i = 0; i < obj.length;i++){
	  		if(obj[i].Num !== undefined){
	  			obj.splice(i, 1);
	  		}
	  		if(obj[i].beat === 'x'){
	  			obj.splice(i, 1);
	  		}
	  	}
	  	response.json(obj);
	});
}));

app.listen(4000,function(){
	console.log('listening on 4000 \n')
});

function panAndTompkins(jsonfile,threshold){
	var timeseries = [], mlii = [];
    for(var i = 2; i < jsonfile.length; i++){
        timeseries.push(jsonfile[i].field1);
        mlii.push(jsonfile[i].field2);
    }
    var lwf = panLowPassFilter(mlii);
    var hpf = panHighPassFilter(lwf);
    var diff = panDerivative(hpf);
    var movingWindow = panMovingwindowand(diff);
    var diff2 = panRisingSlope(movingWindow);
    var peak = panthreshold(diff2,threshold);
    return peak;
}
function panLowPassFilter(x){
	var y = [];
	for(var i = 0; i < x.length;i++){
		if(i<12){
			y[i]=0;
		}
		else{
			y[i]= (2*parseFloat(y[i-1]) - parseFloat(y[i-2]) + parseFloat(x[i]) - 2* parseFloat(x[i-6]) + parseFloat(x[i-12])).toFixed(4);
		}
	}
	return y;
}
function panHighPassFilter(x){
	var y = [];
	for(var i = 0; i < x.length;i++){
		if(i<32){
			y[i]=0;
		}
		else{
			y[i]= (32*parseFloat(x[i-16])-(parseFloat(y[i-1])+ parseFloat(x[i])-parseFloat(x[i-32]))).toFixed(4);
		}
	}
	return y;
}
function panDerivative(x){
	var y = [];
	var temp = 0;
	for(var i = 0; i < x.length;i++){
		if(i<2){
			y[i]=0;
		}
		else if(i>=x.length-2){
			y[i] = 0;
		}
		else{
			temp = (1/8)*(parseFloat(-x[i-2])-2*parseFloat(x[i-1])+2*parseFloat(x[i+1])+parseFloat(x[i+2]));
			y[i] = (temp*temp).toFixed(4);
		}
	}
	return y;
}
function panMovingwindowand(x){
	var y = [];
	var N = 100;
	for(var i = 0; i < x.length;i++){
		if(i<N-1){
			y[i] = 0;
		}
		else{
			var sum = sumNumber(x,i,N);
			y[i] = (1/N*sum).toFixed(4);
		}
	}
	return y;
}
function panRisingSlope(x){
	var y = [];
	for(var i = 0; i < x.length;i++){
		if(i>x.length-4){
			y[i] = 0;
		}
		else{
			y[i]= (parseFloat(x[i+3])-parseFloat(x[i])).toFixed(4);
		}
	}
	return y;
}
function panthreshold(x,numThreshold){
	var y = [];
	var maxPeak = Math.max.apply(null, x);
	var noise = averageNumber(x);
	var threshold1 = (1/8)*maxPeak;
	// var y = x;

	if(numThreshold=='default'){
		var threshold2 = (1/2)*threshold1;
	}
	else{
		var threshold2 = numThreshold;
	}
	
	var skipPoint = false;
	var count = 1;
	var sildingWindow = 100;
	console.log('maxPeak: '+maxPeak);
	console.log('threshold: '+threshold1 +'   ' + threshold2);
	for(var k = 0;k<x.length;k++){
		if(parseFloat(x[k])<threshold2){
			x[k] = "0.0000";
		}
	}
	for(var i=0;i<x.length;i++){
		if(!skipPoint){
			for(var j=i+1;j<i+sildingWindow-1;j++){
				if(j>= x.length-1){
					y[i]=0;
					break;
				}
				if(parseFloat(x[i])<=parseFloat(x[j])){
					y[i]=0;
				}
			}
			if(y[i]==undefined){
				y[i] = 1;
				skipPoint = true;
			}
		}
		else{
			y[i] = 0;
			if(count%49==0){
				skipPoint = false;
			}
			count++;
		}
	}
	y.push(threshold2);
	return y;
}




function averageNumber(x){
	var average = 0
	var sum = 0
	for(var i = 0;i<x.length;i++){
		sum += parseFloat(x[i]);
	}
	average = (sum/x.length).toFixed(4);
	return average;
}
function sumNumber(x,n,N){
	var sum=0;
	for(var i = 1; i<N ;i++){
		sum = parseFloat(x[n-(N-i)])+sum;
	}
	return sum;
}
var express = require('express');
var csv = require('csvtojson');
var plotly = require('plotly')("SketchJI", "BdMDIQkQVpnzAZTYRvsS");

var app = express();
app.use(express.static('analysisweb'));

// app.get('/draworiginalgraph',function(request,response){
app.get('/drawgraph/:filename',function(request,response){
	var file = request.params.filename;
	var csvFilePath= 'analysisweb/file/' + file;
	// var csvFilePath= 'analysisweb/file/samples-1minute.csv';
	var jsonfile = [];
	csv({
	    noheader: true
	})
	.fromFile(csvFilePath)
	.on('json',(jsonObj)=>{
		jsonfile =	jsonfile.concat(jsonObj)
	})
	.on('done',(error)=>{
		var result = panAndTompkins(jsonfile);
	    console.log('convert file original end');
	    jsonfile =	jsonfile.concat(result)
	    response.json(jsonfile);
	})
});

app.listen(4000,function(){
	console.log('listening on 4000 \n')
});

function panAndTompkins(jsonfile){
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
    var peak = panthreshold(diff2);
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
function panthreshold(x){
	var y = [];
	var location = [];
	var peak = [];
	var maxPeak = Math.max.apply(null, x);
	var noise = averageNumber(x);

	var threshold1 = (1/8)*maxPeak;
	var threshold2 = (1/2)*threshold1;
	var temp = 0;
	var loc = 0;
	var count = 0;
	var countLoc = 0;

	for(var k = 0;k<x.length;k++){
		if(x[k]<threshold2){
			x[k] = 0;
		}
	}

	for(var i = 0; i < x.length;i+=200){
		temp = parseFloat(x[i]);
		loc = i;
		for (var j=0;j<200;j++){
			if(parseFloat(x[i+j])>temp){
				temp = x[i+j];
				loc = i+j; 
			}
			else{
				continue;
			}
		}
		if(temp === 0){
			continue;
		}
		else{
			y[count] = temp;
			location[count] = loc;
			count++;
		}	
	}
	for(var l = 0;l<x.length;l++){
		if(l === location[countLoc]){
			peak[l] = 1;
			countLoc++;
		}
		else{
			peak[l]= 0;
		}
	}
	return peak;
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
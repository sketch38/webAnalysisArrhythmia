angular.module('app')
  .controller('compareController', function ($rootScope,$scope,$http,$routeParams,$interval) {
  	//stop interval before 
  	$interval.cancel($rootScope.interval);

  	//check play graph 
  	var play = true;
  	$scope.stopGraph = function() {
		if (angular.isDefined(play)) {
			play = undefined;
		}
	};
	$scope.playGraph = function() {
		if (!angular.isDefined(play)) {
			play = true;
		}
	};
	//check loading 
	$scope.loading = true;

	//get data from node in compare function
  	$http({method:'GET',url:'/drawgraph/'+$routeParams.filename})
  		// calling success
		.then(function (success){
			//stop loading page
			$scope.loading = false;

			//create dataset by extract from data which send from nodejs
			var timeseries = [], mlii = [],peak = [],setData = [];
            for(var i = 2; i <= (success.data.length/2); i++){
                timeseries.push(success.data[i].field1);
                mlii.push(success.data[i].field2);
            }
            for(var j = (success.data.length/2)+1;j < success.data.length;j++ ){
                peak.push(success.data[j]);
            }
            $scope.filename = $routeParams.filename;
            var maxPeak = Math.max.apply(null, mlii);
            var minPeak = Math.min.apply(null, mlii);
            // var point = 90;
            // var timeInterval = 250;
            var point = 36;
            var timeInterval = 100;
            var timeShow = 1800;

			var nowCount = 0;
		    var nowIndex = 0;
            var dataX = [];
            var dataY = [];
            var dataLabels = [];

			var updateGraph = function() {
		        if(nowCount<timeShow){
		            for(var j = 0; j<=timeShow;j++){
		                dataX.push(nowCount);
						dataY.push('0');
						if(j/360==1){
							dataLabels.push(" ");
							setData.push(nowCount);	
						}
		                nowCount++;
		            }
		        }
		        else if(nowCount>mlii.length+timeShow && nowCount<mlii.length+(timeShow*2)){
		            for (var k = 0; k < point; k++) {
		                dataX.push(nowCount);
						dataY.push('0');
						if(k/360==1){
							dataLabels.push(" ");
							setData.push(nowCount);	
						}
		                nowCount++;
		            }
		        }
		        else if(nowCount>timeShow && nowCount<mlii.length+timeShow-1){
		            for(var i = 0; i < point; i++) {
		            	dataX.push(nowCount);
						dataY.push(mlii[nowIndex]);
						if(nowCount%360==1){
							dataLabels.push(timeseries[nowIndex]);
							setData.push(nowCount);	
						}
		                nowCount++;
		                nowIndex++; 
		            }
		        }
		        if(dataY.length>=timeShow){
		            for(var i = 0; i < point; i++) {
		                dataY.shift();
		                dataX.shift();
		            }
		            if((nowCount-1)/3600===0){
		            	setData.shift();
		            	dataLabels.shift();
		            }
		        }
		        var data = [{
					type: 'scatter',
					x: dataX,
					y: dataY,
					mode: 'lines',
					line: {
						color: 'rgb(219, 64, 82)',
						width: 1
					}
				}];
				var layout = {
					margin: {
						t: 20,
						b: 30,
						l: 40,
						r: 50
					},
					height: "200",
					xaxis: {
						// color: "#000",
						tickmode: "array",
						ticktext : dataLabels,
						tickvals : setData
					},
					yaxis: {
					    range: [minPeak, maxPeak],
					    autorange: false
					},
				};
		        Plotly.newPlot('chartContainer', data, layout);
		    };

		    var nowCountPan = 0;
		    var nowIndexPan = 0;
            var dataXPan = [];
            var dataYPan = [];

            var updateGraphPan = function() {
		        if(nowCountPan<timeShow){
		            for(var j = 0; j<=timeShow;j++){
		                dataXPan.push(nowCountPan);
						dataYPan.push('0');
		                nowCountPan++;
		            }
		        }
		        else if(nowCountPan>mlii.length+timeShow && nowCountPan<mlii.length+(timeShow*2)){
		            for (var k = 0; k < point; k++) {
		                dataXPan.push(nowCountPan);
						dataYPan.push('0');
		                nowCountPan++;
		            }
		        }
		        else if(nowCountPan>timeShow && nowCountPan<mlii.length+timeShow-1){
		            for(var i = 0; i < point; i++) {
		            	dataXPan.push(nowCountPan);
						dataYPan.push(peak[nowIndexPan]);
		                nowCountPan++;
		                nowIndexPan++; 
		            }
		        }
		        if(dataYPan.length>=timeShow){
		            for(var i = 0; i < point; i++) {
		                dataYPan.shift();
		                dataXPan.shift();
		            }
		        }
		        var layoutPan = {
					margin: {
						t: 10,
						b: 50,
						l: 40,
						r: 50
					},
					height: "150",
					xaxis: {
						tickmode: "array",
						ticktext : dataLabels,
						tickvals : setData
					},
					yaxis: {
					    range: [0,1],
					    autorange: false
					},
				};
		        var dataPan = [{
					type: 'scatter',
					x: dataXPan,
					y: dataYPan,
					mode: 'lines',
					line: {
						color: 'rgb(219, 64, 82)',
						width: 1
					}
				}];
		        Plotly.newPlot('chartPeak', dataPan, layoutPan);
		    };

		    var dataX2 = [];
		    var dataY2 = [];
		    var nowCount2 = 0;
		    var nowIndex2 = 0;
		    var runGraph = 0;
		    var countLabel = 0;
		    var dataLabels2 = [];
		    var setData2 = [];
		    var updateGraph2 = function() {
		        if(nowCount2<timeShow){
		            for(var j = 0; j<timeShow;j++){
		                dataX2.push(nowCount2);
						dataY2.push('0');
						if(j/360==1){
							dataLabels2.push(" ");
							setData2.push(nowCount2);	
						}
		                nowCount2++;
		            }
		        }
		        else if(nowCount2>=mlii.length+timeShow && nowCount2<mlii.length+(timeShow*2) && dataY2.length>=timeShow){
		            if(runGraph === timeShow){
		        		runGraph = 0;
		        		countLabel = 0;
		        	}
		        	else{
		        		for(var i = 0; i < point; i++) {
			            	dataX2[runGraph] = runGraph;
							dataY2[runGraph] = 0;
							if(runGraph%360==0){
								dataLabels2[countLabel] = " ";
								setData2[countLabel] = runGraph;	
								countLabel++;
							}
			                nowCount2++;
			                nowIndex2++;
			                runGraph++; 
			            }
		        	}
		        }
		        else if(nowCount2>=timeShow && nowCount2<mlii.length+timeShow-1 && dataY2.length>=timeShow){
		        	if(runGraph === timeShow){
		        		runGraph = 0;
		        		countLabel = 0;
		        	}
		        	else{
		        		for(var i = 0; i < point; i++) {
			            	dataX2[runGraph] = runGraph;
							dataY2[runGraph] = mlii[nowIndex2];
							if(runGraph%360==0){
								dataLabels2[countLabel] = timeseries[nowIndex2];
								setData2[countLabel] = runGraph;	
								countLabel++;
							}
			                nowCount2++;
			                nowIndex2++;
			                runGraph++; 
			            }
		        	}
		        }
		        else if(nowCount2 === mlii.length+(timeShow*2)){
		        	$interval.cancel($rootScope.interval);
		        }
		        var data2 = [{
					type: 'scatter',
					x: dataX2,
					y: dataY2,
					mode: 'lines',
					line: {
						color: 'rgb(219, 64, 82)',
						width: 1
					}
				}];
				var layout2 = {
					margin: {
						t: 20,
						b: 30,
						l: 40,
						r: 50
					},
					height: "200",
					xaxis: {
						tickmode: "array",
						ticktext : dataLabels2,
						tickvals : setData2
					},
					yaxis: {
					    range: [minPeak, maxPeak],
					    autorange: false
					},
				};
		        Plotly.newPlot('chart2Container', data2, layout2);
		    };



		    // set play-stop Graph
		    $rootScope.interval = $interval(function(){
        		if (angular.isDefined(play)){
		        	if(nowCount <= mlii.length+(timeShow*2)) {
			        	updateGraph();
			        	// updateGraphPan();
			        	updateGraph2();
			        }
        		}
        		else{
        			return;
        		}
        	},timeInterval);

		},function (error){
			console.error('Error', error.status, error.data);
		});
  	})
;

// function countTiming(){
//         var oldDate = new Date();
//         setInterval(function(){
//             var currentDate = new Date();
//             var time = currentDate - oldDate;
//             //console.log(currentDate.getSeconds());
//             $("#timer").html(formDate(time));
//         },1000);
// }
// function formDate(time){
//     var second = parseInt((time-1000)/1000);
//     var hour = 0;
//     var minute = 0;
//     if(second>60){
//         minute = parseInt(second/60);
//         second = second%60;
//         if(minute>60){
//             hour = parseInt(minute/60);
//             minute = minute%60;
//         }
//     }
//     else if(second<0){
//         second = 0;
//     }
//     dateForm = hour + ":" + minute + ":" + second;
//     return dateForm;
// }
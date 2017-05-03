angular.module('app')
  .controller('demonstrateController', function ($rootScope,$scope,$routeParams,$interval,$http) {
  		$interval.cancel($rootScope.interval);
  		$scope.page = false;
  		$http({
	        method: 'GET',
	        url: '/filerecord'
	    }).then(function (response) {
	    	$scope.records = response.data;
	    }, function (response) {
	        console.log(response);
	    });
	    $scope.SelectTime = function(namerecord){
	    	$http({
		        method: 'GET',
		        url: '/timerecord/'+namerecord
		    }).then(function (response) {
		    	$scope.times = response.data;
		    }, function (response) {
		        console.log(response);
		    });
		    $scope.name = namerecord;
	    }
	    //show and hide graph
	    $scope.hide = function(order){
	    	if(order == 'bandpass'){
	    		$scope.b_Graph = false;
	    	}
	    	else if(order == 'derivative'){
	    		$scope.d_Graph = false;
	    	}
	    	else if(order == 'movingwindow'){
	    		$scope.m_Graph = false;
	    	}
	    	else if(order == 'risingslope'){
	    		$scope.r_Graph = false;
	    	}
	    	else{
	    		$scope.t_Graph = false;
	    	}
	    }
	    $scope.checkbox = function(order,value){
	    	if(order == 'bandpass'){
	    		$scope.b_Graph = !value;
	    	}
	    	else if(order == 'derivative'){
	    		$scope.d_Graph = !value;
	    	}
	    	else if(order == 'movingwindow'){
	    		$scope.m_Graph = !value;
	    	}
	    	else if(order == 'risingslope'){
	    		$scope.r_Graph = !value;
	    	}
	    	else{
	    		$scope.t_Graph = !value;
	    	}
	    }

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

	    $scope.Startrun = function(namerecord,timerecord){
	    	$scope.loading = true;
	    	$scope.filename = namerecord+'-'+timerecord+'.csv';
	    	// console.log($scope.filename);
	    	$http({
		        method: 'GET',
		        url: '/demonstratePan/'+$scope.filename
		    }).then(function (response) {
		    	$scope.loading = false;
		    	$scope.page = true;
		    	$scope.data = response.data[0];
		    	var bandpass = $scope.data.bandpass;
		    	var derivative = $scope.data.derivative;
		    	var movingwindow = $scope.data.movingwindow;
	            var	risingslope = $scope.data.risingslope;
	            var	threshold = $scope.data.threshold;
		    	var timeseries = [], mlii = [];
	            for(var i = 2; i < $scope.data.original.length; i++){
	                timeseries.push($scope.data.original[i].field1);
	                mlii.push($scope.data.original[i].field2);
	            }

				var maxPeak = parseFloat(Math.max.apply(null, mlii)) + 0.2;
	            var minPeak = parseFloat(Math.min.apply(null, mlii))-0.2;
	            var maxDerivative = parseFloat(Math.max.apply(null, derivative)) + 0.2;
	            var minDerivative = parseFloat(Math.min.apply(null, derivative)) - 0.2;
	            var maxMovingwindow = parseFloat(Math.max.apply(null, movingwindow)) + 0.2;
	            var minMovingwindow = parseFloat(Math.min.apply(null, movingwindow)) - 0.2;
	            var maxRisingslope = parseFloat(Math.max.apply(null, risingslope)) + 0.2;
	            var minRisingslope = parseFloat(Math.min.apply(null, risingslope)) - 0.2;
	            var maxThreshold = parseFloat(Math.max.apply(null, threshold)) + 0.2;
	            var minThreshold = parseFloat(Math.min.apply(null, threshold)) - 0.2;

	            //show graph
			    var dataX = [],databX = [],datadX = [],datamX = [],datarX = [],datatX = [];
			    var dataY = [],databY = [],datadY = [],datamY = [],datarY = [],datatY = [];
			    var nowCount = 0;
			    var nowIndex = 0;
			    var runGraph = 0;
			    var countLabel = 0;
			    var dataLabels = [];
			    var setData = [];

			    var point = 36;
	            var timeInterval = 100;
	            var timeShow = 1800;
			    var updateGraph = function() {
			        if(nowCount<timeShow){
			            for(var j = 0; j<timeShow;j++){
			                dataX.push(nowCount);
			                databX.push(nowCount);
			                datadX.push(nowCount);
			                datamX.push(nowCount);
			                datarX.push(nowCount);
			                datatX.push(nowCount);
							dataY.push('0');
							databY.push('0');
							datadY.push('0');
							datamY.push('0');
							datarY.push('0');
							datatY.push('0');
							if(j/360==1){
								dataLabels.push(" ");
								setData.push(nowCount);	
							}
			                nowCount++;
			            }
			        }
			        else if(nowCount>=mlii.length+timeShow && nowCount<mlii.length+(timeShow*2) && dataY.length>=timeShow){
			            if(runGraph === timeShow){
			        		runGraph = 0;
			        		countLabel = 0;
			        	}
			        	else{
			        		for(var i = 0; i < point; i++) {
				            	dataX[runGraph] = runGraph;
				                databX[runGraph] = runGraph;
				                datadX[runGraph] = runGraph;
				                datamX[runGraph] = runGraph;
				                datarX[runGraph] = runGraph;
				                datatX[runGraph] = runGraph;
				                dataY[runGraph] = 0;
								databY[runGraph] = 0;
								datadY[runGraph] = 0;
								datamY[runGraph] = 0;
								datarY[runGraph] = 0;
								datatY[runGraph] = 0;
								if(runGraph%360==0){
									dataLabels[countLabel] = " ";
									setData[countLabel] = runGraph;	
									countLabel++;
								}
				                nowCount++;
				                nowIndex++;
				                runGraph++; 
				            }
			        	}
			        }
			        else if(nowCount>=timeShow && nowCount<mlii.length+timeShow-1 && dataY.length>=timeShow){
			        	if(runGraph === timeShow){
			        		runGraph = 0;
			        		countLabel = 0;
			        	}
			        	else{
			        		for(var i = 0; i < point; i++) {
				            	dataX[runGraph] = runGraph;
								dataY[runGraph] = mlii[nowIndex];

								databX[runGraph] = runGraph;
								databY[runGraph] = bandpass[nowIndex];

				                datadX[runGraph] = runGraph;
				                datadY[runGraph] = derivative[nowIndex];

				                datamX[runGraph] = runGraph;
				                datamY[runGraph] = movingwindow[nowIndex];

				                datarX[runGraph] = runGraph;
				                datarY[runGraph] = risingslope[nowIndex];

				                datatX[runGraph] = runGraph;
								datatY[runGraph] = threshold[nowIndex];

								if(runGraph%360==0){
									dataLabels[countLabel] = timeseries[nowIndex];
									setData[countLabel] = runGraph;	
									countLabel++;
								}
				                nowCount++;
				                nowIndex++;
				                runGraph++; 
				            }
			        	}
			        }
			        else if(nowCount === mlii.length+(timeShow*2)){
			        	$interval.cancel($rootScope.interval);
			        }
			        var dataOriginal = [{
						type: 'scatter',
						x: dataX,
						y: dataY,
						mode: 'lines',
						line: {
							color: '#56e6bb',
							width: 1.2,
							smoothing:1.3
						}
					}];
					var dataBandpass = [{
						type: 'scatter',
						x: databX,
						y: databY,
						mode: 'lines',
						line: {
							color: '#56e6bb',
							width: 1.2,
							smoothing:1.3
						}
					}];
					var dataDerivative = [{
						type: 'scatter',
						x: datadX,
						y: datadY,
						mode: 'lines',
						line: {
							color: '#56e6bb',
							width: 1.2,
							smoothing:1.3
						}
					}];
					var dataMovingwindow = [{
						type: 'scatter',
						x: datamX,
						y: datamY,
						mode: 'lines',
						line: {
							color: '#56e6bb',
							width: 1.2,
							smoothing:1.3
						}
					}];
					var dataRisingslope = [{
						type: 'scatter',
						x: datarX,
						y: datarY,
						mode: 'lines',
						line: {
							color: '#56e6bb',
							width: 1.2,
							smoothing:1.3
						}
					}];
					var dataThreshold = [{
						type: 'scatter',
						x: datatX,
						y: datatY,
						mode: 'lines',
						line: {
							color: '#56e6bb',
							width: 1.2,
							smoothing:1.3
						}
					}];
					var layout = {
						margin: {
							t: 10,
							b: 30,
							l: 40,
							r: 50
						},
						height: "200",
						plot_bgcolor:'#263238',
						xaxis: {
							tickmode: "array",
							ticktext : dataLabels,
							tickvals : setData
						},
						yaxis: {
						    range: [minPeak, maxPeak],
						}
					};
					var layoutD = {
						margin: {
							t: 10,
							b: 30,
							l: 40,
							r: 50
						},
						height: "200",
						plot_bgcolor:'#263238',
						xaxis: {
							tickmode: "array",
							ticktext : dataLabels,
							tickvals : setData
						},
						yaxis: {
						    range: [minDerivative,maxDerivative],
						}
					};
					var layoutM = {
						margin: {
							t: 10,
							b: 30,
							l: 40,
							r: 50
						},
						height: "200",
						plot_bgcolor:'#263238',
						xaxis: {
							tickmode: "array",
							ticktext : dataLabels,
							tickvals : setData
						},
						yaxis: {
						    range: [minMovingwindow,maxMovingwindow],
						}
					};
					var layoutT = {
						margin: {
							t: 10,
							b: 30,
							l: 40,
							r: 50
						},
						height: "200",
						plot_bgcolor:'#263238',
						xaxis: {
							tickmode: "array",
							ticktext : dataLabels,
							tickvals : setData
						},
						yaxis: {
						    range: [minThreshold,maxThreshold],
						}
					};
					var layout2 = {
						margin: {
							t: 10,
							b: 30,
							l: 40,
							r: 50
						},
						height: "200",
						plot_bgcolor:'#263238',
						xaxis: {
							tickmode: "array",
							ticktext : dataLabels,
							tickvals : setData
						},
						yaxis: {
						     autorange: true
						}
					};
			        Plotly.newPlot('originalChart', dataOriginal, layout);
			        Plotly.newPlot('bandpassChart', dataBandpass, layout2);
			        Plotly.newPlot('derivativeChart', dataDerivative, layoutD);
			        Plotly.newPlot('movingwindowChart', dataMovingwindow, layoutM);
			        Plotly.newPlot('risingslopeChart', dataRisingslope, layout2);
			        Plotly.newPlot('thresholdChart', dataThreshold, layout2);
			    };
			    // set play-stop Graph
			    $rootScope.interval = $interval(function(){
	        		if (angular.isDefined(play)){
			        	if(nowCount <= mlii.length+(timeShow*2)) {
				        	updateGraph();
				        }
	        		}
	        		else{
	        			return;
	        		}
	        	},timeInterval);

		    }, function (response) {
		        console.log(response);
		    });
	    }

	    
		
});
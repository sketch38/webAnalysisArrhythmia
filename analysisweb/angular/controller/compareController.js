angular.module('app')
  	.controller('compareController', function ($rootScope,$scope,$http,$routeParams,$interval) {
	  	//stop interval before 
	  	$interval.cancel($rootScope.interval);

	  	//get interface data
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
	  	$http({
	  		method:'GET',
	  		url:'/drawgraph/'+$routeParams.filename
	  	}).then(function (success){
				//stop loading page
				$scope.loading = false;

				//create dataset by extract from data which send from nodejs
				var timeseries = [], mlii = [],peak = [],setData = [],checkPeak =[];
	            for(var i = 2; i <= (success.data.length/2); i++){
	                timeseries.push(success.data[i].field1);
	                mlii.push(success.data[i].field2);
	            }
	            for(var j = (success.data.length/2)+1;j < success.data.length;j++ ){
	                peak.push(success.data[j].value);
	                if(success.data[j].value!=0){
						checkPeak = checkPeak.concat(success.data[j]);
					}
	            }
	            $scope.checkAccuracys = checkPeak;

	            var tempArray = [];
	            var sum = 0;
	            var temp = 0;
	            var findHeartratePan = function(arrayPeak,newPeak){
	            	if(arrayPeak.length == 0){
	            		temp = timestringTotimemilisec(timeseries[newPeak]);
	            		arrayPeak.push(temp);
	            	}
	            	else{
	            		if(newPeak != 0){
	            			arrayPeak.push(parseInt(timestringTotimemilisec(timeseries[newPeak]))-parseInt(temp));
	            			temp = timestringTotimemilisec(timeseries[newPeak]);
	            		}
	            	}
	            	if(arrayPeak.length == 1){
	            		$scope.heartratePan = 0;
						$scope.sinus = '---';
						$scope.sinusNormal = true;
	            	}
	            	else{
	            		if(arrayPeak.length >= 8){
	            			arrayPeak.shift();
	            		}
	            		if(newPeak == 0){
	            			arrayPeak.shift();	
	            		}
						var sum = arrayPeak.reduce(function (a, b) {
  							return a + b;
						}, 0);
	            		$scope.heartratePan = parseInt(60000/(sum/arrayPeak.length));
	            		if($scope.heartratePan<60){
							$scope.sinus = 'SINUS BRADYCARDIA';
							$scope.sinusNormal = false;
						}
						else if($scope.heartratePan>100){
							$scope.sinus = 'SINUS TACHYCARDIA';
							$scope.sinusNormal = false;
						}
						else{
							$scope.sinus = 'NORMAL SINUS RHYTHM';
							$scope.sinusNormal = true;
						}
	            	}
				};
	   //          var findHeartratePan = function(oldPeak,newPeak){
				// 	if(oldPeak === 0){
				// 		$scope.heartratePan = 0;
				// 		$scope.sinus = '---';
				// 		$scope.sinusNormal = true;
				// 	}
				// 	else{
				// 		$scope.heartratePan = parseInt(60000/(timestringTotimemilisec(timeseries[newPeak])-timestringTotimemilisec(timeseries[oldPeak])));
				// 		if($scope.heartratePan<60){
				// 			$scope.sinus = 'SINUS BRADYCARDIA';
				// 			$scope.sinusNormal = false;
				// 		}
				// 		else if($scope.heartratePan>100){
				// 			$scope.sinus = 'SINUS TACHYCARDIA';
				// 			$scope.sinusNormal = false;
				// 		}
				// 		else{
				// 			$scope.sinus = 'NORMAL SINUS RHYTHM';
				// 			$scope.sinusNormal = true;
				// 		}
				// 	}
				// };
				
	            //show filename and time
	            var stringname = $routeParams.filename.split("-");
	            $scope.filename = stringname[0];
	            var stringtime = stringname[1].split(".");
	            $scope.recordtime = stringtime[0];

	            //for create max min y in original graph
	            var maxPeak = parseFloat(Math.max.apply(null, mlii)) + 0.2;
	            var minPeak = parseFloat(Math.min.apply(null, mlii))-0.2;


	            var point = 36;
	            var timeInterval = 100;
	            var timeShow = 1800;

			    //show orginal graph
			    var dataX = [];
			    var dataY = [];
			    var nowCount = 0;
			    var nowIndex = 0;
			    var runGraph = 0;
			    var countLabel = 0;
			    var dataLabels = [];
			    var setData = [];
			    var updateGraph = function() {
			        if(nowCount<timeShow){
			            for(var j = 0; j<timeShow;j++){
			                dataX.push(nowCount);
							dataY.push('0');
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
								dataY[runGraph] = 0;
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
			        var data = [{
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
						    // range: [minPeak, maxPeak],
						    range: [-2.5, 2],
						    autorange: false
						},
					};
			        Plotly.newPlot('chartContainer', data, layout);
			    };

			    // pan peak graph
			    var nowCountPan = 0;
				var nowIndexPan = 0;
				var dataXPan = [];
				var dataYPan = [];
				var runGraphPan = 0;
				// var tempPeak = 0;

				var updateGraphPan = function() {
				    if(nowCountPan<timeShow){
				        for(var j = 0; j<timeShow;j++){
				            dataXPan.push(nowCountPan);
							dataYPan.push('0');
				            nowCountPan++;
				        }
				    }
				    else if(nowCountPan>=mlii.length+timeShow && nowCountPan<mlii.length+(timeShow*2) && dataYPan.length>=timeShow){
			            if(runGraphPan === timeShow){
			        		runGraphPan = 0;
			        	}
			        	else{
			        		for(var i = 0; i < point; i++) {
				            	dataXPan[runGraphPan] = runGraphPan;
								dataYPan[runGraphPan] = 0;
								findHeartratePan(tempArray,0);
				                nowCountPan++;
				                nowIndexPan++;
				                runGraphPan++; 
				            }
			        	}
			        }
			        else if(nowCountPan>=timeShow && nowCountPan<mlii.length+timeShow-1 && dataYPan.length>=timeShow){
			        	if(runGraphPan === timeShow){
			        		runGraphPan = 0;
			        	}
			        	else{
			        		for(var i = 0; i < point; i++) {
				            	dataXPan[runGraphPan] = runGraphPan;
								dataYPan[runGraphPan] = peak[nowIndexPan];
								if(peak[nowIndexPan]===1){
									// findHeartratePan(tempPeak,nowIndexPan);
									// tempPeak = nowIndexPan;
									findHeartratePan(tempArray,nowIndexPan);
								}
				                nowCountPan++;
				                nowIndexPan++;
				                runGraphPan++; 
				            }
			        	}
			        }
			        else if(nowCount === mlii.length+(timeShow*2)){
			        	$interval.cancel($rootScope.interval);
			        }
				    var layoutPan = {
						margin: {
							t: 10,
							b: 30,
							l: 40,
							r: 50
						},
						height: "150",
						plot_bgcolor:'#263238',
						xaxis: {
							tickmode: "array",
							ticktext : dataLabels,
							tickvals : setData
						},
						yaxis: {
						    range: [0,1.2],
						    autorange: false
						},
					};
				    var dataPan = [{
						type: 'scatter',
						x: dataXPan,
						y: dataYPan,
						mode: 'lines',
						line: {
							color: '#56e6bb',
							width: 1.2,
							smoothing:1.3
						}
					}];
				    Plotly.newPlot('chartPeak', dataPan, layoutPan);
				};

			    // set play-stop Graph
			    $rootScope.interval = $interval(function(){
	        		if (angular.isDefined(play)){
			        	if(nowCount <= mlii.length+(timeShow*2)) {
				        	updateGraph();
				        	updateGraphPan();
				        }
	        		}
	        		else{
	        			return;
	        		}
	        	},timeInterval);

			    //get data fron annotation
				$http({
			        method: 'GET',
			        url: '/compare/'+$routeParams.filename
			    }).then(function (response) {
			    	$scope.annotations = response.data;
			    	$scope.tables = checkAnnotation($scope.annotations,$scope.checkAccuracys);
			    	$scope.conclusion =  conclusionComponant($scope.tables);
			    }, function (response) {
			        console.log(response);
			    });

		},function (error){
			console.error('Error', error.status, error.data);
		});
  	})
;

function timestringTotimemilisec(timestring){
	var miliSecond = 0,minute = 0,hour = 0;
	var convertsec = 60;
    var splitSinglecod = timestring.split("'");
    var splitMilisec = splitSinglecod[1].split(".");
    var splitTime = splitMilisec[0].split(":");
    for(var i=splitTime.length-1;i<=0;i--){
    	if( i === splitTime.length-1){
    		minute = parseInt(splitTime[i])*60;
    	}
    	else if( i === splitTime.length-2){
    		hour = parseInt(splitTime[i])*60;
    	}
    }
    miliSecond = parseInt(splitTime[splitTime.length-1]+splitMilisec[1])+minute+hour;
    return miliSecond;
}

function checkAnnotation(annotation,peaktime){
	var checkTable = [];
	var check = true;
	var countA = 0;
	var countP = 0;
	var test, delay = 200;
	while(check){
		if(countA == annotation.length && countP == peaktime.length){
			check = false;
			break;
		}
		else if(countA == annotation.length && countP != peaktime.length){
			test = {
				'annotation':'-',
				'peak':peaktime[countP].time,
				'result': 'FP'
			};
			countP++;
		}
		else if(countA != annotation.length && countP == peaktime.length){
			test = {
				'annotation':annotation[countA].Time,
				'peak':'-',
				'result': 'FN',
				'note':annotation[countA].Num
			};
			countA++;
		}
		else{
			var timeannotation = parseInt(timestringTotimemilisec("'"+annotation[countA].Time+"'"));
			var timepeakdetect = parseInt(timestringTotimemilisec(peaktime[countP].time));
			if(timeannotation < timepeakdetect){
				if(timepeakdetect >= timeannotation && timepeakdetect <= timeannotation+delay){
					test = {
						'annotation':annotation[countA].Time,
						'peak':peaktime[countP].time,
						'result': 'TP',
						'note':annotation[countA].Num
					};
					countA++;
					countP++;
				}
				else{
					test = {
						'annotation':annotation[countA].Time,
						'peak':'-',
						'result': 'FN',
						'note':annotation[countA].Num
					};
					countA++;
				}
			}
			else if(timeannotation == timepeakdetect){
				test = {
					'annotation':annotation[countA].Time,
					'peak':peaktime[countP].time,
					'result': 'TP',
					'note':annotation[countA].Num
				};
				countA++;
				countP++;
			}
			else{
				if(timeannotation >= timepeakdetect-delay && timeannotation <= timepeakdetect){
					test = {
						'annotation':annotation[countA].Time,
						'peak':peaktime[countP].time,
						'result': 'TP',
						'note':annotation[countA].Num
					};
					countA++;
					countP++;
				}
				else{
					test = {
						'annotation':'-',
						'peak':peaktime[countP].time,
						'result': 'FP'
					};
					countP++;
				}
			}
		}
		checkTable = checkTable.concat(test);
	}
	return checkTable;
}
function conclusionComponant(file){
	var TP=0,FN=0,FP=0,accuracy=0,f1score=0;
	for(var i=0;i<file.length;i++){
		if(file[i].result=='TP') TP++;
		else if(file[i].result=='FP') FP++;
		else if(file[i].result=='FN') FN++;
		else break; 
	}
	accuracy = parseFloat((TP/(TP+FN+FP))*100).toFixed(4);
	f1score = parseFloat(((2*TP)/((2*TP)+FP+FN))*100).toFixed(4);
	var conclusion = {
		'TP':TP,
		'FN':FN,
		'FP':FP,
		'accuracy':accuracy,
		'F1':f1score
	};
	return conclusion;
}
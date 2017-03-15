{   
	$.ajax({
        type: 'GET',
        url: 'http://localhost:4000/draworiginalgraph',
        success: function(data){
        	//alert("done");
            var timeseries = [], mlii = [],peak = [];;

            for(var i = 2; i < 21600; i++){
                timeseries.push(data[i].field1);
                mlii.push(data[i].field2);
            }
            for(var j = 21602;j < data.length;j++ ){
                peak.push(data[j].field1);
            }
            
            
            var dps = []; // dataPoints
            
            var chart = new CanvasJS.Chart("chartContainer",{
                axisX:{   
                    interval: 360 
                },
                axisY:{   
                    minimum: -0.75,
                    maximum: 1.5   
                },             
                data: [{
                    type: "line",
                    dataPoints: dps 
                }]
            }); 
    
            var nowCount = 0;
            var nowIndex = 0;
            var updateGraph = function() {
                if(nowCount<3600){
                    for(var j = 0; j<=3600;j++){
                        dps.push({
                            x : nowCount,
                            y : 0,
                            label : " "
                        });
                        nowCount++;
                    }
                }
                else if(nowCount>mlii.length+3600 && nowCount<mlii.length+7200){
                    for (var k = 0; k < 360; k++) {
                        dps.push({
                            x : nowCount,
                            y : 0,
                            label : " "
                        });
                        nowCount++;
                    }
                }
                else if(nowCount>3600 && nowCount<mlii.length+3600-1){
                    for(var i = 0; i < 360; i++) {
                        dps.push({
                            x : nowCount,
                            y : parseFloat(mlii[nowIndex]),
                            label : timeseries[nowIndex]
                        });
                        nowCount++;
                        nowIndex++; 
                    }
                }
                if(dps.length>=3600){
                    for(var i = 0; i < 360; i++) {
                        dps.shift();
                    }
                }
                chart.render();
                if(nowCount < mlii.length+7200) {
                    setTimeout(updateGraph, 1000);
                }
            };
            setTimeout(updateGraph, 1000);
            countTiming();
            
            var dps1 = []; 
            var chart1 = new CanvasJS.Chart("chartPeak",{
                axisX:{   
                    interval: 360 
                },
                axisY:{   
                    minimum: -0.1,
                    maximum: 1.1  
                },             
                data: [{
                    type: "line",
                    dataPoints: dps 
                }]
            }); 
    
            var nowCount2 = 0;
            var nowIndex1 = 0;
            var updateGraph1 = function() {
                //console.log(nowCount2);
                if(nowCount2<3600){
                    for(var j = 0; j<3600;j++){
                        dps1.push({
                            x : nowCount2,
                            y : 0,
                            label : " "
                        });
                        nowCount2++;
                    }
                }
                else if(nowCount2>=peak.length+3600 && nowCount2<peak.length+7200){
                    for (var k = 0; k < 360; k++) {
                        dps1.push({
                            x : nowCount2,
                            y : 0,
                            label : " "
                        });
                        nowCount2++;
                    }
                }
                else if(nowCount2>=3600 && nowCount2<peak.length+3600){
                    for(var i = 0; i < 360; i++) {
                        dps1.push({
                            x : nowCount2,
                            y : parseFloat(peak[nowIndex1])
                        });
                        nowCount2++;
                        nowIndex1++; 
                    }
                }
                if(dps1.length>=3600){
                    for(var i = 0; i < 360; i++) {
                        dps1.shift();
                    }
                }
                chart1.render();
                if(nowCount2 < peak.length+7200) {
                    setTimeout(updateGraph1, 1000);
                }
            };
            setTimeout(updateGraph1, 1000);
            
        }
    });

    // $.ajax({
    //     type: 'GET',
    //     url: 'http://localhost:4000/drawfinalgraph',
    //     success: function(data){
    //         //alert("done");
    //         var peak = [];

    //         for(var i = 2; i < data.length; i++){
    //             peak.push(data[i].field1);
    //         }
            
            
    //         var dps = []; // dataPoints
            
    //         var chart = new CanvasJS.Chart("chartPeak",{
    //             axisX:{   
    //                 interval: 360 
    //             },
    //             axisY:{   
    //                 minimum: -0.1,
    //                 maximum: 1.1  
    //             },             
    //             data: [{
    //                 type: "line",
    //                 dataPoints: dps 
    //             }]
    //         }); 
    
    //         var nowCount1 = 0;
    //         var nowIndex = 0;
    //         var updateGraph = function() {
    //             console.log(nowCount1);
    //             if(nowCount1<3600){
    //                 for(var j = 0; j<3600;j++){
    //                     dps.push({
    //                         x : nowCount1,
    //                         y : 0,
    //                         label : " "
    //                     });
    //                     nowCount1++;
    //                 }
    //             }
    //             else if(nowCount1>=peak.length+3600 && nowCount1<peak.length+7200){
    //                 for (var k = 0; k < 360; k++) {
    //                     dps.push({
    //                         x : nowCount1,
    //                         y : 0,
    //                         label : " "
    //                     });
    //                     nowCount1++;
    //                 }
    //             }
    //             else if(nowCount1>=3600 && nowCount1<peak.length+3600){
    //                 for(var i = 0; i < 360; i++) {
    //                     dps.push({
    //                         x : nowCount1,
    //                         y : parseFloat(peak[nowIndex])
    //                     });
    //                     nowCount1++;
    //                     nowIndex++; 
    //                 }
    //             }
    //             if(dps.length>=3600){
    //                 for(var i = 0; i < 360; i++) {
    //                     dps.shift();
    //                 }
    //             }
    //             chart.render();
    //             if(nowCount1 < peak.length+7200) {
    //                 setTimeout(updateGraph, 1000);
    //             }
    //         };
    //         setTimeout(updateGraph, 1000);
    //         countTiming();
    //     }
    // });

    function countTiming(){
        var oldDate = new Date();
        setInterval(function(){
            var currentDate = new Date();
            var time = currentDate - oldDate;
            //console.log(currentDate.getSeconds());
            $("#timer").html(formDate(time));
        },1000);
    }
    function formDate(time){
        var second = parseInt((time-1000)/1000);
        var hour = 0;
        var minute = 0;
        if(second>60){
            minute = parseInt(second/60);
            second = second%60;
            if(minute>60){
                hour = parseInt(minute/60);
                minute = minute%60;
            }
        }
        else if(second<0){
            second = 0;
        }
        dateForm = hour + ":" + minute + ":" + second;
        return dateForm;
    }
}

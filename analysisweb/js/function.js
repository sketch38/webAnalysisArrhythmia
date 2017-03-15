// $(function(){
	
// });

//change page without reload
function changepage(page){
	// if(page == 'test.html'){
	// 	page = 'http://localhost:4000/drawgraph'
	// }
	$.ajax({
		url:page,
		method:'GET',
		success: function(data){
			$("#center").html(data);
		}
	});
}
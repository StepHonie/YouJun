$(function(){



//	$.ajax({  
//	         type : "post",  
//	         url : '/post',
//	         contentType: "application/json",
//	         data : JSON.stringify({sqlName:'Sum_Area_Days',sqlType:'sp',params:{customer_id:'3',family_id:'3',area:'',factorymaroute_id:'',assemblynumber:'',isrma:'',iskeystation:''}}),
//	         async : false,  
//	         success : function(data){  
//	            alert(JSON.stringify(data));
//	        }, 
//			error: function(XMLHttpRequest, textStatus, errorThrown){
//				alert('Error: '+errorThrown);
//				d = '';
//			}       
//	    });  	
});

function formatNum(num) {  
	num = (Math.round(num * 100) / 100).toString();
	var numInt =0, numFlo =''; result='';
	if (num.split('.')[1]) {
	　　　numInt = num.split('.')[0], numFlo = num.split('.')[1];
	}
	else{
		numInt =num;
	} 
    while (num.length > 3) {  
        result = ',' + num.slice(-3) + result;  
        num = num.slice(0, num.length - 3);  
    }  
    if (num) { result = num + result; }  
    if (numFlo >0){result = result + '.'+ numFlo}
    return result;  
}  



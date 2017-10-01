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

function ajax (query)
{
	var d ='';
    $.ajax({
    		url: '/post',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(query),
        cache: false,
        async: false,
        success:function(data)
					{
        	if(data.originalError!=null)
					{
        		if(data.originalError.message!=null)
						{
	        		alert(data.originalError.message);
	        		return;
        		}
        	}
            d= data;
        	},
				error:function(XMLHttpRequest, textStatus, errorThrown)
					{
						layer.alert(XMLHttpRequest.responseText);
						d= '';
					}
    });
    return d;
}

function addItems(select, data){
	var $select = $("#" + select);
	RemoveOption(select,0);
	var dataObj = JSON.stringify(data);
	for(var i in data )
	{
		var opt = $("<option></option>").html(data[i].Label).val(data[i].Value);
		$select.append(opt)
	}
}


function GetQueryString(name) {

   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");

   var r = window.location.search.substr(1).match(reg);

   if (r!=null) return unescape(r[2]); return null;

}

function getOptions(select, query){
	var data = ajax(query);
	if (data !=''){
		addItems(select,data);
	}
}

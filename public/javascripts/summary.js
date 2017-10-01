$(function() {
	$.get("/views/header.html",function(data){ $("#top").html(data); });
	bindEvents();
	getCustoerList();
	
	if($.cookie('customer')!=null){
		var	query = JSON.parse($.cookie('customer').substring(2));
		if(query!=null){
			$('#customer_id').val(query.customer_id);
		};		
	}
	getFaimlyList();
	if(typeof(query)!='undefined'){
		$('#family_id').val(query.family_id);
	};
	getAreaList();
	getRouteList();	
	getAssemblyList();	

	if(typeof(query)!='undefined'){
		loadReportData();
	}

    $(window).resize(function(){   
     	setTableHeight();
    });	

});


function bindEvents(){
	$('#btnview').click(function(){
		loadReportData();
	});
	$('#format').change(function(){
		getAreaList();
	});	
	$('#customer_id').change(function(){
		getFaimlyList();
		getAreaList();
		getRouteList();	
		getAssemblyList();
	});	
	$('#family_id').change(function(){
		getAreaList();
		getRouteList();
		getAssemblyList();
	});		
	$('#area').change(function(){
		getRouteList();
		getAssemblyList();
	});	
	$('#factorymaroute_id').change(function(){
		getAssemblyList();
	});		
}

function RemoveOption(select,option){
	$("#" + select + " option").remove();
	if(option==1){
		$("#" + select).append('<option value="">All</option>');
	}
}

function getCustoerList(){
	getOptions('customer_id',{sqlName:'getCustomerList'});	
}

function getFaimlyList(){
	getOptions('family_id',{sqlName:'getFamilyList',params:{Customer_ID:$('#customer_id').val()}});
}

function getAreaList(){
	var format =$('#format').val();
	var sql = format==2||format==3||format==5?'getArea':'getAreaAll';
	getOptions('area',{sqlName:sql,params:{Customer_ID:$('#customer_id').val(),Family_ID:$('#family_id').val()}});
}

function getRouteList(){
	getOptions('factorymaroute_id',{sqlName:'getRouteList',sqlType:'sp',params:{Customer_ID:$('#customer_id').val(),Family_ID:$('#family_id').val(),Area:$('#area').val()}});
}

function getAssemblyList(){
	getOptions('assemblynumber',{sqlName:'getAssemblyList',sqlType:'sp',params:{Customer_ID:$('#customer_id').val(),Family_ID:$('#family_id').val(),Area:$('#area').val(),FactoryMARoute_ID:$('#factorymaroute_id').val()}});
}

function loadReportData(){
	var iskeystation ='';
	if ($('#iskeystation').is(':checked')){iskeystation='1'};
	var params={
		customer_id: $('#customer_id').val(),
		family_id: $('#family_id').val(),
		area: $('#area').val(),
		factorymaroute_id: $('#factorymaroute_id').val(),
		assemblynumber: $('#assemblynumber').val(),
		isrma:  $('#isrma').val(),
		iskeystation:iskeystation
	};
	$.cookie('query',JSON.stringify(params));
	var sp='';
	var format =$('#format').val();
	switch (format)
	{
		case '1':
			sp='Sum_Area_Days';
			break;
		case '2':
			sp='Sum_Area_Route';
			break;
		case '3':
			sp='Sum_Area_Station';
			break;
		case '4':
			sp='Sum_Assembly_Area';
			break;
		case '5':
			sp='Sum_Station_Route';
			break;
	}
	if(sp=='')return;
	var data = ajax({sqlName:sp,sqlType:'sp',params:params});
	if(data.length==0){
		$('#ReportTable').html('');
		return;
	}
	data = addLink(data, format);
	var i =0;
	var colModel =[];
	for (x in data[0]){
		var label =x;

		if(format==1){
			switch (x){
				case 'D0D3':
				label = '0-3 Days';
				break;
				case 'D4D7':
				label = '4-7 Days';
				break;
				case 'D8D15':
				label = '8-15 Days';
				break;
				case 'D16D30':
				label = '16-30 Days';
				break;
				case 'D31D90':
				label = '31-90 Days';
				break;		
				case 'GD90':
				label = '>90 Days';
				break;				
			}
		}
		colModel.push({name:x, label:label, align:'center'}); 
	}
	$.jgrid.gridUnload('#ReportTable');
    $('#ReportTable').jqGrid({
        rownumbers: true,
        datastr: data,
        datatype: "jsonstring",
        beforeRequest: function () {
            setTableHeight();
        },
        colModel: colModel,
        loadComplete: function (data){
			
        },
		beforeSelectRow: function (rowid, e) {  
		    var $myGrid = $(this),  
		        i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),  
		        cm = $myGrid.jqGrid('getGridParam', 'colModel');  
		    return (cm[i].name === 'cb');  
		},          
        rowNum: 5000,
        autowidth: true,
        shrinkToFit: true,
        loadonce: true,
        rowList: [100, 200, 500],
        pager: '#pager',
        sortname: 'Days',
        viewrecords: true,
        sortorder: 'asc',
        height: 400,
        width: '100%',
        scrollOffset: 0
    });
    // We need to have a navigation bar in order to add custom buttons to it
    $('#ReportTable').navGrid('#pager',
        { edit: false, add: false, del: false, search: false, refresh: false, view: false, position: "left", cloneToTop: true });

    // add first custom button
    $('#ReportTable').navButtonAdd('#pager',
        {
            buttonicon: "ui-icon-document",
            title: "Export to Excel File",
            id: 'export',
            caption: "Excel",
            position: "last",
            onClickButton: exportCSV
        });    
}

function setTableHeight(){
	var y =280;
	$("#ReportTable").setGridHeight($(window).height() -y);	
}

function exportCSV(){
	$("#ReportTable").jqGrid("exportToCsv",{
		separator: ",",
		separatorReplace : "", // in order to interpret numbers
		quote : '"', 
		escquote : '"', 
		newLine : "\r\n", // navigator.userAgent.match(/Windows/) ?	'\r\n' : '\n';
		replaceNewLine : " ",
		includeCaption : true,
		includeLabels : true,
		includeGroupHeader : true,
		includeFooter: true,
		fileName : "WIPSummary.csv",
		returnAsString : false
	})	
}

// function doResize(){
// var td=$('#tdCompute')//获取计算实际列长度的容器
//     ,tds//临时保存列
//     ,arr=[];//用于保存最大的列宽
//  //遍历每行获得每行中的最大列宽
// $('#gview_ReportTable .ui-jqgrid-htable tr,#ReportTable tr:gt(0)').each(function(){
//    $(this).find('td,th').each(function(idx){
//      arr[idx]=Math.max(arr[idx]?arr[idx]:0,td.html($(this).text())[0].offsetWidth);
//    })         
// });
// $('#gview_ReportTable th').each(function(idx){this.style.width=arr[idx]+'px'});//设置页头单元格宽度       
// $('#ReportTable tr:eq(0) td').each(function(idx){this.style.width=arr[idx]+'px'});//设置内容表格中控制单元格宽度的单元格，在第一行
// 
// var total=$('#ReportTable').closest('.ui-jqgrid-bdiv')[0].scrollWidth;//获取表格宽度
// $('#ReportTable,#gview_ReportTable .ui-jqgrid-htable').css({width:total});//设置表头表格和内容表格宽度
// }

function addLink(data, rpt){
	switch(rpt){
		case '1':
			return addLink1(data);
			break;
		case '2':
			return addLink2(data);
			break;
		case '3':
			return addLink3(data);
			break;
		case '4':
			return addLink4(data);
			break;
		case '5':
			return addLink5(data);
			break;
	}
}

function addLink1(data){
	for(var i=0;i<data.length;i++){
		var area = data[i].Area;
		if(data[i].Total>0) data[i].Total ='<a href=/views/sn.html?area=' + encodeURIComponent(area) + ' target="_blank">' + formatNum(data[i].Total) + '</a>';
		if(data[i].D0D3>0) data[i].D0D3 = '<a href=/views/sn.html?area=' + encodeURIComponent(area) + '&daysfrom=0&daysto=3 target="_blank">' + formatNum(data[i].D0D3) + '</a>';
		if(data[i].D4D7>0) data[i].D4D7 = '<a href=/views/sn.html?area=' + encodeURIComponent(area) + '&daysfrom=4&daysto=7 target="_blank">' + formatNum(data[i].D4D7) + '</a>';
		if(data[i].D8D15>0) data[i].D8D15 = '<a href=/views/sn.html?area=' + encodeURIComponent(area) + '&daysfrom=8&daysto=15 target="_blank">' + formatNum(data[i].D8D15) + '</a>';
		if(data[i].D16D30>0) data[i].D16D30= '<a href=/views/sn.html?area=' + encodeURIComponent(area) + '&daysfrom=16&daysto=30 target="_blank">' + formatNum(data[i].D16D30) + '</a>';	
		if(data[i].D31D90>0) data[i].D31D90 = '<a href=/views/sn.html?area=' + encodeURIComponent(area) + '&daysfrom=31&daysto=90 target="_blank">' + formatNum(data[i].D31D90) + '</a>';	
		if(data[i].GD90>0) data[i].GD90 = '<a href=/views/sn.html?area=' + encodeURIComponent(area) + '&daysfrom=91&daysto=4000 target="_blank">' + formatNum(data[i].GD90) + '</a>';	
	}
	return data;
}

function addLink2(data){
	var route_id = [];
	for(x in data[0]){
		if(x!='Area' && x!='Total'){
			var id = ajax({sqlName:'getFactoryMARoute_ID',params:{RouteText:x,Area:$('#area').val()}});
			route_id.push(id[0].FactoryMARoute_ID);
		}
	}
	for(var i=0;i<data.length;i++){
		var area = data[i].Area;
		var col =0;
		if(data[i].Total>0) data[i].Total = '<a href=/views/sn.html?area=' + encodeURIComponent(area) +' target="_blank">' + formatNum(data[i].Total) + '</a>';
		for(x in data[i]){
			if(x!='Area' && x!='Total'){
				if(data[i][x]>0) {
					data[i][x] ='<a href=/views/sn.html?area=' + encodeURIComponent(area) + '&factorymaroute_id=' + route_id[col] + ' target="_blank">' + formatNum(data[i][x]) + '</a>';
				}
				col++;
			}
		}
	}
	return data;
}

function addLink3(data){
	for(var i=0;i<data.length;i++){
		var area = data[i].Area;
		if(data[i].Count>0) data[i].Count = '<a href=/views/sn.html?area=' + encodeURIComponent(area) + '&station=' + encodeURIComponent(data[i].Station) +' target="_blank">' + formatNum(data[i].Count) + '</a>';	
	}
	return data;
}

function addLink4(data){
	for(var i=0;i<data.length;i++){
		var assemblynumber = data[i].AssemblyNumber;
		if(data[i].Total>0) data[i].Total ='<a href=/views/sn.html?assemblynumber=' + encodeURIComponent(assemblynumber) + ' target="_blank">' + formatNum(data[i].Total) + '</a>';
		for(x in data[i]){
			if(x!='AssemblyNumber' && x!='Total'){
				if(data[i][x]>0) data[i][x] ='<a href=/views/sn.html?assemblynumber=' + encodeURIComponent(assemblynumber) + '&area=' + encodeURIComponent(x) + ' target="_blank">' + formatNum(data[i][x]) + '</a>';
			}
		}
	}
	return data;
}

function addLink5(data){
	var route_id = [];
	for(x in data[0]){
		if(x!='Station' && x!='Total'){
			var id = ajax({sqlName:'getFactoryMARoute_ID',params:{RouteText:x,Area:$('#area').val()}});
			route_id.push(id[0].FactoryMARoute_ID);
		}
	}
	for(var i=0;i<data.length;i++){
		var station = data[i].Station;
		var col =0;
		if(data[i].Total>0) data[i].Total = '<a href=/views/sn.html?station=' + encodeURIComponent(station) +' target="_blank">' + formatNum(data[i].Total) + '</a>';
		for(x in data[i]){
			if(x!='Station' && x!='Total'){
				if(data[i][x]>0) {
					data[i][x] ='<a href=/views/sn.html?station=' + encodeURIComponent(station) + '&factorymaroute_id=' + route_id[col] + ' target="_blank">' + formatNum(data[i][x]) + '</a>';
				}
				col++;
			}
		}
	}
	return data;
}



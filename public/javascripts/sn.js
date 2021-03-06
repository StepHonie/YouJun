$(function(){
	$.get("/views/header.html",function(data){ $("#top").html(data); });
	setTableHeight()
	loadReporData();
})

function loadReporData(){
	var a =$.cookie('query');
	var params =JSON.parse($.cookie('query'));
	if(GetQueryString('area')){
		params.area=GetQueryString('area');
	}
	if(GetQueryString('factorymaroute_id')){
		params.factorymaroute_id=GetQueryString('factorymaroute_id');
	}
	if(GetQueryString('assemblynumber')){
		params.assemblynumber=decodeURIComponent(GetQueryString('assemblynumber'));
	}	
	if(GetQueryString('station')){
		params.station=decodeURIComponent(GetQueryString('station'));
	}
	else{
		params.station='';
	}
	if(GetQueryString('daysfrom')){
		params.daysfrom=GetQueryString('daysfrom');
		params.daysto=GetQueryString('daysto');
	}
	else{
		params.daysfrom='';
		params.daysto='';	
	}
	params.batchid='';
	params.status='';	

	var w =[160,60,120,45,90,40,150,70,110,55,65];
	$.jgrid.gridUnload('#SNTable');
    $('#SNTable').jqGrid({
        url: '/post/getsn',
        rownumbers: true,
        datatype: "json",
        mtype: 'POST',
        postData: params,
        beforeRequest: function () {
            setTableHeight();
        },
        colModel: [
                    { name: 'SerialNumber', label: 'SerialNumber', width: w[0] +'px'},
                    { name: 'BatchID', label: 'BatchID', width: w[1] +'px'},
                    { name: 'AssemblyNumber', label: 'AssemblyNumber', width: w[2] +'px'},
                    { name: 'IsRMA', label: 'IsRMA', align: 'center', width: w[3] +'px'},
                    { name: 'Route', label: 'Route', width: w[4] +'px'},
                    { name: 'Area', label: 'Area', width: w[5] +'px'},
                    { name: 'RouteStep', label: 'RouteStep', width: w[6] +'px'},
                    { name: 'IsKeyStation', label: 'KeyStation', align: 'center', width: w[7] +'px'},
                    { name: 'StartTime', label: 'StartTime', width: w[8] +'px'},
                    { name: 'Status', label: 'Status', width: w[9] +'px'},
                    { name: 'AgedDays', label: 'AgedDays', align: 'center', width: w[10] +'px'},
        ],
        gridComplete: function () {

        },
        loadComplete: function (data){
//			if(data.length>0){
//		      	if(data.length >=10000){
//		      		layer.alert('Data exceeded 10000 rows, <br />only show the top items.', { icon: 5 });
//		      	};				
//			};
        },
		beforeSelectRow: function (rowid, e) {  
		    var $myGrid = $(this),  
		        i = $.jgrid.getCellIndex($(e.target).closest('td')[0]),  
		        cm = $myGrid.jqGrid('getGridParam', 'colModel');  
		    return (cm[i].name === 'cb');  
		},          
        rowNum: 50,
        autowidth: true,
		caption: 'WIP Serial Number List',
//      shrinkToFit: true,
        loadonce: true,
        rowList: [50, 100, 200],
        pager: '#pager',
        sortname: 'Days',
        viewrecords: true,
        sortorder: 'asc',
        height: 400,
        width: '100%'
    });
    // We need to have a navigation bar in order to add custom buttons to it
    $('#SNTable').navGrid('#pager',
        { edit: false, add: false, del: false, search: false, refresh: false, view: false, position: "left", cloneToTop: true });

    // add first custom button
    $('#SNTable').navButtonAdd('#pager',
        {
            buttonicon: "ui-icon-document",
            title: "Export to Excel File",
            id: 'export',
            caption: "Excel",
            position: "last",
            onClickButton: ExportExcel
        });
}

function setTableHeight(){
	var y =170;
	$("#SNTable").setGridHeight($(window).height() -y);	
}

function ExportExcel(){
	$("#SNTable").jqGrid("exportToExcel",{
		includeLabels : true,
		includeGroupHeader : true,
		includeFooter: true,
		fileName : "WIPSNList.xlsx",
		maxlength : 100 // maxlength for visible string data 
	})	
}


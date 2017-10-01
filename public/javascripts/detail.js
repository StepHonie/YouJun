$(function() {
	$.get("/views/header.html",function(data){ $("#top").html(data); });
	bindEvents();
	getCustoerList();
	getFaimlyList();
	getAreaList();
	getRouteList();
	getAssemblyList();
	getStepType();
	getStationList();
	getBatchID();
    $(window).resize(function(){
     	setTableHeight();
    });
});


function bindEvents(){
	$('#btnview').click(function(){
		loadReportData();
	});
	$('#customer_id').change(function(){
		getFaimlyList();
		getAreaList();
		getRouteList();
		getAssemblyList();
		getStepType();
		getStationList();
		getBatchID();
	});
	$('#family_id').change(function(){
		getAreaList();
		getRouteList();
		getAssemblyList();
		getStepType();
		getStationList();
		getBatchID();
	});
	$('#area').change(function(){
		getRouteList();
		getAssemblyList();
		getStepType();
		getStationList();
		getBatchID();
	});
	$('#factorymaroute_id').change(function(){
		getAssemblyList();
		getStepType();
		getStationList();
		getBatchID();
	});
	$('#assemblynumber').change(function(){
		getBatchID();
	});
	$('#steptype').change(function(){
		getStationList();
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
	getOptions('area',{sqlName:'getArea',params:{Customer_ID:$('#customer_id').val(),Family_ID:$('#family_id').val()}});
}

function getRouteList(){
	getOptions('factorymaroute_id',{sqlName:'GetRouteList',sqlType:'sp',params:{Customer_ID:$('#customer_id').val(),Family_ID:$('#family_id').val(),Area:$('#area').val()}});
}

function getAssemblyList(){
	getOptions('assemblynumber',{sqlName:'GetAssemblyList',sqlType:'sp',params:{Customer_ID:$('#customer_id').val(),Family_ID:$('#family_id').val(),Area:$('#area').val(),FactoryMARoute_ID:$('#factorymaroute_id').val()}});
}

function getStepType(){
	getOptions('steptype',{sqlName:'GetStepType',sqlType:'sp',params:{Customer_ID:$('#customer_id').val(),Family_ID:$('#family_id').val(),Area:$('#area').val(),FactoryMARoute_ID:$('#factorymaroute_id').val()}});
}

function getStationList(){
	let iskeystation ='';
	if(GetQueryString('iskeystation')!=null){iskeystation ='1'};
	getOptions('station',{sqlName:'GetStationList',sqlType:'sp',params:{Customer_ID:$('#customer_id').val(),Family_ID:$('#family_id').val(),Area:$('#area').val(),FactoryMARoute_ID:$('#factorymaroute_id').val(),IsKeyStation:iskeystation,StepType:$('#steptype').val()}});
}

function getBatchID(){
	getOptions('batchid',{sqlName:'getBatchID',params:{Customer_ID:$('#customer_id').val(),Family_ID:$('#family_id').val(),AssemblyNumber:$('#assemblynumber').val()}});
}

function loadReportData() {
	var iskeystation ='';
	if ($('#iskeystation').is(':checked')){iskeystation='1'};
	var params={
		customer_id: $('#customer_id').val(),
		family_id: $('#family_id').val(),
		assemblynumber: $('#assemblynumber').val(),
		area: $('#area').val(),
		factorymaroute_id: $('#factorymaroute_id').val(),
		station: $('#station').val(),
		batchid: $('#batchid').val(),
		daysfrom: $('#daysfrom').val(),
		daysto: $('#daysto').val(),
		status: $('#status').val(),
		isrma: $('#isrma').val(),
		iskeystation:iskeystation
	};
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
        shrinkToFit: true,
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
	var y =315;
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

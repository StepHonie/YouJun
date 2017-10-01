$(function() {
	$.get("/views/header.html",function(data){ $("#top").html(data); });
	bindEvents();
	getCustoerList();
	getFaimlyList();
	getAreaList();
	
    $(window).resize(function(){   
     	setTableHeight();
    });	
	loadData();
});


function bindEvents(){
	$('#btnview').click(function(){
		loadReportData();
	});

	$('#customer_id').change(function(){
		getFaimlyList();
		getAreaList();
	});	
	
	$('#family_id').change(function(){
		getAreaList();
	});	
		
	$('#query').click(function(){
		loadData();
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

function loadData(){
	var params={
		Customer_ID: $('#customer_id').val(),
		Family_ID: $('#family_id').val(),
		Area: $('#area').val()
	};
	var data = ajax({sqlName:'getStationConf',params:params});
	$.jgrid.gridUnload('#dataTable');
    $('#dataTable').jqGrid({
        url: '/post',
        editurl: '/post/updateStation',
        rownumbers: true,
        datastr: data,
        datatype: "jsonstring",
        beforeRequest: function () {
            setTableHeight();
        },
        colModel: [
                    { name: 'Station_ID', label: 'Station_ID', width: '150px', hidden: true, key: true},
                    { name: 'Station', label: 'Station', width: '250px', align:'left'},
                    { name: 'StationAlias', label: 'Station Alias', width: '250px', editable: true, editrules: {required:true}},
                    { name: 'IsKeyStation', label: 'IsKeyStation', width: '100px', editable: true, edittype: 'checkbox', formatter: 'checkbox', align:'center'},
                    { name: 'DisplayOrder', label: 'Display Order', width: '120px', editable: true, editrules: {required:true, number:true,minValue:0}, align:'center'},
                    {
						label: "Edit",
                        name: "actions",
                        width: 60,
                        formatter: "actions",
                        formatoptions: {
                            keys: true,
                            editOptions: {},
                            delbutton:false
                        },
                        align:'center'
                    }                    
        ],
		gridComplete: function() {
           
       },
		beforeSelectRow: function (rowid, e) {  

		},          
        rowNum: 5000,
        autowidth: true,
        shrinkToFit: false,
        loadonce: true,
        rowList: [100, 200, 500],
//      pager: '#pager',
        sortname: 'Days',
        viewrecords: true,
        sortorder: 'asc',
        height: 400,
//      onSelectRow: rowEdit,
        width: '100%',
        scrollOffset: 0
    });


    
    // We need to have a navigation bar in order to add custom buttons to it
    $('#dataTable').navGrid('#pager',
        { edit: false, add: false, del: false, search: false, refresh: false, view: false, position: "left", cloneToTop: true });

}

function setTableHeight(){
	var y =215;
	$("#dataTable").setGridHeight($(window).height() -y);	
}

function exportCSV(){
	$("#dataTable").jqGrid("exportToCsv",{
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
		fileName : "ProductPrice.csv",
		returnAsString : false
	})	
}

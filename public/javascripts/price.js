$(function() {
	$.get("/views/header.html",function(data){ $("#top").html(data); });
	bindEvents();
	getCustoerList();
	getFaimlyList();
	
    $(window).resize(function(){   
     	setTableHeight();
    });	
	loadPrice();
});


function bindEvents(){
	$('#btnview').click(function(){
		loadReportData();
	});

	$('#customer_id').change(function(){
		getFaimlyList();
	});	
	
	$('#query').click(function(){
		loadPrice();
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
	getOptions('family_id',{sqlName:'getFamilyALL',params:{Customer_ID:$('#customer_id').val()}});
}

function loadPrice(){
	var params={
		Customer_ID: $('#customer_id').val(),
		Family_ID: $('#family_id').val(),
	};
	var data = ajax({sqlName:'getPrice',params:params});
	$.jgrid.gridUnload('#priceTable');
    $('#priceTable').jqGrid({
        url: '/post',
        editurl: '/post/updatePrice',
        rownumbers: true,
        datastr: data,
        datatype: "jsonstring",
        beforeRequest: function () {
            setTableHeight();
        },
        colModel: [
                    { name: 'Family', label: 'Family', width: '150px', align:'center'},
                    { name: 'AssemblyNumber', label: 'AssemblyNumber', width: '250px', align:'center', key: true},
                    { name: 'Price', label: 'Unit Price($)', width: '120px', editable: true, editrules: {required:true,number:true,minValue:0}, align:'center'},
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
//                      extraparam: {
//                      	Family:function(){
//	                        	var sel_id = $('#priceTable').jqGrid('getGridParam','selrow');
//	                        	var value = $('#priceTable').jqGrid('getCell',sel_id,'Family');
//	                        	return value;
//                      	}
//                      },
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
    $('#priceTable').navGrid('#pager',
        { edit: false, add: false, del: false, search: false, refresh: false, view: false, position: "left", cloneToTop: true });

}

function setTableHeight(){
	var y =215;
	$("#priceTable").setGridHeight($(window).height() -y);	
}

function exportCSV(){
	$("#priceTable").jqGrid("exportToCsv",{
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

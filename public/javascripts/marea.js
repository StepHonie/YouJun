$(function() {
	$.get("/views/header.html",function(data){ $("#top").html(data); });

    $(window).resize(function(){   
     	setTableHeight();
    });	
	loadData();
});

function loadData(){
	var data = ajax({sqlName:'getMAConf',params:null});
	var areaData = ajax({sqlName:'getAreaList',params:null});
	var areaList =[];
	for(var i=0;i<areaData.length;i++){
		areaList.push(areaData[i].Area);
	}
	$.jgrid.gridUnload('#areaTable');
    $('#areaTable').jqGrid({
	    url: '/post',
	    editurl: '/post/maconf',
	    rownumbers: true,
	    datastr: data,
	    datatype: "jsonstring",
	    beforeRequest: function () {
	        setTableHeight();
	    },  
        colModel: [
                    { name: 'FactoryMARoute_ID', label: 'FactoryMARoute_ID', hidden:true, key: true},
                    { name: 'Factory', label: 'Factory', width: '150px', align:'left'},
                    { name: 'MA', label: 'MA', width: '150px'},
                    { name: 'Route', label: 'Route', width: '300px'},
                    { name: 'Area', label: 'Area', width: '150px', 
                    	editable: true,
                        edittype: "select", 
                        editrules: {required:true},
                        editoptions:{value: areaList.join(';')}},
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
//	                        	var sel_id = $('#areaTable').jqGrid('getGridParam','selrow');
//	                        	var value = $('#areaTable').jqGrid('getCell',sel_id,'Family');
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
		caption: 'Manufacturing Area Defination',
        rowNum: 5000,
        autowidth: true,
        shrinkToFit: false,
        loadonce: true,
        rowList: [100, 200, 500],
//      pager: '#pager',
//      sortname: '',
        viewrecords: true,
        sortorder: 'asc',
        height: 400,
//      onSelectRow: rowEdit,
        width: '100%'
    });
}

function setTableHeight(){
	var y =142;
	$("#areaTable").setGridHeight($(window).height() -y);	
}

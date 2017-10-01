$(function(){
	loadReportData();
	$('#exportExcel').click(function(){
		exportCSV();
	});
    $(window).resize(function(){
     	setTableHeight();
    });
});

function loadReportData(){
	var s = ajax({
		sqlName:'checkDBStatus',
		params:null
	});	
	var item1 = GetQueryString('customer_id')==null?'Customer_ID':'Family_ID';
	var item2 = item1.replace('_ID','');
	var integer = {defaultValue: 0, thousandsSeparator: ',' };
	var colModel =[{name:item1,label:item1,hidden: true},
					{name:item2, label:item2,formatter:returnLink, align:'center'},
					{name:'Total',
						label:'WIP',
						align:'center',
						formatter: 'integer',
                        formatoptions: { defaultValue: 0, thousandsSeparator: ',' }
                    },
					{name:'D0D3',
						label: '0-3 Days',
						align:'center',
						formatter: 'integer',
                        formatoptions: { defaultValue: 0, thousandsSeparator: ',' }
					},
					{name:'D4D7',
						label: '4-7 Days',
						align:'center',
						formatter: 'integer',
                        formatoptions: { defaultValue: 0, thousandsSeparator: ',' }
					},
					{name:'D8D15',
						label: '8-15 Days',
						align:'center',
						formatter: 'integer',
                        formatoptions: { defaultValue: 0, thousandsSeparator: ',' }
					},
					{name:'D16D30',
						label: '16-30 Days',
						align:'center',
						formatter: 'integer',
                        formatoptions: { defaultValue: 0, thousandsSeparator: ',' }
					},
					{name:'D31D90',
						label: '31-90 Days',
						align:'center',
						formatter: 'integer',
                        formatoptions: { defaultValue: 0, thousandsSeparator: ',' }
					},
					{name:'GD90',
						label: '>90 Days',
						align:'center',
						formatter: 'integer',
                        formatoptions: { defaultValue: 0, thousandsSeparator: ',' }
					}
				];
	$.jgrid.gridUnload('#MainTable');
    $('#MainTable').jqGrid({
//      rownumbers: true,
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
//      pager: '#pager',
        sortname: 'Days',
        viewrecords: true,
        sortorder: 'asc',
        width: '100%',
        scrollOffset: 0
    });
    // We need to have a navigation bar in order to add custom buttons to it
    $('#MainTable').navGrid('#pager',
        { edit: false, add: false, del: false, search: false, refresh: false, view: false, position: "left", cloneToTop: true });

    // add first custom button
    $('#MainTable').navButtonAdd('#pager',
        {
            buttonicon: "ui-icon-document",
            title: "Export to Excel File",
            id: 'export',
            caption: "Excel",
            position: "last",
            onClickButton: exportCSV
        });
}

function returnLink(cellValue, options, rowdata, action){
	var customer_id = GetQueryString('customer_id');
	if (customer_id==null){
		return "<a href='/?customer_id=" + rowdata.Customer_ID + "'><b>" + cellValue + "</b></a>";
	}
	else{
		return "<a href='/summary?customer_id=" + customer_id + "&family_id=" +rowdata.Family_ID +"'><b>" + cellValue + "</b></a>";
	}
}

function setTableHeight(){
	var y =198;
	$("#MainTable").setGridHeight($(window).height() -y);
	$("#MainTable").setGridWidth('100%');
}

function exportCSV(){
	$("#MainTable").jqGrid("exportToCsv",{
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
		fileName : "WIPOverall.csv",
		returnAsString : false
	})
}

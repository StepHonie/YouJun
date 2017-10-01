var detail={};
let sql = require('../plugs/sql');
let fs=require("fs");
let sqlstatements=JSON.parse(fs.readFileSync("./controllers/sqlstatements.json"));

detail.index = function(req, res, next) {
	let customer =req.query.customer;
	let family = req.query.family;
	if (customer!=null)
	{
		let strsql = sqlstatements['getCustomerFamily_ID'].sql;
		sql.queryWithParams(strsql,{Customer:customer,Family:family},function(err,result){
			if(err!=null)
			{
				res.render('error',{error:err});
			}else{
				let customer_id ='';
				let family_id ='';
				if(result.recordset.length >0)
				{
					customer_id =result.recordset[0].Customer_ID;
					family_id =result.recordset[0].Family_ID;
				}
				let url ='/detail?format=1&customer_id=' + customer_id + '&family_id=' + family_id;
				res.redirect(url);
			}
		});
	}else{
		res.render('detail');
	}
}

module.exports=detail;

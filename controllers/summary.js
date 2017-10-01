var summary={};
let fs=require("fs");
let sql = require('../plugs/sql');
let sqlstatements=JSON.parse(fs.readFileSync("./controllers/sqlstatement.json"));

summary.index = function(req, res, next) {
	let customer_id =req.query.customer_id;
	let family_id = req.query.family_id;
	if(customer_id!=null){
		res.cookie('customer',{customer_id:customer_id,family_id:family_id},{maxAge: 60*1000})	
	}
	res.redirect('/views/summary.html');
}


module.exports=summary;
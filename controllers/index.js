var index={};
var sql = require('../plugs/sql');

index.index = function(req, res, next)
{
	var query = {type:'Quantity',customer_id:req.query.customer_id};
	if (req.query.type == 'cost') {query.type ='Cost';};
	if (query.customer_id == undefined)
	{
		sql.exec("Sum_Customer",{type:query.type},function(err,result)
		{
			if(err!=null)
			{
				res.render('error',{error:err});
			}
			else{
				res.render('index',{result:result.recordset,query:query});
			}
		});
	}else{
		sql.exec("Sum_Family",{type:query.type,customer_id:query.customer_id},function(err,result)
		{
			if(err!=null)
			{
				res.render('error',{error:err});
			}else{
				res.render('index',{result:result.recordset,query:query});
			}
		});
	}
}

module.exports=index;

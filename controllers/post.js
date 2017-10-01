var post={};
let sql = require('../plugs/sql');
let fs=require("fs");
let sqlstatements=JSON.parse(fs.readFileSync("./controllers/sqlstatement.json"));

post.handler = function(req, res, next){
	let json = req.body;
	sql.query(sqlstatements['checkDBStatus'].sql, function(err,result)
	{
		if(err!=null)
		{
			res.send(err);
		}else{
			var status = result.recordset[0].keyvalue;
			if(status =='Importing')
			{
				return next(new Error('WIP dashboard is importing data from MES, please waiting for a moment...'));
			}
			if(json.sqlType =='sp')
			{
				sql.exec(json.sqlName,json.params,function(err,result)
				{
					if(err!=null)
					{
						res.send(err);
					}else{
						res.send(result.recordset);
					}
				});
			}else{
				let sqlstr = sqlstatements[json.sqlName].sql;
				sql.queryWithParams(sqlstr,json.params,function(err,result)
				{
					if(err!=null)
					{
						res.send(err);
					}else{
						res.send(result.recordset);
					}
				});
			};
		}
	});
}

post.getsn = function(req, res, next) {
	let json = req.body;
	let params ={
		customer_id: json.customer_id,
		family_id: json.family_id,
		assemblynumber: json.assemblynumber,
		area: json.area,
		factorymaroute_id: json.factorymaroute_id,
		station: json.station,
		batchid: json.batchid,
		daysfrom: json.daysfrom,
		daysto: json.daysto,
		status: json.status,
		isrma: json.isrma,
		iskeystation: json.iskeystation
	}
	sql.exec('GetSNList',params,function(err,result){
		if(err!=null)
		{
			res.send(err);
		}
		else{
			res.send(result.recordset);
		}
	});
}

post.updatePrice=function(req,res,next){
	let json =req.body;
	console.log(json);
	let sqlstr = sqlstatements['updatePrice'].sql;
	let params ={
		AssemblyNumber:json.AssemblyNumber,
		Price:json.Price,
		UserID: process.env.USERNAME
	};
	sql.queryWithParams(sqlstr,params,function(err,result){
		if(err!=null)
		{
			res.send(err);
		}
		else{
			res.send(result.recordset);
		}
	});
}

post.maconf = function(req,res,next){
	let json =req.body;
	console.log(json);
	let sqlstr = sqlstatements['updateArea'].sql;
	let params ={
		Area:json.Area,
		FactoryMARoute_ID:json.FactoryMARoute_ID
	};
	sql.queryWithParams(sqlstr,params,function(err,result){
		if(err!=null)
		{
			res.send(err);
		}
		else{
			res.send(result.recordset);
		}
	});
}

post.updateStation = function(req,res,next){
	let json =req.body;

	let sqlstr = sqlstatements['updateStation'].sql;
	let iskeystation = json.IsKeyStation == 'Yes'?'1':'0';
	let key = json.Station_ID.split('%');
	let params ={
		Customer_ID: key[0],
		Family_ID: key[1],
		Station: key[2],
		Area: key[3],
		IsKeyStation: iskeystation,
		Alias: json.StationAlias,
		DisplayOrder: json.DisplayOrder,
		UserID: process.env.USERNAME
	};
	console.log(params);
	sql.queryWithParams(sqlstr,params,function(err,result){
		if(err!=null)
		{
			res.send(err);
		}
		else{
			res.send(result.recordset);
		}
	});
}

module.exports=post;

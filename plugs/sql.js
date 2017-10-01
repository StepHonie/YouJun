var mssql=require("mssql");

var sql={};

var config={
    user:"ctuapp",
    password:"Ctu777333app",
    server:"cnctug0sql02",
    database:"wdb",
    requestTimeout: 300000,
    pool:{
        max:100,
        idleTimeoutMillis:300000
    }
};

sql.query = function(sqltext,func){
    sql.queryWithParams(sqltext,null,func);
};

sql.queryWithParams  = function(sqltext,params,func){
	const pool = new mssql.ConnectionPool(config, err => {
		if(params!=null)
    {
			for(var i in params)
      {
				sqltext = sqltext.replaceAll('@'+ i,params[i]);
			}
		}
		new mssql.Request(pool).query(sqltext, (err, result) =>
     {
			func(err, result);
		});
	});

	pool.on('error', err => {
		res.render('error',{error:err});
	})
};

sql.exec = function(procedure_name,params,func){
	const pool = new mssql.ConnectionPool(config, err => {
		var request = new mssql.Request(pool);
		if (params != null) {
			for (var index in params) {
				request.input('' + index + '', mssql.NVarChar(100), '' + params[index] + '');
			}
		}
		request.execute(procedure_name, (err, result) => {
			func(err, result);
		})
	})

	pool.on('error', err => {
		res.render('error',{error:err});
	})
};

String.prototype.replaceAll = function(s1,s2){
	return this.replace(new RegExp(s1,"gmi"),s2);
}

module.exports=sql;

import mysql from 'mysql2/promise';

const mysqlWrite = mysql.createPool({
	host: 'blogdb.sldb.iwinv.net',
	user: 'root',
	password: 'D4n2tO9oQ5bM',
	database: 'Optimization_analysis',
	dateStrings: true,
	multipleStatements: true,
	connectTimeout: 5000,
	connectionLimit: 180 //default 10
});

const mysqlRead = mysql.createPool({
	host: 'blogdb.sldb.iwinv.net',
	user: 'root',
	password: 'D4n2tO9oQ5bM',
	database: 'Optimization_analysis',
	dateStrings: true,
	connectTimeout: 5000,
	connectionLimit: 180 //default 10
});

export { mysqlWrite, mysqlRead };
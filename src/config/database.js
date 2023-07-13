import mysql from 'mysql2/promise';

const mysqlWrite = mysql.createPool({
	host: 'afreecadb.sldb.iwinv.net',
	user: 'root',
	password: 'QGKiwkv764H3',
	database: 'afreecaCharge',
	dateStrings: true,
	multipleStatements: true,
	connectTimeout: 5000,
	connectionLimit: 180 //default 10
});

const mysqlRead = mysql.createPool({
	host: 'afreecadb.sldb.iwinv.net',
	user: 'root',
	password: 'QGKiwkv764H3',
	database: 'afreecaCharge',
	dateStrings: true,
	connectTimeout: 5000,
	connectionLimit: 180 //default 10
});

export { mysqlWrite, mysqlRead };
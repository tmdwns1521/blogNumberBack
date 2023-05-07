import { Router } from 'express';
import axios from 'axios';
import http from 'http';
import mysql from 'mysql2/promise';


const mysqlWrite = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'DHtmdwns1674@',
    database: 'new_schema',
    dateStrings: true,
		multipleStatements: true,
    connectTimeout: 5000,
    connectionLimit: 180 //default 10
})

const mysqlRead = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'DHtmdwns1674@',
    database: 'new_schema',
    dateStrings: true,
    connectTimeout: 5000,
    connectionLimit: 180 //default 10
})




// import { visitorService } from '../services/index.js';
// import bcrypt from 'bcrypt';

const visitorRouter = Router();

// 회원가입 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
visitorRouter.post('/visitor', async (req, res, next) => {
	const today = new Date();
	const twelve = 12;
	const forteen = 14;
	const sixteen = 15;
	const seventeen = 16;
	const thirty = 30
	const twenty = 20

	let ment = 'no';

	const hours = Number(today.getHours()); // 시
	const minutes = Number(today.getMinutes());  // 분
	
	// test
	// const hours = 12;
	// const minutes = 30;

	if ( (hours >= twelve && hours <= forteen) || (hours >= sixteen && hours <= seventeen)) {
		if (hours === forteen && minutes > thirty) {
			return res.status(201).json({"result" : ment});
		} else if( hours === twelve && minutes < thirty) {
			return res.status(201).json({"result" : ment});
		} else if( hours === sixteen && minutes < twenty) {
			return res.status(201).json({"result" : ment});
		} else if( hours === seventeen && minutes > twenty) {
			return res.status(201).json({"result" : ment});
		}
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		const is_ip = await mysqlRead.query('SELECT * FROM attendance WHERE ip = ?', ip)
		if (is_ip[0].length > 0) {
		// if (is_ip[0].length < 0) {
			return res.status(201).json({"result" : false});
		}else {
			try {
				const { team_name, employee_names, employee_nums, tels, reations, latitude, longitude, bank_name, bank_number, bank_admin } = req.body;
		
				const address = await axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?input_coord=WGS84&x=${longitude}&y=${latitude}`, {
					headers : {
						"Authorization": "KakaoAK 838a3cef132ebc7e79bb9d570ab26d7b"
					}
				});
				const address_data = (address.data.documents[0].address.address_name);
		
				return res.status(201).json({"data" : {ip, address_data, team_name, employee_names, employee_nums, tels, reations, bank_name, bank_number, bank_admin }});
			} catch (error) {
				next(error);
			}
		}
	}
	return res.status(201).json({"result" : ment});
});

visitorRouter.post('/visitorOk', async (req, res, next) => {
	const {ip, address_data, team_name, employee_names, employee_nums, tels, reations, bank_name, bank_number, bank_admin} = req.body;
	
	const today = new Date();

	// let ment = 'no';

	const hours = Number(today.getHours()); // 시
	// const hours = 16;
	let ment;
	const sql = "INSERT INTO attendance (ip, address_data, team_name, employee_names, employee_nums, tels, reations, bank_name, bank_number, bank_admin) values ?"
	await mysqlWrite.query(sql, [[[ip, address_data, team_name, employee_names, employee_nums, tels, reations, bank_name, bank_number, bank_admin]]])
	if (hours >= 12 && hours <= 14)  {
		ment = '*5.1절 노동절 금융노조 집회참석이 정상적으로 등록되었습니다!'
	} else if (hours >= 15 && hours <= 16) {
		ment = '*5.1절 노동절 금융노조 집회마감이 정상적으로 등록되었습니다!'
	}
	return res.status(201).json({"result": ment});
});

export { visitorRouter };
import { Router } from 'express';
import { chargeService } from '../services/index.js';
const charge = Router();

charge.get('/couponList', async function (req, res, next) {
	try {
		const result = await chargeService.couponList();
		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		next(error);
	}
});
charge.get('/chargeOnAir', async function (req, res, next) {
	try {
		const result = await chargeService.chargeOnAir();
		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		next(error);
	}
});
charge.post('/serialRegist', async function (req, res, next) {
	try {
		const { chargePrice, couponDatas } = req.body;
		if (chargePrice !== null && couponDatas !== null) {
			const result = await chargeService.serialRegist(chargePrice, couponDatas);
			res.status(200).json(result);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});
charge.post('/AfreecaCharge', async function (req, res, next) {
	try {
		let { card, afId, afPw, Id, Pw, price } = req.body;
		console.log(req.body);
		if (afId === '' || afPw === '' || price === '') return false;
		let result;
		price = price.replaceAll(',', '');
		if (card === 'AB') {
			result = await chargeService.AfreecaCharge(afId, afPw, price);
		} else if (card === 'CL') {
			result = await chargeService.CultureLandCharge(afId, afPw, Id, Pw, price);
		} else if (card === 'BL') {
			result = await chargeService.BookAndLifeCharge(afId, afPw, Id, Pw, price);
		} else if (card === 'HM') {
			result = await chargeService.HappyMoneyCharge(afId, afPw, Id, Pw, price);
		}
		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		next(error);
	}
});


export { charge };
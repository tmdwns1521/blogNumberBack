import {mysqlRead, mysqlWrite} from '../../config/database.js';
import {couponCharger} from '../../afreeca/couponCharge.js'
import {bookandlifecharger} from '../../afreeca/bookandlife.js'
import {cultureLandCharger} from '../../afreeca/cultureLand.js'
import {happyMoneyCharger} from '../../afreeca/happymoney.js'
import moment from 'moment';
import 'moment-timezone';

moment.tz.setDefault("Asia/Seoul");



export class Charge {
	async couponList() {
		try {
			const couponList = await mysqlRead.query('SELECT * FROM afreecaCoupon ORDER BY id');
			return couponList[0];
		} catch (e) {
			console.log(e);
		}
	}

	async chargeOnAir() {
		try {
			const charOn = await mysqlRead.query('SELECT * FROM charged_star_ballon ORDER BY id');
			return charOn[0];
		} catch (e) {
			console.log(e);
		}
	}
	async findCombination(data, target) {
		  const n = data.length;
		  const dp = new Array(n + 1).fill(null).map(() => new Array(target + 1).fill(false));

		  // 초기값 설정
		  for (let i = 0; i <= n; i++) {
			dp[i][0] = true;
		  }

		  for (let i = 1; i <= n; i++) {
			for (let j = 1; j <= target; j++) {
			  if (data[i - 1].price > j) {
				dp[i][j] = dp[i - 1][j];
			  } else {
				dp[i][j] = dp[i - 1][j] || dp[i - 1][j - data[i - 1].price];
			  }
			}
		  }

		  if (!dp[n][target]) {
			return null; // 조합이 존재하지 않을 경우 null 반환
		  }

		  // 조합 추적
		  const combination = [];
		  let i = n;
		  let j = target;
		  while (i > 0 && j > 0) {
			if (dp[i - 1][j]) {
			  i--;
			} else {
			  combination.push(data[i - 1]);
			  j -= data[i - 1].price;
			  i--;
			}
		  }

		  return combination;
		}

	async AfreecaCharge(afId, afPw, price) {
		try {
			const couponList = await mysqlRead.query('SELECT * FROM afreecaCoupon WHERE used = 0 AND normal = 0')
			const data = couponList[0].sort((a,b) => b.price - a.price);

			const combination = await this.findCombination(data, price);

			if (combination) {
				const result = await mysqlWrite.query(`INSERT INTO charged_star_ballon (platform, afreecaId, chared_price, complete_chared_price, success, failed_price) VALUES ('AB', '${afId}', ${price}, 0, 2, 0)`);
				const insertedId = result[0].insertId;
				await couponCharger(afId, afPw, combination, insertedId, price);
			} else {
			  console.log('No combination found.');
			}
			return 'data';
		} catch (e) {
			console.log(e);
		}
	}

	async serialRegist(chargePrice, couponDatas) {
		try {
			for (const e of couponDatas) {
				const serialNumber = e.split('(비번)')[0];
				const password = e.split('(비번)')[1];
				await mysqlWrite.query(`INSERT INTO afreecaCoupon (serialNumber, price, password) VALUES ('${serialNumber}', ${chargePrice}, '${password}')`);
			}
		} catch (e) {
			console.log(e);
		}
	}

	async CultureLandCharge(afId, afPw, Id, Pw, price) {
		try {
			const result = await mysqlWrite.query(`INSERT INTO charged_star_ballon (platform, afreecaId, platformId, chared_price, complete_chared_price, success, failed_price) VALUES ('CL', '${afId}', '${Id}', ${price}, 0, 2, 0)`);
			const insertedId = result[0].insertId;
			await cultureLandCharger(afId, afPw, Id, Pw, price, insertedId)
			return 'data';
		} catch (e) {
			console.log(e);
		}
	}

	async BookAndLifeCharge(afId, afPw, Id, Pw, price) {
		try {
			const result = await mysqlWrite.query(`INSERT INTO charged_star_ballon (platform, afreecaId, platformId, chared_price, complete_chared_price, success, failed_price) VALUES ('BL', '${afId}', '${Id}', ${price}, 0, 2, 0)`);
			const insertedId = result[0].insertId;
			await bookandlifecharger(afId, afPw, Id, Pw, price, insertedId)
			return 'data';
		} catch (e) {
			console.log(e);
		}
	}

	async HappyMoneyCharge(afId, afPw, Id, Pw, price) {
		try {
			const result = await mysqlWrite.query(`INSERT INTO charged_star_ballon (platform, afreecaId, platformId, chared_price, complete_chared_price, success, failed_price) VALUES ('HM', '${afId}', '${Id}', ${price}, 0, 2, 0)`);
			const insertedId = result[0].insertId;
			await happyMoneyCharger(afId, afPw, Id, Pw, price, insertedId)
			return 'data';
		} catch (e) {
			console.log(e);
		}
	}
	
}

const ChargeModel = new Charge();

export { ChargeModel };

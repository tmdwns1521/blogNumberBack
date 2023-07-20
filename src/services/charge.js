import {ChargeModel} from '../db/index.js';


class Charge {
	// 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
	constructor(ChargeModel) {
		this.ChargeModel = ChargeModel;
	}

	async AfreecaCharge(afId, afPw, price) {
		return await this.ChargeModel.AfreecaCharge(afId, afPw, price);
	}
	async CultureLandCharge(afId, afPw, Id, Pw, price) {
		return await this.ChargeModel.CultureLandCharge(afId, afPw, Id, Pw, price);
	}
	async BookAndLifeCharge(afId, afPw, Id, Pw, price) {
		return await this.ChargeModel.BookAndLifeCharge(afId, afPw, Id, Pw, price);
	}
	async HappyMoneyCharge(afId, afPw, Id, Pw, price) {
		return await this.ChargeModel.HappyMoneyCharge(afId, afPw, Id, Pw, price);
	}

	async serialRegist(chargePrice, couponDatas){
		return await this.ChargeModel.serialRegist(chargePrice, couponDatas);
	}

	async chargeOnAir(){
		return await this.ChargeModel.chargeOnAir();
	}

	async couponList() {
		return await this.ChargeModel.couponList();
	}

}

const chargeService = new Charge(ChargeModel);

export { chargeService };

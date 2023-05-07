import { consultingModel } from '../db/index.js';

class ConsultingService {
	// 본 파일의 맨 아래에서, new UserService(userModel) 하면, 이 함수의 인자로 전달됨
	constructor(consultingModel) {
		this.consultingModel = consultingModel;
	}

	async Consulting(data) {
		const consulting = await this.consultingModel.counsulting(data);
		return consulting;
	}

	async Consultings() {
		const consulting = await this.consultingModel.counsultings();
		return consulting;
	}
	

	// 카테고리 목록을 받음.
	async getCategories() {
		const Bigcategory = await this.categoryModel.findAll();
		return Bigcategory;
	}
}

const consultingService = new ConsultingService(consultingModel);

export { consultingService };

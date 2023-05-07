import { model } from 'mongoose';
import { categorySchema } from '../schemas/category-schema';

const Category = model('category', categorySchema);

export class CategoryModel {
	async create(category_info) {
		const createdNewUser = await Category.create(category_info);
		return createdNewUser;
	}

	async findAll() {
		const categorys = await Category.find({});
		return categorys;
	}

	async findOne(Bcategory) {
		const Onecategory = await Category.findOne({ name: Bcategory });
		return Onecategory;
	}
}

const categoryModel = new CategoryModel();

export { categoryModel };

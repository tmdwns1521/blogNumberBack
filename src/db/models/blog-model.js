import {mysqlRead, mysqlWrite} from '../../config/database.js';


export class BlogModel {
	async getBlogs() {
		// const blogs = await mysqlRead.query('SELECT COUNT(*) FROM check_blog');
		const [ blogs, checkBlogs, checkBLogsOn, OptimizationBlogs, OptimizationBlogsOn, UsedBlogs, UsedBlogsOn] = await Promise.all([
			mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_marketing = 0'),
			mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_check <> 0 AND is_marketing = 0'),
			mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_check = 1 AND is_marketing = 0'),
			mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_Optimization <> 0 AND is_marketing = 0'),
		  	mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_Optimization = 1 AND is_marketing = 0'),
			mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_used <> 0 AND is_marketing = 0'),
		  	mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_used = 1 AND is_marketing = 0')
		]);
		const blogsCount = blogs[0][0]['COUNT(*)'];
		const checkBlogsCount = checkBlogs[0][0]['COUNT(*)'];
		const checkBLogsOnCount = checkBLogsOn[0][0]['COUNT(*)'];
		const OptimizationBlogsCount = OptimizationBlogs[0][0]['COUNT(*)'];
		const OptimizationBlogsOnCount = OptimizationBlogsOn[0][0]['COUNT(*)'];
		const UsedBlogsCount = UsedBlogs[0][0]['COUNT(*)'];
		const UsedBlogsOnCount = UsedBlogsOn[0][0]['COUNT(*)'];

		return {
			"blogs": blogsCount,
			"checkBlogsCount": checkBlogsCount,
			"checkBLogsOnCount": checkBLogsOnCount,
			"OptimizationBlogsCount": OptimizationBlogsCount,
			"OptimizationBlogsOnCount": OptimizationBlogsOnCount,
			"UsedBlogsCount": UsedBlogsCount,
			"UsedBlogsOnCount": UsedBlogsOnCount
		};
	}

	async getCheckBlogs() {
		const [checkBlogs, checkBLogsOn] = await Promise.all([
		  mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_check <> 0 AND is_marketing = 0'),
		  mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_check = 1 AND is_marketing = 0')
		]);

		const checkBlogsCount = checkBlogs[0][0]['COUNT(*)'];
		const checkBLogsOnCount = checkBLogsOn[0][0]['COUNT(*)'];

		return { "checkBlogsCount": checkBlogsCount, "checkBLogsOnCount": checkBLogsOnCount };
	}

	async getOptimizationBlogs() {
		const [OptimizationBlogs, OptimizationBlogsOn] = await Promise.all([
		  mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_Optimization <> 0 AND is_marketing = 0'),
		  mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_Optimization = 1 AND is_marketing = 0')
		]);

		const OptimizationBlogsCount = OptimizationBlogs[0][0]['COUNT(*)'];
		const OptimizationBlogsOnCount = OptimizationBlogsOn[0][0]['COUNT(*)'];

		return { "OptimizationBlogsCount": OptimizationBlogsCount, "OptimizationBlogsOnCount": OptimizationBlogsOnCount };
	}

	async getUsedBlogs() {
		const [UsedBlogs, UsedBlogsOn] = await Promise.all([
		  mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_used <> 0 AND is_marketing = 0'),
		  mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_used = 1 AND is_marketing = 0')
		]);

		const UsedBlogsCount = UsedBlogs[0][0]['COUNT(*)'];
		const UsedBlogsOnCount = UsedBlogsOn[0][0]['COUNT(*)'];

		return { "UsedBlogsCount": UsedBlogsCount, "UsedBlogsOnCount": UsedBlogsOnCount };
	}

	async getNumberBlogs() {
		const NumberBlogs = await mysqlRead.query('SELECT * FROM check_blog WHERE is_used = 1 AND is_marketing = 0');

		return {"NumberBlogs": NumberBlogs[0] };
	}

	async getNumberBlogsText() {
		const NumberBlogs = await mysqlRead.query('SELECT * FROM check_blog WHERE is_used = 1 AND is_marketing = 0');
		const NumberIds = NumberBlogs[0].map((e) => e.id).join(',');
		mysqlWrite.query(`UPDATE check_blog SET is_marketing = 2 WHERE id IN (${NumberIds})`);
		return {"NumberBlogs": NumberBlogs[0] };
	}







	async findById(userId) {
		const user = await User.findOne({ _id: userId });
		return user;
	}

	async create(userInfo) {
		const { email, fullName, password, provider } = userInfo;
		const result = await mysqlWrite.query('')
		return await User.create(userInfo);
	}

	async findAll() {
		const users = await User.find({});
		return users;
	}

	async update({ userId, update }) {
		const filter = { _id: userId };
		const option = { returnOriginal: false };

		const updatedUser = await User.findOneAndUpdate(filter, update, option);
		return updatedUser;
	}

	async updateByEmail({ email, update }) {
		const filter = { email };
		const option = { returnOriginal: false };

		const updatedUser = await User.findOneAndUpdate(filter, update, option);
		return updatedUser;
	}

	async delete(userId) {
		await User.deleteOne({ _id: userId });
		return;
	}
}

const blogModel = new BlogModel();

export { blogModel };
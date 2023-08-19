import {mysqlRead, mysqlWrite, mysqlWriteServer, mysqlReadServer} from '../../config/database.js';


export class BlogModel {
	async getBlogs() {
		try {
			console.log('조회중');
			// const blogs = await mysqlRead.query('SELECT COUNT(*) FROM check_blog');
			const [ UsedBlogs, UsedBlogsOn] = await Promise.all([
				// mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_marketing = 0'),
				// mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_check <> 0 AND is_marketing = 0'),
				// mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_check = 1 AND is_marketing = 0'),
				// mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_Optimization <> 0 AND is_marketing = 0'),
				// mysqlRead.query('SELECT COUNT(*) FROM check_blog WHERE is_Optimization = 1 AND is_marketing = 0'),
				mysqlReadServer.query('SELECT COUNT(*) FROM check_blog WHERE is_used <> 0 AND is_marketing = 0'),
				mysqlReadServer.query('SELECT COUNT(*) FROM check_blog WHERE is_used = 1 AND is_marketing = 0')
			]);
			// const blogsCount = blogs[0][0]['COUNT(*)'];
			// const checkBlogsCount = checkBlogs[0][0]['COUNT(*)'];
			// const checkBLogsOnCount = checkBLogsOn[0][0]['COUNT(*)'];
			// const OptimizationBlogsCount = OptimizationBlogs[0][0]['COUNT(*)'];
			// const OptimizationBlogsOnCount = OptimizationBlogsOn[0][0]['COUNT(*)'];
			const UsedBlogsCount = UsedBlogs[0][0]['COUNT(*)'];
			const UsedBlogsOnCount = UsedBlogsOn[0][0]['COUNT(*)'];

			return {
				// "blogs": blogsCount,
				// "checkBlogsCount": checkBlogsCount,
				// "checkBLogsOnCount": checkBLogsOnCount,
				// "OptimizationBlogsCount": OptimizationBlogsCount,
				// "OptimizationBlogsOnCount": OptimizationBlogsOnCount,
				"UsedBlogsCount": UsedBlogsCount,
				"UsedBlogsOnCount": UsedBlogsOnCount
			};
		} catch (e) {
			return e
		}

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
		const NumberBlogs = await mysqlReadServer.query('SELECT * FROM check_blog WHERE is_used = 1 AND is_marketing = 0');

		return {"NumberBlogs": NumberBlogs[0] };
	}

	async getNumberBlogsText() {
		try {
			const NumberBlogs = await mysqlReadServer.query('SELECT * FROM check_blog WHERE is_used = 1 AND is_marketing = 0');
			const NumberIds = NumberBlogs[0].map((e) => e.id).join(',');
			mysqlWriteServer.query(`UPDATE check_blog SET is_marketing = 2 WHERE id IN (${NumberIds})`);
			return {"NumberBlogs": NumberBlogs[0] };
		} catch (e) {
			return e;
		}

	}

	async blogRankData(req) {
		try {
			let { blog_url, keyword, manager, company_name, registration_date, type, serviceCount, sales, work_detail } = req
			sales = sales.replaceAll(',', '');
			const query = `INSERT INTO blogRankManagement (blog_url, keyword, manager, company_name, registration_date, type, serviceCount, sales, work_detail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
			const rs = await mysqlWriteServer.query(query, [blog_url, keyword, manager, company_name, registration_date, type, serviceCount, sales, work_detail]);
			return rs[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async getBlogRankData() {
		try {
			const rs = await mysqlReadServer.query('SELECT * FROM blogRankManagement');
			return rs[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}
}

const blogModel = new BlogModel();

export { blogModel };
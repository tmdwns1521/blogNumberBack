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
			let { blog_url, keyword, manager, company_name, registration_date, type, serviceCount, sales, work_detail, smart_link } = req
			sales = sales.replaceAll(',', '');
			const query = `INSERT INTO blogRankManagement (blog_url, keyword, manager, company_name, registration_date, type, serviceCount, sales, work_detail, smartlink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			const rs = await mysqlWriteServer.query(query, [blog_url, keyword, manager, company_name, registration_date, type, serviceCount, sales, work_detail, smart_link]);
			return rs[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async placeRankData(req) {
		try {
			let { company_name, keyword, placeNumber, work_detail } = req
			const query = `INSERT INTO placeRankManagement (company_name, keyword, placeNumber, work_detail) VALUES (?, ?, ?, ?)`
			const rs = await mysqlWriteServer.query(query, [company_name, keyword, placeNumber, work_detail]);
			return rs[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async removeBlogRankData(id) {
		try {
			const query = `DELETE FROM blogRankManagement WHERE id = ?`
			const rs = await mysqlWriteServer.query(query, id);
			const querys = `DELETE FROM blogRankRecord WHERE blog_id = ?`
			const rss = await mysqlWriteServer.query(querys, id);
			return rss[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async removePlaceRankData(id) {
		try {
			const query = `DELETE FROM placeRankManagement WHERE id = ?`
			const rs = await mysqlWriteServer.query(query, id);
			const querys = `DELETE FROM placeRankRecord WHERE placeNumber = ?`
			const rss = await mysqlWriteServer.query(querys, id);
			return rss[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async extendBlogRankData(id) {
		try {
			const query = `UPDATE blogRankManagement SET serviceCount = ?, extend_cnt = extend_cnt + 1 WHERE id = ?`
			await mysqlWriteServer.query(query, [25, id]);
			const querys = `DELETE FROM blogRankRecord WHERE blog_id = ?`
			const rss = await mysqlWriteServer.query(querys, id);
			return rss[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}


	async updateBlogRankData(req) {
		try {
			let { id, blog_url, keyword, manager, company_name, registration_date, type, serviceCount, sales, work_detail, smartlink } = req
			const query = `UPDATE blogRankManagement SET blog_url = ?, keyword = ?, manager = ?, company_name = ?, registration_date = ?, type = ?, serviceCount = ?, sales = ?, work_detail = ?, smartlink = ? WHERE id = ?`
			const rs = await mysqlWriteServer.query(query, [blog_url, keyword, manager, company_name, registration_date, type, serviceCount, sales, work_detail, smartlink, id]);
			return rs[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async updatePlaceRankData(req) {
		try {
			let { id, keyword, company_name, placeNumber, work_detail } = req
			const query = `UPDATE placeRankManagement SET keyword = ?, company_name = ?, placeNumber = ?, work_detail = ? WHERE id = ?`
			const rs = await mysqlWriteServer.query(query, [keyword, company_name, placeNumber, work_detail, id]);
			return rs[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async checkDeposit(req) {
		try {
			let { id, checkDeposit } = req
			const query = `UPDATE blogRankManagement SET checkDeposit = ? WHERE id = ?`
			const rs = await mysqlWriteServer.query(query, [checkDeposit, id]);
			return rs[0];
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async getBlogRankData() {
		try {
			const now = new Date();
			const year = now.getFullYear();  // 연도 (e.g., 2023)
			const month = now.getMonth() + 1;  // 월 (0부터 시작하므로 1을 더해줌)
			const day = now.getDate();  // 일

			const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
			const rs = await mysqlReadServer.query(`SELECT * FROM blogRankManagement` );
			let ids = rs[0].map(item => item.id);
			ids = ids.join(',');
			const blog_ranks = await mysqlReadServer.query(`SELECT * FROM blogRankRecord WHERE blog_id IN (${ids})` );
			rs[0].forEach((item) => {
				const blog_filter = blog_ranks[0].filter(e => e.blog_id === item.id && e.rank <= 5 && e.rank > 0 && String(e.updatedAt).includes(formattedDate) === false);
				item.count = blog_filter.length;
			})
			return {blogs: rs[0], blog_ranks : blog_ranks[0]};
		} catch (e) {
			console.log(e);
			return e;
		}
	}

	async getPlaceRankData() {
		try {
			const now = new Date();
			const year = now.getFullYear();  // 연도 (e.g., 2023)
			const month = now.getMonth() + 1;  // 월 (0부터 시작하므로 1을 더해줌)
			const day = now.getDate();  // 일

			const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
			const rs = await mysqlReadServer.query(`SELECT * FROM placeRankManagement` );
			let ids = rs[0].map(item => item.placeNumber);
			ids = ids.join(',');
			const place_ranks = await mysqlReadServer.query(`SELECT * FROM placeRankRecord WHERE placeNumber IN (${ids})` );
			rs[0].forEach((item) => {
				const place_filter = place_ranks[0].filter(e => e.placeNumber === item.id && e.rank <= 5 && e.rank > 0 && String(e.updatedAt).includes(formattedDate) === false);
				item.count = place_filter.length;
			})
			return {places: rs[0], place_ranks : place_ranks[0]};
		} catch (e) {
			console.log(e);
			return e;
		}
	}
}

const blogModel = new BlogModel();

export { blogModel };
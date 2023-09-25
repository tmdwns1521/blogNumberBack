import { Router } from 'express';
import { blogService } from '../services/index.js';
import dotenv from 'dotenv';
import { OnblogRank } from '../crawler/blogRank.js';
import { OnPlaceRank } from '../crawler/placeRank.js';

dotenv.config();

const blogRouter = Router();

blogRouter.get('/rankingCheck', async (req, res, next) => {
	try {
		await OnblogRank();
		res.status(201).json("result: sucess");
	} catch (error) {
		next(error);
	}
});

blogRouter.get('/placeRankingCheck', async (req, res, next) => {
	try {
		await OnPlaceRank();
		res.status(201).json("result: sucess");
	} catch (error) {
		next(error);
	}
});

// 전체 블로그 갯수
blogRouter.get('/getBlogs', async (req, res, next) => {
	try {
		const data = await blogService.getBlogs();
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

// 블로그 16년도 이전 블로그 체크
blogRouter.get('/getCheckBlogs', async (req, res, next) => {
	try {
		const data = await blogService.getCheckBlogs();
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

// 블로그 최적화 체크
blogRouter.get('/getOptimizationBlogs', async (req, res, next) => {
	try {
		const data = await blogService.getOptimizationBlogs();
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

// 블로그 최적화 체크
blogRouter.get('/getUsedBlogs', async (req, res, next) => {
	try {
		const data = await blogService.getUsedBlogs();
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

// 블로그 번호 리스트
blogRouter.get('/getNumberBlogs', async (req, res, next) => {
	try {
		const data = await blogService.getNumberBlogs();
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

// 번호 엑셀 추출

blogRouter.get('/download-text', async (req, res) => {
	console.log('다운로드 시작1');
	const data = await blogService.getNumberBlogsText();
	console.log('다운로드 시작2');
	let textData = '';

	data.NumberBlogs.forEach((e) => {
		textData += `${e.blog_id}\t${e.number}\t${e.logic}\n`
	})
	// 다운로드 링크 제공
	res.set({
		'Content-Disposition': 'attachment; filename="example.txt"',
		'Content-Type': 'text/plain',
	});
	res.send(textData);
});

blogRouter.post('/blogRankData', async (req, res, next) => {
	try {
		const data = await blogService.blogRankData(req.body);
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/placeRankData', async (req, res, next) => {
	try {
		const data = await blogService.placeRankData(req.body);
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/checkDeposit', async (req, res, next) => {
	try {
		const data = await blogService.checkDeposit(req.body);
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/updateBlogRankData', async (req, res, next) => {
	try {
		const data = await blogService.updateBlogRankData(req.body);
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/updatePlaceRankData', async (req, res, next) => {
	try {
		const data = await blogService.updatePlaceRankData(req.body);
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/removeBlogRankData', async (req, res, next) => {
	try {
		const data = await blogService.removeBlogRankData(req.body.id);
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/removePlaceRankData', async (req, res, next) => {
	try {
		const data = await blogService.removePlaceRankData(req.body.id);
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

blogRouter.post('/extendBlogRankData', async (req, res, next) => {
	try {
		const data = await blogService.extendBlogRankData(req.body.id);
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

blogRouter.get('/getBlogRankData', async (req, res, next) => {
	try {
		const data = await blogService.getBlogRankData();
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

blogRouter.get('/getPlaceRankData', async (req, res, next) => {
	try {
		const data = await blogService.getPlaceRankData();
		res.status(201).json(data);
	} catch (error) {
		next(error);
	}
});

export { blogRouter };
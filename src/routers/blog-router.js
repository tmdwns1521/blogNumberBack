import { Router } from 'express';
import { blogService } from '../services/index.js';
import dotenv from 'dotenv';
dotenv.config();

const blogRouter = Router();

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

// 새로운 가축
blogRouter.post('/createNew', async function (req, res, next) {
	try {
		const result = await userService.addUser(req.body);
		res.status(200).json(result);
	} catch (error) {
		next(error);
	}
});



export { blogRouter };
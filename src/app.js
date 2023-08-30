import cors from 'cors';
import express from 'express';
import {
	blogRouter,
	userRouter,
} from './routers/index.js';
const app = express();

import cron from 'node-cron';
import migrateData from '../src/utils/migration.js'; // 마이그레이션 함수가 있는 파일 경로로 변경해야 합니다.
import { OnblogRank } from './crawler/blogRank.js';

// '0 12 * * *'은 매일 12시 0분에 실행됨을 의미합니다.
// cron.schedule('0 0 * * *', async () => {
//     try {
//         console.log('Starting data blogCrawler...');
//         console.log(new Date());
//         await OnblogRank();
//         console.log('Data blogCrawler completed.');
//     } catch (error) {
//         console.error('Error during scheduled migration:', error);
//     }
// });
//
// cron.schedule('0 12 * * *', async () => {
//     try {
//         console.log('Starting data blogCrawler...');
//         console.log(new Date());
//         await OnblogRank();
//         console.log('Data blogCrawler completed.');
//     } catch (error) {
//         console.error('Error during scheduled migration:', error);
//     }
// });

cron.schedule('0 12 * * *', async () => {
    try {
        console.log('Starting migration blogCrawler...');
        console.log(new Date());
        await migrateData();
        console.log('Data blogCrawler completed.');
    } catch (error) {
        console.error('Error during scheduled migration:', error);
    }
});
// cron.schedule('*/10 * * * *', async () => {
//     try {
//         console.log('Starting data blogCrawler...');
//         console.log(new Date());
//         await OnblogRank();
//         console.log('Data blogCrawler completed.');
//     } catch (error) {
//         console.error('Error during scheduled migration:', error);
//     }
// });
// CORS 에러 방지
app.use(cors());

// Content-Type: application/json 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.json());

// Content-Type: application/x-www-form-urlencoded 형태의 데이터를 인식하고 핸들링할 수 있게 함.
app.use(express.urlencoded({ extended: false }));

// html, css, js 라우팅
// app.use(viewsRouter);
app.use('/blog', blogRouter);
app.use('/user', userRouter);

export { app };

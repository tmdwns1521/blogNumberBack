import axios from 'axios';

import {mysqlWriteServer, mysqlReadServer} from '../config/database.js';

async function blogRankData() {
    const blogRankQuery = 'SELECT * FROM blogRankManagement';
    const rs = await mysqlReadServer.query(blogRankQuery);
    return rs[0]
}

async function delay(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

async function blogViewCrawler(item) {
    let my_url = item.blog_url.split(',').pop();
    let rankCheck = true;
    let page = 1;
    let ranking = 99;
    while (rankCheck) {
        try {
            if (page > 100) {
                rankCheck = false;
            }
            let pageSource = await axios.get(`https://s.search.naver.com/p/review/search.naver?rev=44&where=view&api_type=11&start=${page}&query=${item.keyword}&nso=&nqx_theme=&main_q=&mode=normal&q_material=&ac=1&aq=1&spq=0&st_coll=&topic_r_cat=&nx_search_query=&nx_and_query=&nx_sub_query=&prank=61&sm=tab_jum&ssc=tab.view.view&ngn_country=KR&lgl_rcode=09620101&fgn_region=&fgn_city=&lgl_lat=37.4779619&lgl_long=126.9534602&abt=&_callback=viewMoreContents`);
            pageSource = pageSource.data;
            pageSource = pageSource.split('class=\\"btn_save _keep_trigger\\"')
            pageSource = pageSource.map((item) => item.split('onclick=')[0].split('\\"')[1].split('\\')[0]);
            const rank = pageSource.indexOf(my_url) - 1;
            // console.log(rank);
            // console.log(pageSource);
            if (rank >= 0) {
                ranking = rank + page;
                break;
            } else {
                page += 30;
            }
            await delay(2);
        } catch (e) {
            break;
        }

    }
    await mysqlWriteServer.query(`UPDATE blogRankManagement SET \`rank\` = ${ranking} WHERE id = ${item.id}`);
    const now = new Date();
    const year = now.getFullYear();  // 연도 (e.g., 2023)
    const month = now.getMonth() + 1;  // 월 (0부터 시작하므로 1을 더해줌)
    const day = now.getDate();  // 일

    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    const SelectRankingQuery = await mysqlReadServer.query(`SELECT * FROM blogRankRecord WHERE blog_id = ? AND DATE_FORMAT(updatedAt, \'%Y-%m-%d\') = \'${formattedDate}\' LIMIT 1`, item.id);
    if (SelectRankingQuery[0].length > 0) {
        const gap = SelectRankingQuery[0][0].rank - ranking;
        const RankingQuery = 'UPDATE blogRankRecord SET \`rank\` = ?, gap = ?, updatedAt = ? WHERE blog_id = ?'
        await mysqlWriteServer.query(RankingQuery, [ranking, gap, now, item.id]);
    } else {
        const RankingQuery = 'INSERT INTO blogRankRecord (blog_id, \`rank\`, updatedAt) VALUES (?, ?, ?)';
        await mysqlWriteServer.query(RankingQuery, [item.id, ranking, now]);
    }
}
async function smartBlock(data) {
    console.log('aa');
}
async function blogrankCrawler(data) {
    for (const item of data) {
        console.log(item.blog_url.split(',').pop())
        if (item.type === 0 && item.blog_url.split(',').pop() !== '') {
            // console.log(item);
            blogViewCrawler(item);
            await delay(2);
        } else if (item.type === 1 && item.blog_url.split(',').pop() !== '') {
            smartBlock(item)
        }
    }
}

async function OnblogRank() {
    const data = await blogRankData()
    await blogrankCrawler(data);
}

OnblogRank();
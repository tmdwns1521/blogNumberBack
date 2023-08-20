import axios from 'axios';

import {mysqlWriteServer, mysqlReadServer} from '../config/database.js';
const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Seoul' };
export async function blogRankData() {
    const blogRankQuery = 'SELECT * FROM blogRankManagement';
    const rs = await mysqlReadServer.query(blogRankQuery);
    return rs[0]
}

export async function delay(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

export async function blogViewCrawler(item) {
    let my_url = item.blog_url?.split(',').pop();
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
            console.log(rank);
            // console.log(pageSource);
            if (rank >= 0) {
                ranking = rank + page;
                break;
            } else {
                page += 30;
            }
            await delay(2);
        } catch (e) {
            console.log(e);
            break;
        }

    }
    console.log('1');
    await mysqlWriteServer.query(`UPDATE blogRankManagement SET \`rank\` = ${ranking} WHERE id = ${item.id}`);
    let now = new Date().toLocaleString('ko-KR', options).replaceAll('.', '');
    now = now.split(' ');
    now = `${now[0]}-${now[1]}-${now[2]} ${now[3]}`
    console.log(now);

    const formattedDate = `${now.split(' ')[0]}`



    const SelectRankingQuery = await mysqlReadServer.query(`SELECT * FROM blogRankRecord WHERE blog_id = ? AND DATE_FORMAT(updatedAt, \'%Y-%m-%d\') = \'${formattedDate}\' LIMIT 1`, item.id);
    console.log(SelectRankingQuery[0]);
    if (SelectRankingQuery[0].length > 0) {
        const gap = SelectRankingQuery[0][0].rank - ranking;
        const RankingQuery = `UPDATE blogRankRecord SET \`rank\` = ?, gap = ?, updatedAt = ? WHERE blog_id = ? AND DATE_FORMAT(updatedAt, \'%Y-%m-%d\') = \'${formattedDate}\'`
        await mysqlWriteServer.query(RankingQuery, [ranking, gap, now, item.id]);
        console.log('VIEW 업데이트')
    } else {
        const RankingQuery = 'INSERT INTO blogRankRecord (blog_id, \`rank\`, updatedAt) VALUES (?, ?, ?)';
        await mysqlWriteServer.query(RankingQuery, [item.id, ranking, now]);
        console.log('VIEW 삽입')
    }
    console.log('2');
}
export async function smartBlock(data) {
    const my_url = data.blog_url.split(',').pop();
    let pageSource = await axios.get(data.smartlink);
    let ranking = 99
    pageSource = pageSource.data;
    pageSource = pageSource.split('title_area');
    pageSource = pageSource.map((item) => item.split('onclick')[0].split('href=')[1].split('"')[1]);
    pageSource = pageSource.filter(item => item !== '#');
    const rank = pageSource.indexOf(my_url);
    if (rank > 0) {
        ranking = rank;
    }
    console.log('3');
    await mysqlWriteServer.query(`UPDATE blogRankManagement SET \`rank\` = ${ranking} WHERE id = ${data.id}`);
    let now = new Date().toLocaleString('ko-KR', options).replaceAll('.', '');
    now = now.split(' ');
    now = `${now[0]}-${now[1]}-${now[2]} ${now[3]}`
    console.log(now);

    const formattedDate = `${now.split(' ')[0]}`
    console.log(formattedDate)

    const SelectRankingQuery = await mysqlReadServer.query(`SELECT * FROM blogRankRecord WHERE blog_id = ? AND DATE_FORMAT(updatedAt, \'%Y-%m-%d\') = \'${formattedDate}\' LIMIT 1`, data.id);
    console.log(SelectRankingQuery[0]);
    if (SelectRankingQuery[0].length > 0) {
        const gap = SelectRankingQuery[0][0].rank - ranking;
        const RankingQuery = `UPDATE blogRankRecord SET \`rank\` = ?, gap = ?, updatedAt = ? WHERE blog_id = ? AND DATE_FORMAT(updatedAt, \'%Y-%m-%d\') = \'${formattedDate}\'`
        await mysqlWriteServer.query(RankingQuery, [ranking, gap, now, data.id]);
        console.log('스마트블록 업데이트')
    } else {
        const RankingQuery = 'INSERT INTO blogRankRecord (blog_id, \`rank\`, updatedAt) VALUES (?, ?, ?)';
        await mysqlWriteServer.query(RankingQuery, [data.id, ranking, now]);
        console.log('스마트블록 삽입')
    }
    console.log('4');
}
export async function blogrankCrawler(data) {
    for (const item of data) {
        if (item.type === 0 && item.blog_url.split(',').pop() !== '') {
            // console.log(item);
            blogViewCrawler(item);
            await delay(2);
        } else if (item.type === 1 && item.blog_url.split(',').pop() !== '' && item.smartlink) {
            smartBlock(item)
            await delay(2);
            // break
        } else {
            let now = new Date().toLocaleString('ko-KR', options).replaceAll('.', '');
            now = now.split(' ');
            now = `${now[0]}-${now[1]}-${now[2]} ${now[3]}`

            const formattedDate = `${now.split(' ')[0]}`
            const SelectRankingQuery = await mysqlReadServer.query(`SELECT * FROM blogRankRecord WHERE blog_id = ? AND DATE_FORMAT(updatedAt, \'%Y-%m-%d\') = \'${formattedDate}\' LIMIT 1`, item.id);
            console.log(SelectRankingQuery[0]);
            if (SelectRankingQuery[0].length > 0) {
                const gap = SelectRankingQuery[0][0].rank - ranking;
                const RankingQuery = `UPDATE blogRankRecord SET \`rank\` = ?, gap = ?, updatedAt = ? WHERE blog_id = ? AND DATE_FORMAT(updatedAt, \'%Y-%m-%d\') = \'${formattedDate}\'`
                await mysqlWriteServer.query(RankingQuery, [99, gap, now, item.id]);
                console.log('NO 업데이트')
            } else {
                const RankingQuery = 'INSERT INTO blogRankRecord (blog_id, \`rank\`, updatedAt) VALUES (?, ?, ?)';
                await mysqlWriteServer.query(RankingQuery, [item.id, 99, now]);
                console.log('NO 삽입')
            }
            console.log('4');
        }
    }
}

export async function OnblogRank() {
    const data = await blogRankData()
    await blogrankCrawler(data);
}
import axios from 'axios';

import {mysqlWriteServer, mysqlReadServer} from '../config/database.js';

async function blogRankData() {
    const blogRankQuery = 'SELECT * FROM blogRankManagement';
    const rs = await mysqlReadServer.query(blogRankQuery);
    return rs[0]
}

async function blogViewCrawler(item) {
    let pageSource = await axios.get('https://s.search.naver.com/p/review/search.naver?rev=44&where=view&api_type=11&start=61&query=%EC%BD%98%ED%85%90%EC%B8%A0%EC%9D%B4%EC%9A%A9%EB%A3%8C%ED%98%84%EA%B8%88%ED%99%94&nso=&nqx_theme=&main_q=&mode=normal&q_material=&ac=1&aq=1&spq=0&st_coll=&topic_r_cat=&nx_search_query=&nx_and_query=&nx_sub_query=&prank=61&sm=tab_jum&ssc=tab.view.view&ngn_country=KR&lgl_rcode=09620101&fgn_region=&fgn_city=&lgl_lat=37.4779619&lgl_long=126.9534602&abt=&_callback=viewMoreContents');
    pageSource = pageSource.data;
    const jsonStartIndex = pageSource.indexOf('{"total"'); // JSON 객체의 시작 인덱스
    const jsonEndIndex = pageSource.lastIndexOf('}') + 1; // JSON 객체의 끝 인덱스

    const jsonString = pageSource.substring(jsonStartIndex, jsonEndIndex);
    const jsonObject = JSON.parse(jsonString);

    const htmlValue = jsonObject.html;
    console.log(htmlValue);
}
async function blogrankCrawler(data) {
    data.forEach((item) => {
        blogViewCrawler(item);
    })
}

async function OnblogRank() {
    const data = await blogRankData()
    await blogrankCrawler(data);
}

OnblogRank();
import { mysqlRead, mysqlWriteServer } from '../config/database.js';

async function migrateData() {
    const sourceDB = mysqlRead;
    const targetDB = mysqlWriteServer;

    try {
        const batchSize = 1000; // 배치 크기 설정
        let offset = 0;

        const connection = await targetDB.getConnection();
        await connection.beginTransaction(); // 트랜잭션 시작

        while (true) {
            const [rows] = await sourceDB.query('SELECT * FROM check_blog WHERE is_used <> 0 AND is_marketing <> 1 LIMIT ?, ?', [offset, batchSize]);
            console.log(rows);

            if (rows.length === 0) {
                break; // 더 이상 데이터가 없으면 종료
            }

            for (const row of rows) {
                const [existingRow] = await connection.query('SELECT * FROM check_blog WHERE blog_id = ?', [row.blog_id]);

                if (existingRow.length > 0) {
                    // UPDATE 쿼리 실행
                    const updateQuery = `
                        UPDATE check_blog 
                        SET is_check = ?, createdAt = ?, is_Optimization = ?, is_used = ?, logic = ?, number = ? 
                        WHERE blog_id = ?
                    `;
                    const updateParams = [
                        row.is_check, row.createdAt, row.is_Optimization, row.is_used, row.logic, row.number,
                        row.blog_id
                    ];
                    await connection.query(updateQuery, updateParams);
                } else {
                    // INSERT 쿼리 실행
                    const insertQuery = `
                        INSERT INTO check_blog (is_check, createdAt, blog_id, is_Optimization, is_used, logic, number, is_marketing) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const insertParams = [
                        row.is_check, row.createdAt, row.blog_id, row.is_Optimization, row.is_used, row.logic, row.number, row.is_marketing
                    ];
                    await connection.query(insertQuery, insertParams);
                }
            }

            offset += batchSize;
        }

        await connection.commit(); // 트랜잭션 커밋
        connection.release(); // 커넥션 반환
    } catch (error) {
        console.error('Error during migration:', error);
        if (connection) {
            await connection.rollback(); // 롤백 처리
            connection.release(); // 커넥션 반환
        }
    } finally {
        await sourceDB.end();
        await targetDB.end();
    }
}

export default migrateData;

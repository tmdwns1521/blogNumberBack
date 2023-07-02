import { sleep, By } from './selenium.js';

const is_login = async (driver) => {
    try {
        // 별풍선 충전 페이지 이동
        await driver.get('https://www.afreecatv.com/')

        await sleep(2);
        // 로그인 완료 확인
        const btnLogin = await driver.findElement(By.className('btn-login'));
        const isLogin = await btnLogin.getText();

        await sleep(2);
        return isLogin !== '로그인';
    } catch (e) {
        console.log(e);
    }
}
const afreeca_login = async (driver, id, pw) => {
    try {
        await driver.get('https://login.afreecatv.com/afreeca/login.php?szFrom=full&request_uri=https%3A%2F%2Fwww.afreecatv.com%2F')

        await sleep(3);

        // Id 입력
        const IdBox = await driver.findElement(By.id('uid'));
        await IdBox.sendKeys(id);

        await sleep(1.5);

        // Pw 입력
        const PwBox = await driver.findElement(By.id('password'));
        await PwBox.sendKeys(pw);

        await sleep(1.5);

        // 로그인 완료
        const loginBtn = await driver.findElement(By.className('login_btn'));
        loginBtn.click();


        await sleep(3);

        try {
            await driver.switchTo().alert().accept(); // 알림창 확인
        } catch (error) {
            // 알림창 처리 실패 시 예외 처리
            // console.log('알림창 처리 실패:', error);
        }
        await sleep(1.5);
    } catch (e) {
        console.log(e);
    }
};

export { is_login, afreeca_login };

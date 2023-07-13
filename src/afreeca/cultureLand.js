import {createDriver} from "./selenium.js";
import {afreeca_login, is_login} from "./afreecaStart.js";
import { sleep, By } from './selenium.js';
import {
    buy_btn,
    popup_handle,
    adClear,
    checkBoxOn,
    payment,
    paymentCheck,
    last_handle,
    finallyPaymentCheck
} from "./charge.js";
import {mysqlWrite} from "../config/database.js";

const cultureLandCharge = async (driver, money, id, pw, insertedId) => {
    try {
        const pointBold = await driver.findElement(By.className('point-bold'));
        let pointCnt = await pointBold.getText()
        pointCnt = Number(pointCnt.split(' ')[1].replace('개', ''));
        pointCnt = money / (pointCnt * 100);

        await sleep(1);

        const textCnt = driver.findElement(By.id('textcnt'));
        textCnt.clear();

        await sleep(1);

        try {
            await driver.switchTo().alert().accept(); // 알림창 확인
        } catch (error) {
            // 알림창 처리 실패 시 예외 처리
            // console.log('알림창 처리 실패:', error);
        }

        await sleep(1);

        textCnt.sendKeys(pointCnt);

        await sleep( 2);

        const radioColor = await driver.findElements(By.className('radio_color'));
        for (const rc of radioColor) {
            const value = await rc.getAttribute('value');
            if (value === 'culture' ) {
                rc.click();
                break
            }
        }

        await adClear(driver);

        const cultureLandId = await driver.findElement(By.name('cultureid'));
        const culturePass = await driver.findElement(By.name('culturepass'));

        await cultureLandId.sendKeys(id);

        await sleep(1);

        await culturePass.sendKeys(pw);

        await checkBoxOn(driver);

        await payment(driver);

        await last_handle(driver);

        await paymentCheck(driver);

        await last_handle(driver);

        await finallyPaymentCheck(driver, insertedId, money);

        await driver.quit();

    } catch (e) {
        console.log(e)
    }
}

const cultureLandCharger = async (afreecaId, afreecaPw, cultureId, culturePw, ChargePrice, insertedId) => {
  const driver = await createDriver();
  try {
        console.log('컬쳐 로그인 시작');
        await afreeca_login(driver, afreecaId, afreecaPw);
        const isLogin = await is_login(driver);
        if (!isLogin) {
            await mysqlWrite.query(`UPDATE charged_star_ballon SET success = 0, failed_price = ${ChargePrice}, log = "아프리카 로그인 실패" WHERE id = ${insertedId}`);
            await driver.quit();
        } else {
            await buy_btn(driver);
            await popup_handle(driver);
            await cultureLandCharge(driver, ChargePrice, cultureId, culturePw, insertedId);
        }
  } catch (e) {
      console.log(e);
    // await driver.quit();
  }
};

export { cultureLandCharger };
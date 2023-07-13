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
    scrollDown,
    finallyPaymentCheck
} from "./charge.js";
import {mysqlWrite} from "../config/database.js";

const bookandlifeCharge = async (driver, money, id, pw, insertedId) => {
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

        console.log('vv');
        const radioColor = await driver.findElements(By.className('radio_color'));
        for (const rc of radioColor) {
            const value = await rc.getAttribute('value');
            if (value === 'book' ) {
                rc.click();
                break
            }
        }

        await sleep(1.5);

        await adClear(driver);

        await sleep(1);

        let radioWb = await driver.findElements(By.className('radio_wb'));
        radioWb = await radioWb.pop()
        await driver.executeScript('arguments[0].scrollIntoView()', radioWb);
        await radioWb.click();

        await sleep(1);

        await adClear(driver);


        await scrollDown(driver);


        const tbIDForm = await driver.findElement(By.id('tbIDForm'));


        const table_td2 = await tbIDForm.findElement(By.className('table-td2'));


        const bookandlifeId = await table_td2.findElement(By.name('id'));
        const bookandlifePass = await table_td2.findElement(By.name('pwd'));


        await bookandlifeId.sendKeys(id);

        await sleep(1);

        await bookandlifePass.sendKeys(pw);


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

const bookandlifecharger = async (afreecaId, afreecaPw, bookId, bookPw, ChargePrice, insertedId) => {
  const driver = await createDriver();
  try {
        console.log('북앤 로그인 시작');
        await afreeca_login(driver, afreecaId, afreecaPw);
        const isLogin = await is_login(driver);
        if (!isLogin) {
            await mysqlWrite.query(`UPDATE charged_star_ballon SET success = 0, failed_price = ${ChargePrice}, log = "아프리카 로그인 실패" WHERE id = ${insertedId}`);
            await driver.quit();
        } else {
            await buy_btn(driver);
            await popup_handle(driver);
            await bookandlifeCharge(driver, ChargePrice, bookId, bookPw, insertedId);
        }
  } catch (e) {
      console.log(e);
    // await driver.quit();
  }
};

export { bookandlifecharger };
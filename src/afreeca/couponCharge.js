import {createDriver} from "./selenium.js";
import {afreeca_login, is_login} from "./afreecaStart.js";
import { mysqlWrite } from '../config/database.js';
import { sleep, By } from './selenium.js';
import {
    popup_handle,
    coupon_buy
} from "./charge.js";

const coupon_pop = async (driver) => {
    try {
        await sleep(2);

        const btnBuy = await driver.findElements(By.id('link_gift_banner'));
        await driver.executeScript('arguments[0].scrollIntoView()', btnBuy[0]);
        await sleep(1);
        await btnBuy[0].click();
        console.log('btnclick');

        await sleep(2);
    } catch (e) {
        console.log("coupon_pop : ", e);
    }
}
const couponCharging = async (driver, serialDb) => {
    try {
        const id = serialDb.serialNumber;
        const pw = serialDb.password;
        const serialNumber = await driver.findElement(By.name('szSNumber'));
        const Password = await driver.findElement(By.name('szPassword'));

        await serialNumber.sendKeys(id);

        await sleep(1);

        await Password.sendKeys(pw);

        await sleep(1);

        const registration = await driver.findElement(By.className('btn_st4 btn_rege_gift'))

        await registration.click()

        await sleep(1);

        try {
            const alert = await driver.switchTo().alert()
            const alertText = await alert.getText();
            await alert.accept(); // 알림창 확인
            return {'error': alertText};
        } catch (error) {
            // 알림창 처리 실패 시 예외 처리
            // console.log('알림창 처리 실패:', error);
        }
        return { "success": true }
    } catch (e) {
        console.log(e);
    }
}

const couponCharge = async (driver, serial_array, insertedId) => {
    try {
        let ballon_list = [];
        let complete_chared_price = 0;
        let failed_price = 0;
        while (serial_array.length !== 0) {
            await popup_handle(driver);
            await coupon_pop(driver);
            await popup_handle(driver);
            const serialDb = serial_array.pop();
            ballon_list.push(serialDb.id);
            const result = await couponCharging(driver, serialDb);
            if (result?.error) {
                await mysqlWrite.query(`UPDATE afreecaCoupon SET normal = 1, log = "${result.error}" WHERE id = ${serialDb.id}`)
                const close = await driver.findElement(By.className('btn_st5'));
                await close.click()
                await sleep(1);
                failed_price += serialDb.price;
            } else {
                await popup_handle(driver);
                const result = await driver.getPageSource();
                if (result.indexOf('등록') !== -1) {
                    const now = new Date();
                    const koreanOffset = 9 * 60; // 한국은 UTC+9입니다.
                    const koreanTime = new Date(now.getTime() + koreanOffset * 60000).toISOString().slice(0, 19).replace("T", " ");

                    await mysqlWrite.query(`UPDATE afreecaCoupon SET used = 1, usedAt = '${koreanTime}' WHERE id = ${serialDb.id}`);

                    const close = await driver.findElement(By.className('btn_st5'));
                    await close.click()
                    await sleep(1);
                    complete_chared_price += serialDb.price;
                }
            }
        }
        ballon_list = ballon_list.join(',')
        let success = 1;
        if (failed_price > 0) {
            success = 0;
        }
        await mysqlWrite.query(`UPDATE charged_star_ballon SET success = ${success}, complete_chared_price = ${complete_chared_price}, used_coupons = "${ballon_list}", failed_price = ${failed_price} WHERE id = ${insertedId}`);
    } catch (e) {
        console.log(e)
    }
}

const couponCharger = async (afreecaId, afreecaPw, serial_array, insertedId, price) => {
  const driver = await createDriver();
  try {
        console.log('쿠폰 로그인 시작');
        await afreeca_login(driver, afreecaId, afreecaPw);
        const isLogin = await is_login(driver);
        if (!isLogin) {
            await mysqlWrite.query(`UPDATE charged_star_ballon SET success = 0, failed_price = ${price}, log = "아프리카 로그인 실패" WHERE id = ${insertedId}`);
        } else {
            await coupon_buy(driver);
            await couponCharge(driver, serial_array, insertedId);
        }
        await driver.quit();
  } catch (e) {
      console.log(e);
    // await driver.quit();
  }
};

export { couponCharger };
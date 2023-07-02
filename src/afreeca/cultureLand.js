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

const cultureLandCharge = async (driver, money, id, pw) => {
    try {
        const pointBold = await driver.findElement(By.className('point-bold'));
        let pointCnt = await pointBold.getText()
        pointCnt = Number(pointCnt.split(' ')[1].replace('개', ''));
        console.log(pointCnt * 100);
        console.log(money);
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

        await finallyPaymentCheck(driver);

    } catch (e) {
        console.log(e)
    }
}

const run = async () => {
  const driver = await createDriver();
  try {
    await afreeca_login(driver, 'chlvuddks', 'a25986633!');
    const isLogin = await is_login(driver);
    if (!isLogin) {
        console.log('로그인 실패')
    } else {
        await buy_btn(driver);
        await popup_handle(driver);
        await cultureLandCharge(driver, 3000,'chlvuddks1','a58598295!');
    }
  } catch (e) {
      console.log(e);
    // await driver.quit();
  }
};

run();
import { sleep, By } from './selenium.js';
import { mysqlWrite, mysqlRead } from '../config/database.js';

// 구매 상품 누르기
const buy_btn = async (driver) => {
    try {
       driver.get('https://item.afreecatv.com/starballoon.php');

       await sleep(2);

       const btnBuy = await driver.findElements(By.className('btn_buy'));
       btnBuy[1].click();

       await sleep(2);

    } catch (e) {
        console.log('buy_btn', e)
    }
}

// 별풍선 쿠폰 충전
const coupon_buy = async (driver) => {
    try {
       driver.get('https://item.afreecatv.com/starballoon.php');

       await sleep(2);

    } catch (e) {
        console.log('coupon_buy', e)
    }
}

// 마지막 핸들로 변경

const last_handle = async (driver) => {
    try {
        await sleep(1);

        // 새로 열린 창의 핸들 가져오기
        const windowHandles = await driver.getAllWindowHandles();

        const lastHandle = windowHandles.pop();

        // 현재 창을 제외한 다른 창으로 전환
        await driver.switchTo().window(lastHandle);


        await sleep(2)

    } catch (e) {
        console.log('last_handle', e)
    }
}

// 팝업창 이동
const popup_handle = async (driver) => {
    try {

        await last_handle(driver);

        await sleep(1.5);
        try {
            await adClear(driver);
        } catch (e) {
            // pass
        }
    } catch (e) {
        console.log('popup_handle', e)
    }
}

const adClear = async (driver) => {
    try {
        await sleep(1);
        // 광고창 제거
        const bg = await driver.findElement(By.className('bg'))
        await driver.executeScript('arguments[0].click();', bg);

        await sleep(1);

    } catch (e) {
        // console.log("adClear", e);
    }
}

const scrollDown = async (driver) => {
    try {
        await sleep(1);

        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');

        await sleep(1);

    } catch (e) {
        console.log("scrollDown", e);
    }
}

// 결제 완료 체크박스 클릭
const checkBoxOn = async (driver) => {
    try {

        await scrollDown(driver);

        const paycont = driver.findElement(By.id('paycont'));
        const paycont1 = driver.findElement(By.id('paycont1'));

        paycont.click();

        await sleep(1);

        paycont1.click();

        await sleep(1);

    } catch (e) {
        console.log("checkBoxOn", e);
    }
}

// 결제하기 클릭
const payment = async (driver) => {
    try {

        await sleep(1);

        const paymentBtn = driver.findElement(By.className('btn_st4'));
        await paymentBtn.click();

        await sleep(1);

    } catch(e) {
        console.log("payment", e);
    }
}

// 최종 결제 누르기
const paymentCheck = async (driver) => {
    try {

        await sleep(1);

        const payCheck = await driver.findElements(By.tagName('img'));
        for (const pc of payCheck) {
            const popupbtnOk = await pc.getAttribute('src');
            if (popupbtnOk.indexOf('popupbtn_ok') !== -1) {
                pc.click();
                break;
            }
        }

        await sleep(2);

        console.log('최종결제');
    } catch (e) {
        console.log("paymentCheck", e);
    }
}

const finallyPaymentCheck = async (driver, insertedId, price) => {
    try {
        await sleep(1);

        try {
            const alert = await driver.switchTo().alert()
            await alert.accept(); // 알림창 확인
            await mysqlWrite.query(`UPDATE charged_star_ballon SET success = 0, failed_price = ${price}, log = "금액이 부족합니다." WHERE id = ${insertedId}`)
            return
        } catch (error) {
            // 알림창 처리 실패 시 예외 처리
            // console.log('알림창 처리 실패:', error);
        }


        const result = await driver.getPageSource();
        if (result.indexOf('완료') !== -1) {
            console.log('정상 구매 확인');
            await mysqlWrite.query(`UPDATE charged_star_ballon SET success = 1, complete_chared_price = ${price} WHERE id = ${insertedId}`)
        } else if (result.indexOf('부족') !== -1) {
            const lack = await driver.findElement(By.className('caution'))
            const lack_comment = await lack.getText();
            await mysqlWrite.query(`UPDATE charged_star_ballon SET success = 0, failed_price = ${price}, log = "${lack_comment}" WHERE id = ${insertedId}`)
        } else {
            let error_coment = await driver.findElement(By.className('cell-white'))
            error_coment = await error_coment.getText()
            await mysqlWrite.query(`UPDATE charged_star_ballon SET success = 0, failed_price = ${price}, log = "${error_coment}" WHERE id = ${insertedId}`)
        }

        await sleep(1);
    } catch (e) {
        console.log("finallyPaymentCheck", e);
    }
}


export {
    buy_btn,
    popup_handle,
    adClear,
    checkBoxOn,
    payment,
    paymentCheck,
    last_handle,
    scrollDown,
    finallyPaymentCheck,
    coupon_buy
}
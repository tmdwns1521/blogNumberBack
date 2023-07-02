import { sleep, By } from './selenium.js';

// 구매 상품 누르기
const buy_btn = async (driver) => {
    try {
       driver.get('https://item.afreecatv.com/starballoon.php');

       await sleep(2);

       const btnBuy = await driver.findElements(By.className('btn_buy'));
       btnBuy[0].click();

       await sleep(2);

    } catch (e) {
        console.log(e);
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
        console.log(e);
    }
}

// 팝업창 이동
const popup_handle = async (driver) => {
    try {

        await last_handle(driver);

        await sleep(2);

        await adClear(driver);
    } catch (e) {
        console.log(e);
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
        console.log(e);
    }
}

// 결제 완료 체크박스 클릭
const checkBoxOn = async (driver) => {
    try {
        await sleep(1);

        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');

        await sleep(1);

        const paycont = driver.findElement(By.id('paycont'));
        const paycont1 = driver.findElement(By.id('paycont1'));

        paycont.click();

        await sleep(1);

        paycont1.click();

        await sleep(1);
    } catch (e) {
        console.log(e);
    }
}

const payment = async (driver) => {
    try {

        await sleep(1);

        const paymentBtn = driver.findElement(By.className('btn_st4'));
        await paymentBtn.click();

        await sleep(1);
    } catch(e) {

    }
}

const paymentCheck = async (driver) => {
    try {

        await sleep(1);

        const payCheck = await driver.findElements(By.tagName('img'));
        for (const pc of payCheck) {
            const popupbtnOk = await pc.getAttribute('src');
            if (popupbtnOk.indexOf('popupbtn_ok')) {
                pc.click();
                break;
            }
        }

        await sleep(1);
    } catch (e) {
        console.log(e);
    }
}

const finallyPaymentCheck = async (driver) => {
    try {
        await sleep(1);

        const result = driver.driver.getPageSource();
        if (result.indexOf('아이템 구매가 완료되었습니다.') !== -1) {
            console.log('에러발생');
        } else {
            console.log('정상 구매 확인');
        }

        await sleep(1);
    } catch (e) {

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
    finallyPaymentCheck
}
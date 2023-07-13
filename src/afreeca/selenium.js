import {Builder, By, Key, until} from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

// export const createDriver = async () => {
//
//   return new Builder()
//       .forBrowser('chrome')
//       .setChromeOptions(new chrome.Options().addArguments("--disable-gpu",
//           "lang=ko_KR"))
//       .build();
// };

export const createDriver = async () => {

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      new chrome.Options()
        .headless()
        .addArguments('--disable-dev-shm-usage', '--no-sandbox', 'lang=ko_KR')
    ).setChromeService(new chrome.ServiceBuilder('chromedriver'))
    .build();

  return driver;
};

export const sleep = (seconds) => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

export { By, Key, until };
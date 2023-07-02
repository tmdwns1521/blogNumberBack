import { Builder, By, Key, until } from 'selenium-webdriver';

export const createDriver = async () => {
  const driver = await new Builder().forBrowser('chrome').build();
  return driver;
};

export const sleep = (seconds) => {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}

export { By, Key, until };
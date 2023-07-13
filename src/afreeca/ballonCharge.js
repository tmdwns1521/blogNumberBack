import { bookandlifecharger } from "./bookandlife.js";
import { cultureLandCharger } from "./cultureLand.js";
import { happyMoneyCharger } from "./happymoney.js";



const chargeConverter = async (card, afId, afPw, Id, Pw, price) => {
  try {
      if (card === 'book') {
          await bookandlifecharger(afId, afPw, Id, Pw, price);
      } else if (card === 'culture') {
          await cultureLandCharger(afId, afPw, Id, Pw, price);
      } else if (card === 'happy') {
          await happyMoneyCharger(afId, afPw, Id, Pw, price);
      }
  } catch (e) {
      console.log(e);
    // await driver.quit();
  }
};

// await bookandlifecharger('chlvuddks', 'a25986633!', 'chlvuddks1','a58598295!',6000);
// await cultureLandCharger('chlvuddks', 'a25986633!', 'chlvuddks1','a58598295@',6000);
// await happyMoneyCharger('chlvuddks', 'a25986633!', 'chlvuddks1','a58598295!',6000);

await chargeConverter('happy','chlvuddks', 'a25986633!','chlvuddks1','993984',6000);

export { chargeConverter };
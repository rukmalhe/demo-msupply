const { Builder, By, Key, until } = require('selenium-webdriver');

async function waitForElementAvailability(driver, locator, { timeout = 10000, isElementVisible = true, isElementEnabled = true } = {}) {

  const locStr = locator && typeof locator === 'object' && 'using' in locator
    ? `${locator.using}: ${locator.value}`
    : String(locator);
  console.log(`Waiting for element -> ${locStr} | timeout=${timeout}ms vis=${isElementVisible} en=${isElementEnabled}`);

  // giving time intervals
  const initialTime = Date.now();

  // polling time
  const poll = 500;

  while (Date.now() - initialTime < timeout) {
    //getting element details
    const elems = await driver.findElements(locator);

    // checking element for null
    if (elems.length > 0) {
      //getting 1st element
      el = elems[0];
      try {
        // checking element visibility and waiting for poll time
        if (isElementVisible && ! await el.isDisplayed()) {
          driver.sleep(poll); continue;
        }
        // checking element enabled and waiting for poll time
        if (isElementEnabled && ! await el.isEnabled()) {
          driver.sleep(poll); continue;
        }
        // returning the found element 
        return elems[0];
      } catch (e) {
        //
      }

    }
    //giving sleep time 
    await driver.sleep(poll);
  }
  throw new Error(`Element not available within ${timeout}ms: ${locator}`);
}
module.exports = { waitForElementAvailability };
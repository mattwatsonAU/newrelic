// Theshold for duration of entire script - fails test if script lasts longer than X (in ms)
// Script-wide timeout for all wait and waitAndFind functions (in ms)
var DefaultTimeout = 60000;
// Change to any User Agent you want to use.
// Leave as "default" or empty to use the Synthetics default.
var UserAgent = "default";

/** HELPER VARIABLES AND FUNCTIONS **/

var assert = require('assert'),
  By = $driver.By,
  browser = $browser.manage(),
  startTime = Date.now(),
  stepStartTime = Date.now(),
  prevMsg = '',
  prevStep = 0,
  lastStep = 9999,
VARS = {};

function elementIsPresent(ele) {
  return $browser.findElements(ele).then(function(found) {
    return found.length > 0;
  })
}

var log = function(thisStep, thisMsg) {
  if (thisStep > 1 || thisStep == lastStep) {
    var totalTimeElapsed = Date.now() - startTime;
    var prevStepTimeElapsed = totalTimeElapsed - stepStartTime;
    console.log('Step ' + prevStep + ': ' + prevMsg + ' FINISHED. It took ' + prevStepTimeElapsed + 'ms to complete.');
    $util.insights.set('Step ' + prevStep + ': ' + prevMsg, prevStepTimeElapsed);
    if (DefaultTimeout > 0 && totalTimeElapsed > DefaultTimeout) {
      throw new Error('Script timed out. ' + totalTimeElapsed + 'ms is longer than script timeout threshold of ' + DefaultTimeout + 'ms.');
    }
  }
  if (thisStep > 0 && thisStep != lastStep) {
    stepStartTime = Date.now() - startTime;
    console.log('Step ' + thisStep + ': ' + thisMsg + ' STARTED at ' + stepStartTime + 'ms.');
    prevMsg = thisMsg;
    prevStep = thisStep;
  }
};

console.log('Starting synthetics script');
console.log('Default timeout is set to ' + (DefaultTimeout/1000) + ' seconds');
console.log('Variables set in this script: ', VARS);

// Setting User Agent is not then-able, so we do this first (if defined and not default)
if (UserAgent && (0 !== UserAgent.trim().length) && (UserAgent != 'default')) {
  $browser.addHeader('User-Agent', UserAgent);
  console.log('Setting User-Agent to ' + UserAgent);
}

// Get browser capabilities and do nothing with it, so that we start with a then-able command
$browser.getCapabilities().then(function () { })


/** BEGINNING OF SCRIPT **/
//Here is where you start doing things

// Step 1 - Load the starting page
.then(function() {
  log(1, 'Load the starting page');
  return $browser.get("http://website.com"); })

// Step 2 - Enter some text
.then(function() {
  log(2, 'Entering username');
  return $browser.waitForAndFindElement(By.xpath("//*[@id='findme']"), DefaultTimeout); })
.then(function (el) {
  el.clear();
  el.sendKeys("username"); })

// Step 3 - Enter some text
.then(function() {
  log(3, 'Entering password');
  return $browser.waitForAndFindElement(By.xpath("//*[@id='findme']"), DefaultTimeout); })
.then(function (el) {
  el.clear();
  el.sendKeys("password"); })

// Step 4 - Click Login
.then(function() {
  log(4, 'Click login');
  return $browser.waitForAndFindElement(By.xpath("//*[@type='findme']"), DefaultTimeout); })
.then(function (el) { el.click(); })

// Step 5 - Verify login works
.then(function () {
  log(5, 'Verify login works');
  $browser.findElement(By.xpath("//*[contains(text(), 'findme')]")).then(function (bool) {
  	if (!bool) {
      console.log ('Browser script execution FAILED.');
      $browser.takeScreenshot();
      throw new Error("Login failed");
    } else {
      console.log('Browser script execution SUCCEEDED.');
    }
   });
});

/** END OF SCRIPT **/
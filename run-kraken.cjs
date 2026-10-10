#!/usr/bin/env node
/**
 * Runs the kraken-node CLI with four patches to kraken-node 1.0.24 internals (package.json pins that
 * exact version):
 *
 * 1. Without adb, web-only features run. kraken-node lists Android devices with `adb devices` before
 *    every scenario, even when a feature only has @web users. If adb is missing, the launcher reports
 *    no Android devices, and features that need @mobile users stop with a clear message. If adb is
 *    installed, this patch is not applied.
 *
 * 2. Coordination files in .kraken/ ("ready to finish", signal inboxes) are created in append mode.
 *    kraken-node creates them with a flag that empties the file, so a user finishing at the same time
 *    as another could erase the other's entry and both would wait until the timeout. This patch is
 *    applied in the launcher and in every user's process, where this file is preloaded.
 *
 * 3. The settings of the application under test are properties too. Every ABP_* variable of the
 *    repository's .env (see abp.cjs) can be used in features like the values of properties.json
 *    ("<ABP_ADMIN_EMAIL>"); if a name is in both, the .env value is used.
 *
 * 4. Every feature runs, and each one finishes only when its reports are written. kraken-node exits
 *    as soon as a user's process fails, so the features after a failed scenario never ran. And it
 *    reads each user's report.json as soon as the user signals the end of its scenario, before
 *    Cucumber writes the file: the read fails ("Unexpected end of JSON input"), the run stops and the
 *    report stays empty. The launcher waits for the users' processes to exit before finishing each
 *    feature, and exits with code 1 at the end if any scenario failed. The HTML report is written
 *    into a folder that kraken-node copies asynchronously: the folder is created first, and a failure
 *    to write the HTML report is shown without stopping the run (the JSON reports are complete).
 *
 * Usage: node run-kraken.cjs run   (same arguments as the kraken-node CLI)
 */
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");

function createFilesWithoutTruncating() {
  const { FileHelper } = require("kraken-node/lib/utils/FileHelper");
  FileHelper.prototype.createFileIfDoesNotExist = function (path) {
    fs.closeSync(fs.openSync(path, "a"));
  };
}

function addApplicationUnderTestProperties() {
  const { PropertyManager } = require("kraken-node/lib/utils/PropertyManager");
  const abp = require("./abp.cjs");
  const fromPropertiesFile = PropertyManager.prototype.allUserProperties;
  PropertyManager.prototype.allUserProperties = function () {
    return { ...fromPropertiesFile.call(this), ...abp };
  };
}

function adbAvailable() {
  try {
    execFileSync("adb", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function runWithoutAndroidDevices() {
  const { TestScenario } = require("kraken-node/lib/TestScenario");
  TestScenario.prototype.sampleMobileDevices = function () {
    if (this.featureFile.numberOfRequiredMobileDevices() > 0) {
      throw new Error(
        "Este escenario tiene usuarios @mobile y no se encontró 'adb'. Para pruebas en Android " +
          "instalen el Android SDK (platform-tools), Appium y Java, definan ANDROID_HOME y " +
          "JAVA_HOME, y verifiquen el entorno con: npx kraken-node doctor"
      );
    }
    return [];
  };
}

function runEveryFeatureAndWaitForReports() {
  const { spawn } = require("node:child_process");
  const { DeviceProcess } = require("kraken-node/lib/processes/DeviceProcess");
  const { TestScenario } = require("kraken-node/lib/TestScenario");
  DeviceProcess.prototype.runWithArgs = async function (args) {
    const userProcess = spawn("node", args, { stdio: "inherit" });
    this.exited = new Promise((resolve) => {
      userProcess.on("exit", (code) => {
        if (code) process.exitCode = 1;
        resolve();
      });
    });
  };
  const Constants = require("kraken-node/lib/utils/Constants");
  const afterExecute = TestScenario.prototype.afterExecute;
  TestScenario.prototype.afterExecute = async function () {
    await Promise.all(this.processes.map((userProcess) => userProcess.exited));
    const saveReport = this.reporter.saveReport.bind(this.reporter);
    this.reporter.saveReport = () => {
      try {
        fs.mkdirSync(`${Constants.REPORT_PATH}/${this.executionId}/assets/js`, { recursive: true });
        saveReport();
      } catch (error) {
        console.error(`Kraken no pudo generar el reporte HTML de ${this.executionId}: ${error.message}`);
      }
    };
    return afterExecute.call(this);
  };
}

function preloadInUserProcesses() {
  const { DeviceProcess } = require("kraken-node/lib/processes/DeviceProcess");
  const baseArgs = DeviceProcess.prototype.baseArgs;
  DeviceProcess.prototype.baseArgs = function () {
    return ["--require", __filename, ...baseArgs.call(this)];
  };
}

createFilesWithoutTruncating();
addApplicationUnderTestProperties();

if (require.main === module) {
  if (!adbAvailable()) {
    runWithoutAndroidDevices();
  }
  preloadInUserProcesses();
  runEveryFeatureAndWaitForReports();
  require("kraken-node/bin/kraken-node");
}

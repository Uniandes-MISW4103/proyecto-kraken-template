#!/usr/bin/env node
/**
 * Runs kraken-node with two fixes for kraken-node 1.0.24 (package.json pins that exact version,
 * because both fixes rely on its internals):
 *
 * 1. Web-only features also work on machines without the Android SDK. kraken-node lists Android
 *    devices with `adb devices` before every scenario, even when a feature only has @web users, and
 *    crashes when adb is not installed. If adb is missing, this launcher tells Kraken there are no
 *    Android devices: web-only features run normally and features that need @mobile users stop
 *    with a clear message. If adb is installed, nothing is changed.
 *
 * 2. Users that finish at the same time no longer wait for each other until the timeout. Kraken
 *    coordinates users through files in .kraken/ and creates them with a flag that empties the
 *    file, so a user could erase what another user had just written ("ready to finish", signals).
 *    This fix runs in the launcher and in every user's process (this file is preloaded there).
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

function preloadInUserProcesses() {
  const { DeviceProcess } = require("kraken-node/lib/processes/DeviceProcess");
  const baseArgs = DeviceProcess.prototype.baseArgs;
  DeviceProcess.prototype.baseArgs = function () {
    return ["--require", __filename, ...baseArgs.call(this)];
  };
}

createFilesWithoutTruncating();

if (require.main === module) {
  if (!adbAvailable()) {
    runWithoutAndroidDevices();
  }
  preloadInUserProcesses();
  require("kraken-node/bin/kraken-node");
}

#!/usr/bin/env node
/**
 * Runs the kraken-node CLI with two patches to kraken-node 1.0.24 internals (package.json pins that
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

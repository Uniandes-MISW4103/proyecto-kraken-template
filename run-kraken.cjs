#!/usr/bin/env node
/**
 * Runs kraken-node so that web-only features also work on machines without the Android SDK.
 *
 * kraken-node 1.0.24 lists Android devices with `adb devices` before every scenario, even when a
 * feature only has @web users, and crashes when adb is not installed. If adb is missing, this
 * launcher tells Kraken there are no Android devices: web-only features run normally and features
 * that need @mobile users stop with a clear message. If adb is installed, nothing is changed.
 *
 * Usage: node run-kraken.cjs run   (same arguments as the kraken-node CLI)
 */
const { execFileSync } = require("node:child_process");

function adbAvailable() {
  try {
    execFileSync("adb", ["version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

if (!adbAvailable()) {
  // Relies on kraken-node internals; package.json pins kraken-node to exactly 1.0.24.
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

require("kraken-node/bin/kraken-node");

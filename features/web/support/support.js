const { setWorldConstructor, setDefaultTimeout, World } = require('@cucumber/cucumber');

class KrakenWorld {
  constructor(input) {
    let params = input.parameters;
    this.userId = params.id;
    this.device = params.device || {};
    this.testScenarioId = params.testScenarioId;
    this.attach = input.attach;
  }
}

setWorldConstructor(KrakenWorld);
// Steps such as "I wait for a signal ... for 60 seconds" must fit within this limit.
setDefaultTimeout(120 * 1000);

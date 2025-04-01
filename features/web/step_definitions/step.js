const { Given, When, Then } = require("@cucumber/cucumber");
const expect = require("chai").expect;

Given("I run this project", async function () {
  let element = await this.driver.$("button");
  return await element.click();
});

When("I click register", async function () {
  let element = await this.driver.$("button.btn.btn-primary");
  return await element.click();
});

When("I click login", async function () {
  let element = await this.driver.$("button.btn.btn-primary");
  return await element.click();
});

When("I enter first name {kraken-string}", async function (firstName) {
  let element = await this.driver.$('input[formcontrolname="firstName"]');
  return await element.setValue(firstName);
});

When("I enter last name {kraken-string}", async function (lastName) {
  let element = await this.driver.$('input[formcontrolname="lastName"]');
  return await element.setValue(lastName);
});

When("I enter username {kraken-string}", async function (username) {
  let element = await this.driver.$('input[formcontrolname="username"]');
  return await element.setValue(username);
});

When("I enter password {kraken-string}", async function (password) {
  let element = await this.driver.$('input[formcontrolname="password"]');
  return await element.setValue(password);
});

Then("a sucess login message should appear", async function () {
  let element = await this.driver.$("h1");
  let actual = await element.getText();
  expect(actual).to.equal("Hi Monitor!");
});

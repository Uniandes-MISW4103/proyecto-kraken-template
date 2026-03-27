Feature: Iniciar una conversación

@user1 @web
Scenario: Como primer usuario hago registro e inicio sesión
  Given I navigate to page "https://angular-6-registration-login-example.stackblitz.io/register"
  And I wait for 5 seconds
  And I run this project
  And I wait for 5 seconds
  When I enter first name "<FIRSTNAME>"
  And I enter last name "<LASTNAME>"
  And I enter username "<USERNAME>"
  And I enter password "<PASSWORD>"
  And I wait for 5 seconds
  And I click register
  Then I send a signal to user 2 containing "user1 registered"
  And I wait for a signal containing "user2 registered" for 60 seconds
  And I navigate to page "https://angular-6-registration-login-example.stackblitz.io/login"
  And I wait for 5 seconds
  And I run this project
  And I wait for 5 seconds
  When I enter username "<USERNAME>"
  And I enter password "<PASSWORD>"
  And I wait for 5 seconds
  And I click login
  And I wait for 5 seconds
  Then a sucess login message should appear

@user2 @web
Scenario: Como segundo usuario hago registro e inicio sesión
  Given I navigate to page "https://angular-6-registration-login-example.stackblitz.io/register"
  And I wait for 5 seconds
  And I run this project
  And I wait for 5 seconds
  When I enter first name "<FIRSTNAME>"
  And I enter last name "<LASTNAME>"
  And I enter username "<USERNAME>"
  And I enter password "<PASSWORD>"
  And I wait for 5 seconds
  And I click register
  Then I send a signal to user 1 containing "user2 registered"
  And I wait for a signal containing "user1 registered" for 60 seconds
  And I navigate to page "https://angular-6-registration-login-example.stackblitz.io/login"
  And I wait for 5 seconds
  And I run this project
  And I wait for 5 seconds
  When I enter username "<USERNAME>"
  And I enter password "<PASSWORD>"
  And I wait for 5 seconds
  And I click login
  And I wait for 5 seconds
  Then a sucess login message should appear


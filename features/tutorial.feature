Feature: Iniciar una conversación

@user1 @web
Scenario: Como primer usuario hago registro y mandó un mensaje al usuario 2
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
  Then I send a signal to user 2 containing "registration complete"
  And I wait for a signal containing "login successful" for 30 seconds

@user2 @web
Scenario: Como segundo usuario inicio sesion y mandó un mensaje al usuario 1
  Given I wait for a signal containing "registration complete" for 30 seconds
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
  And I send a signal to user 2 containing "login successful"

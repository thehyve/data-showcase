Feature: All users have to login. (BRPREQ-2, BRPREQ-4)

  @default
  Scenario: every role is able to login
    Given public user goes to the 'main' page
    When he filters on 'subsub'
    Then the tree shows the node 'subsub-domain2.2.1'

#
# Copyright (c) 2017  The Hyve B.V.
#  This file is distributed under the GNU Affero General Public License
#  (see accompanying file LICENSE).
#

Feature: Data Showcase provides export functionality.

  Scenario: adding items to the cart
    Given I select all data in the data table
    When I add them to the cart
    And I open the cart
    Then the cart contains
    """
    [["ui-btn", "ageA", "Age", "Project A", "Research line 1", "age"],
    ["ui-btn", "heightB", "Height", "Project B", "Research line 2", "height"]]
    """

  Scenario: adding height items to the cart
    Given I open all tree nodes
    And I select 'Height'
    When I select all data in the data table
    And I add them to the cart
    And I open the cart
    Then the cart contains
    """
    [["ui-btn", "heightB", "Height", "Project B", "Research line 2", "height"]]
    """

  Scenario: remove items from the cart
    Given I select all data in the data table
    And I add them to the cart
    And I open the cart
    When I remove all from the cart
    Then the cart is empty

  Scenario: export items from the cart
    Given I select all data in the data table
    And I add them to the cart
    And I open the cart
    When I export
    Then a file is downloaded

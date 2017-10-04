Feature: As a researcher I want to view the data showcase catalogue from a tree. NTRDEV-1

  Scenario: Data nodes are represented in the treeview
    Given I open all tree nodes
    Then I see the following nodes in the tree: 'Personal information, Basic information, Age, Weight, Extended information, Height'

  Scenario: Data nodes are represented in the treeview
    Given I open all tree nodes
    When I select 'Height'
    Then the data table contains
    """
    [["heightB", "Height at time of survey", "Project B", "Research line 2", "height", "ui-btn"]]
    """

  Scenario: selections are maintained when switching nodes in the treeview
    Given I open all tree nodes
    When I select all data in the data table
    When I select 'Age'
    Then I see the counters Items selected '2' and total '1'

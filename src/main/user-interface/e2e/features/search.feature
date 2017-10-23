Feature: Data Showcase provides search functionality. (NTRREQ-41)

  Scenario: Search returns a list of items and shows the total number of results
    Given In the main search bar I type 'height'
    Then the data table contains
    """
    [["heightB", "Height at time of survey", "Project B", "Research line 2", "height", "ui-btn"]]
    """

  Scenario: Search and filter based on keyword
    Given I select keywords 'Family related'
    Then the data table contains
    """
    [["heightB", "Height at time of survey", "Project B", "Research line 2", "height", "ui-btn"]]
    """

  Scenario: Search and filter based on multiple keywords
    Given I select keywords 'Family related, Administration'
    Then the data table contains
    """
    [["ageA", "Age at time of survey", "Project A", "Research line 1", "age", "ui-btn"],
    ["heightB", "Height at time of survey", "Project B", "Research line 2", "height", "ui-btn"]]
    """

  Scenario: Search and filter based on Research line
    Given I select Research lines 'Research line 2'
    Then the data table contains
    """
    [["heightB", "Height at time of survey", "Project B", "Research line 2", "height", "ui-btn"]]
    """

  Scenario: Search and filter based on multiple Research lines
    Given I select Research lines 'Research line 1, Research line 2'
    Then the data table contains
    """
    [["ageA", "Age at time of survey", "Project A", "Research line 1", "age", "ui-btn"],
    ["heightB", "Height at time of survey", "Project B", "Research line 2", "height", "ui-btn"]]
    """

  Scenario: Search and filter based on Projects
    Given I select Projects 'Project B'
    Then the data table contains
    """
    [["heightB", "Height at time of survey", "Project B", "Research line 2", "height", "ui-btn"]]
    """

  Scenario: Search and filter based on Projects
    Given I select Projects 'Project A, Project B'
    Then the data table contains
    """
    [["ageA", "Age at time of survey", "Project A", "Research line 1", "age", "ui-btn"],
    ["heightB", "Height at time of survey", "Project B", "Research line 2", "height", "ui-btn"]]
    """

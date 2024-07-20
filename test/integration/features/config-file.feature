Feature: config file

  Scenario: write json config
    Given the desired config file format is "json"
    When the config file is written
    Then the config is defined in the file

  Scenario: write yaml config
    Given the desired config file format is "yaml"
    When the config file is written
    Then the config is defined in the file

  Scenario: write ini config
    Given the desired config file format is "ini"
    When the config file is written
    Then the config is defined in the file

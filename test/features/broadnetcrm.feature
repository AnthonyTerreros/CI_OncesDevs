Feature: Broadnet CRM System
    Scenario: Register a Employee in the system
        Given the to-do list is empty
        When the user adds a task "Buy groceries" with priority "High"
        Then the to-do list should contain "Buy groceries" with priority "High"

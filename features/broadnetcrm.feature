Feature: Broadnet CRM

    # Test 1
    # As Administrator 
    # wants to see all the changes made to the user #information made by other administrators, 
    # to keep track of information modifications in the system. 
    Scenario: Administrator wants to see all the changes maded to the user information
        Given a set of cambios maked by administrators
        When administrator click in cambios view
        Then administrator going to see all the changes registered in the system

    # Test 2
    # As administrator 
    # wants to be able to see the number of modifications entered by me
    # to get a better visualization of the data. 
    Scenario: Administrator wants to see n selected changes in the system
        Given a number of changes that administrator wants to see
            | Number |
            | 15     |
        When administrator click on filter1 button
        Then administrator going to see all changes

    # Test 3
    # As administrator 
    # wants to filter the information of all the changes by type of change, date, the user changed, the responsible administrator and the number of rows, 
    # to improve the search of data in the system. 
    Scenario: Administrator wants to filter information by admin user and edited user
        Given the ids of the users that maded change in the other user
            | idUsuarioAdmin | idUsuarioCambiado | UsuarioAdmin | UsuarioCambiado |
            | 4              | 14                | anavarro     | adeleortiz      |
        When administrator click on filter2 button
        Then administrator going to see all changes by selected inputs

    # Test 4
    # As an administrator 
    # I want to disable users that are no longer part of the company 
    # to disable their permissions from the system.
    Scenario: 
        Given the id of the user that will be disable
            | idUser |
            | 15     |
        When administrator click on disable user
        Then administrator going to see the user disabled

    # Test 5
    # As administrator 
    # wants to view a table with the activities by manager and channel used 
    # to view relevant information in the systems. 
    Scenario: 
        Given dates for the activities that administrator want to see
            | initDate                       | endDate                  |
            | 2023-07-01T05:00:00.000Z       | 2023-07-31T05:00:00.000Z |
        When administrator click on filter activities button
        Then administrator going to see the table with the filtered activities
    
    # Test 6
    # As an administrator 
    # I want to reset user passwords 
    # so that users can access the platform again. 
    Scenario: 
        Given the id of the user that will be reset his password
            | idUser |
            | 15     |
        When administrator click on reset password
        Then system going to send the new password via email
    
    # Test 7
    # As an administrator 
    # I want to register users to give them the necessary data, username and password, 
    # that will allow them to log into the system.
    Scenario: 
        Given the user information
            | name          | lastname           | email                       | cedula     | password  | username  |
            | DAVID ANTHONY | TERREROS GURUMENDI | anthonyterreros21@gmail.com | 0924990912 | aterreros | aterreros |
        When administrator click on register user
        Then system going to send the new crendentials in the user email

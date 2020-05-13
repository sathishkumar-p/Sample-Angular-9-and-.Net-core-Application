# Sample-Angular9-Netcore3.1

#Angular 9

Features:
    Route Gaurd
    Angular JWT token
    NGX bootstrap
    Alertify Service

Useful commands:
    ng g guard auth --skipTests  : To generate route guard file



#.Net Core 3.1 

Features: 
    JSON Authentication
    EF core Migration
    Reposity Pattern
    SQLite Database
    CORS Enable
    Password Encryption with Salt Key
    Safe Secret
    AutoMapper
    Data Seeding
    Repository Pattern


For Run App - dotnet run 
    For watch run - change in code automatically reload the app: dotnet watch run
    Create App: dotnet new webapi -n <<FolderName>>

Migration Code First Approach
1. dotnet ef  migrations add <<Name>> -- Create ModelBuilder file from context menu
2. dotnet ef database update -- Create or update the database
3. dotnet ef database drop -- Drop the database

Safe Secret 
    used to store screte information like config token key, in production used to store envirnoment , local development - use super Secret

Data Seeding
    Snippet for JSON Generator site at https://www.json-generator.com/
    Generate the JSON object randomly 

Reposity Pattern
    Used Generic Add, Delete functionlity to avoid code repition
    Separation of Data and Service layers
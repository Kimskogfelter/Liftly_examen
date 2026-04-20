# Loggbok för examensprojekt - Liftly

## Vecka 13 
Påbörjat kravlistan för projektet samt gjort klart HI-FI i Figma. 
- Figmalänk: https://www.figma.com/design/DwmMKIZb9NEAqBsgdjA8FS/Case_examen_Liftly?node-id=0-1&t=cEzKXCzBBMna6P1I-1

## Vecka 14
Smått påbörjat projektet genom att följa tutorial: https://www.youtube.com/watch?v=BEIaBF6oZ0M

## Vecka 15
Jag har hunnit skapa model, controller och routes för användare. Jag har även testat API-endpoints i Postman för att säkerställa att allt fungerar innan jag kopplar ihop det med frontend längre fram.

Jag har installerat ett valideringsverktyg som används för att kontrollera email i backend.

Jag har också färdigställt registerUser-funktionen i user-controllern. Den kontrollerar att alla fält finns, att de är korrekt ifyllda och att användaren inte redan finns i databasen samt hashar lösenordet.

Till sist har jag testat att skapa en användare via API-anrop i Postman, vilket fungerade som det ska.

## Vecka 16
Fortsatt skapa logiken i userController, nu för att logga in användare. Även testat att valideringen funkar som den ska i Postman. Tycker det är väldigt roligt och smidigt att använda Postman för att testa att ens controllers fungerar.

## Vecka 17
Implementerat filuppladdning med Multer och konfigurerat memory storage för att temporärt lagra uppladdade filer i minnet(RAM) inför vidare hantering med Cloudinary. 

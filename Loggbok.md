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
Lagt till så filer laddas upp direkt till cloudinary genom en upload middleware innan filen skickas och sparas i databasen.
Fått klart controllers, models och routes för user, post och comments i backend. Även kollat att samtliga routes fungerar via postman.

## Vecka 18
Fortsätter med controller för post och user då jag velat byta plats så allt som har att göra med post ligger under post controller/routes. Även försökt få till att spara/ta bort inlägg från sparade inlägg för en användare så de kan kolla på senare. Jag har nog fastnat på små detaljer istället för att bara köra vidare. Ville att man skulle köra en check ifall savedPosts har uppdaterats och isåfall skicka tillbaka resultatet då jag använder addToSet som endast körs ifall det finns något att lägga till som inte redan finns i arrayen. Men jag har valt att bara skicka resultatet även ifall arrayen inte ändras för att komma vidare och få börja med frontend. Så kan jag sitta med sånt här ifall jag hinner sen mot slutet. 
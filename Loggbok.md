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
Har fått till alla models, controllers och routes för backend och testat dem i Postman, så allt fungerar som det ska. Nu har jag börjat med frontend och har därför initierat React samt installerat de dependencies jag tänkt använda.

Till en början tänkte jag bara använda Axios och React Router DOM utöver React, men tutorialen jag följer använder även Redux Toolkit, React Redux och React Timeago. Jag kollade lite på vad de paketen gör och kände att jag ville testa dem i mitt eget projekt.

React Timeago verkar bra eftersom det gör datum mer användarvänliga och visar t.ex. “yesterday” eller “2 hours ago” istället för exakta datum, vilket passar en social media-app bra.

Redux Toolkit och React Redux används för att hantera global state i applikationen. Det gör det enklare att dela data mellan olika delar av appen, vilket är bra i större projekt som sociala medier där man har mycket data som användare, inlägg och kommentarer som ska kunna nås från flera komponenter. Redux Toolkit gör dessutom Redux enklare att använda och minskar mängden kod man behöver skriva

## Vecka 20
Jag har tydligen lyckats missa skriva för vecka 19 i loggboken då jag trodde det var vecka 19 nu. Så vecka 18 är en blandning från vecka 18 och 19. 

Denna veckan har jag fortsatt med att lägga till sidorna som behövs för frontend. Valde även just nu att ta bort det som har att göra med redux toolkit då jag bara vart mer förvirrad utav det och kör med vanliga useState istället på de ställen jag behöver. 

Jag är väldigt förvirrad och stressad över hur frontend fungerar, trodde det skulle vara lättare än backend, men state, props etc blir förvirrande när jag satt och höll på med backend så länge. Speciellt när jag är stressad för att få klart allt i tid. Sitter och bollar mycket med AI just nu om hur jag ska strukturera koden samt förklaring av hur allt fungerar tillsammas för att jag ska kunna skriva koden som jag tänkt. Jag hoppas bara saker klarnar snart och jag inte blir mer förvirrad mot slutet för då lär jag sitta som en tom fågelholk på redovisningen. 

Sitter just nu och håller på med komponent för att skapa inlägg och vart den ska renderas. Funderar på att han den i navigations menyn och att den kommer upp som en modal över "feed" eller som en egen sida.. modal måste ju vara mindre kod. Får se... mycket tankar nu.
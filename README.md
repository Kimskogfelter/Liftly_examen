# Liftly - Examensarbete för Glimåkra Folkhögskola

Liftly är ett examensprojekt för Glimåkra Folkhögskola där jag utvecklar en social nätverksplattform för personer med intresse för gym och hälsa. Användare kan skapa konton, dela och redigera inlägg, kommentera och gilla andras innehåll samt spara inlägg för senare användning. Plattformen täcker ämnen som träning, kost, recept och mode, och skapar en interaktiv community för inspiration och kunskapsdelning.

## KRAV

### Frontend
#### användare
1. Ska kunna skapa en användare 
2. Ska kunna logga in med sin skapade användare
3. Ska kunna logga ut med sin skapade användare
4. Ska kunna skapa egna inlägg med text
5. Ska kunna skapa egna inlägg med bild
6. Ska kunna skapa egna inlägg med video
7. Ska kunna redigera egna inlägg
8. Ska kunna radera egna inlägg
9. ska kunna se andra användares inlägg
10. Ska kunna kommentera på andra användares inlägg
11. Ska kunna gilla andra användares kommentarer
12. Ska kunna gilla andra användares inlägg
13. Ska kunna spara andra användares inlägg för att kolla på senare
14. Ska kunna besöka en annan användares profil 
15. Ska kunna följa andra användare
16. Ska ha en egen profil sida

#### besökare
1. Ska kunna se alla inlägg på hemsidan
2. Ska kunna besöka en användars profil

### Backend
#### admin
1. Ska kunna blockera en användare från appen
2. Ska kunna radera en användare från appen 

#### databas
1. Spara användarnamn
2. Spara inlägg med: text, bild, video, datum, likes, kommentarer, skapad av user_id, post_id
3. Spara kommentarer: text, likes, skapad av user_id, datum, kopplat till inlägg
4. Sparade inlägg: user_id + post_id relation
5. Admin inlogg? : spara blockarade användare, raderade användare, datum, admin_id
6. Relationer: user -> post (1 till många)
7. Relationer: post -> comment (1 till många)
8. Relationer: user -> likes (många-till-många)

#### funktioner 
1. Lösenordhantering: glömt/ändra lösenord
2. Validering: se till att text, bild/video, profilinfo följer rätt format/filstorlek
3. Säkerhet: sessionshantering, token-baserad autentisering, skydd mot oönskad åtkomst
4. Filhantering: hur bilder/videos lagras – lokalt eller moln?
5. Notiser/feedback: bekräftelse på like, kommentar eller radering
6. Sök och filter: sök efter användare eller inlägg
7. Relationer i databasen: t.ex. “följare” om du vill expandera socialt senare ??

## TEKNIK & PROGRAMSPRÅK
* **Frontend:** React, HTML, CSS, Tailwind, React Router, Axios
* **Backend:** Node.js, Express
* **Databas:** MongoDB
* **Säkerhet:** JWT, bcrypt
* **Verktyg:** nodemon, dotenv, CORS

## ARKITEKTUR
Applikationen är byggd enligt MERN-stackens arkitektur där frontend, backend och databas är separerade men kommunicerar via ett REST-API.

* React hanterar användargränssnittet och skickar förfrågningar till backend.
* Express/Node.js fungerar som API och hanterar affärslogik samt autentisering.
* MongoDB lagrar användare och träningsdata.
* Kommunikation mellan frontend och backend sker via HTTP-requests med Axios.

## DESIGN
### Figma
Här en min figma skiss för designen för hemsidan. 
https://www.figma.com/design/DwmMKIZb9NEAqBsgdjA8FS/Case_examen_Liftly?node-id=0-1&t=cEzKXCzBBMna6P1I-1



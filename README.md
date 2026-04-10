# Liftly - Examensarbete för Glimåkra Folkhögskola

Liftly är ett examensprojekt för Glimåkra Folkhögskola där jag utvecklar en social plattform för personer med intresse för gym och hälsa. Användare kan skapa konton, dela och redigera inlägg, kommentera och gilla andras innehåll samt spara inlägg för senare användning. Plattformen täcker ämnen som träning, kost, recept och mode, och skapar en interaktiv community för inspiration och kunskapsdelning.

## Krav

### Frontend
#### Användare
1. Ska kunna skapa en användare 
2. Ska kunna logga in med sin skapade användare
3. Ska kunna logga ut med sin skapade användare
4. Ska kunna skapa egna inlägg med text
5. Ska kunna skapa egna inlägg med bild
6. Ska kunna skapa egna inlägg med video
7. Ska kunna redigera egna inlägg
8. Ska kunna radera egna inlägg
9. Ska kunna se andra användares inlägg
10. Ska kunna kommentera på andra användares inlägg
11. Ska kunna gilla andra användares kommentarer
12. Ska kunna gilla andra användares inlägg
13. Ska kunna spara andra användares inlägg för att kolla på senare
14. Ska kunna sortera sparade inlägg efter kategorier
15. Ska kunna besöka en annan användares profil 
16. Ska kunna följa andra användare
17. Ska ha en egen profil sida
18. Ska kunna använda sökfunktion
19. Ska kunna filtrera inlägg efter kategori

#### Besökare
1. Ska kunna se alla inlägg på hemsidan

### Backend
#### Admin
1. Ska kunna blockera en användare från appen
2. Ska kunna radera en användare från appen 

#### Databas
1. Spara användarnamn
2. Spara inlägg med: text, bild, video, datum, likes, kommentarer, skapad av user_id, post_id
3. Spara kommentarer: text, likes, skapad av user_id, datum, kopplat till inlägg
4. Sparade inlägg: user_id + post_id relation
5. Admin inlogg? : spara blockarade användare, raderade användare, datum, admin_id
6. Relationer: user -> post (1 till många)
7. Relationer: post -> comment (1 till många)
8. Relationer: user -> likes (många-till-många)

#### Funktioner 
1. Lösenordhantering: glömt/ändra lösenord
2. Validering: se till att text, bild/video, profilinfo följer rätt format/filstorlek
3. Säkerhet: sessionshantering, token-baserad autentisering, skydd mot oönskad åtkomst
4. Filhantering: hur bilder/videos lagras – lokalt eller moln?
5. Notiser/feedback: bekräftelse på like, kommentar eller radering
6. Sök och filter: sök efter användare eller inlägg
7. Relationer i databasen: t.ex. “följare”

## Teknik & programmeringsspråk

* **Frontend:** React, HTML, CSS, Tailwind, React Router, Axios
* **Backend:** Node.js, Express, Mongoose
* **Databas:** MongoDB
* **Säkerhet:** JWT, bcrypt
* **Verktyg:** Nodemon, Dotenv, CORS, uuid, Postman (API testing), Validator
* **Filhantering:** Multer, Cloudinary

## Arkitektur
Applikationen är byggd enligt MERN-stackens arkitektur där frontend, backend och databas är separerade men kommunicerar via ett REST-API.

* React hanterar användargränssnittet och skickar förfrågningar till backend.
* Express/Node.js fungerar som API och hanterar affärslogik samt autentisering.
* MongoDB lagrar användare och data.
* Kommunikation mellan frontend och backend sker via HTTP-requests med Axios.

## API Testing

Under utvecklingen användes Postman för att testa backendens API-endpoints. 
Detta inkluderade att skicka HTTP-requests (GET, POST, PUT, DELETE) för att verifiera att funktioner som autentisering, inlägg och kommentarer fungerade korrekt innan de kopplades till frontend.

## Installation

1. Klona projektet

    ```bash
    git clone https://github.com/Kimskogfelter/Liftly_examen
    cd Liftly_examen
    ```

2. Installera dependencies

    Backend:

    ```bash
    cd backend
    npm install
    ```

    Frontend:

    ```bash
    cd frontend
    npm install
    ```

3. Skapa `.env` fil

    ```env
    PORT=5000
    MONGO_URI=din_mongodb_connection_string
    JWT_SECRET=din_hemliga_nyckel
    ```

4. Starta applikationen

    Backend:

    ```bash
    npm run dev
    ```

    Frontend:

    ```bash
    npm run dev
    ```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

## Design

### Figma
Här är en Figma-skiss för designen av hemsidan. 
https://www.figma.com/design/DwmMKIZb9NEAqBsgdjA8FS/Case_examen_Liftly?node-id=0-1&t=cEzKXCzBBMna6P1I-1


## Inspiration & resurser

I detta avsnitt listar jag tutorials, guider och tidigare projekt som har inspirerat delar av min social media-app.  
Koden har anpassats för detta projekt, och jag har lagt till egen logik där det behövdes för att passa appens funktionalitet.  

* Som inspiration och hjälp med att skapa detta projekt har jag valt att följa denna tutorial: https://www.youtube.com/watch?v=BEIaBF6oZ0M
* För hjälp med syntax och hur man skriver med ES-moduler istället för CommonJS har jag använt den här guiden då tutorialen ovan använder CommonJS: https://www.youtube.com/watch?v=BqRWK57dwqo, samt mitt egna projekt: https://github.com/Kimskogfelter/Case_8_nodejs


I följande avsnitt visar jag exempel på kod som inspirerat funktioner i projektet, samt hur jag anpassat dem.

### Backend
#### userController.js - deleteUser

I `userController.js` har jag skapat flera funktioner för användarhantering, bland annat `deleteUser`.  
För att skriva och strukturera denna funktion tog jag inspiration från ett äldre projekt där jag hanterade radering av bokningar. Koden har anpassats för User-modellen och inkluderar kontroll för om användaren finns samt felhantering via `HttpError`.

Inspiration från mitt tidigare projekt:

```js
// -----------------------------
// RADERA EN BOKNING
// -----------------------------
export const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const findBooking = await BookingModel.findById(id);
    if (!findBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const findBookedSeat = findBooking.seats;
    const findBookedShow = findBooking.show;

    await ShowModel.findByIdAndUpdate(
      findBookedShow,
      { $addToSet: { availableSeats: { $each: findBookedSeat } } }
    );

    const deleteBooking = await BookingModel.findByIdAndDelete(id);
    const updatedShow = await ShowModel.findById(findBookedShow);

    res.json({ deletedBooking: deleteBooking, updatedShow });
  } catch (error) {
    res.status(500).json({ message: 'Serverfel vid uppdatering', error });
    console.error(error);
  }
}
```


## Syfte 

### Tekniskt syfte
Projektet skapades för att utveckla praktiska kunskaper inom fullstack-utveckling och förstå hur olika delar av en webbapplikation samverkar.
Under projektet har följande områden utforskats:

* Bygga REST API med Node.js och Express
* Datamodellering med MongoDB och Mongoose
* Autentisering med JWT
* Säker lösenordshantering med bcrypt
* State management och routing i React
* Kommunikation mellan frontend och backend

### Användarperspektiv
Syftet med applikationen är att skapa ett community liknande sociala plattformar som TikTok och Instagram, men med fullt fokus på träning och hälsa. Målet är att samla likasinnade användare på ett och samma ställe där de kan inspirera, motivera och följa varandra.

Idag är innehåll relaterat till träning, kost och hälsa ofta utspritt över flera olika plattformar, vilket gör det svårt att hitta tillbaka till sparade inlägg. Användare kan till exempel behöva leta igenom stora mängder innehåll för att hitta ett specifikt recept eller träningsinlägg de tidigare sparat.

Liftly syftar till att lösa detta problem genom att erbjuda en plattform där allt träningsrelaterat innehåll samlas och kan organiseras på ett strukturerat sätt. Användare ska enkelt kunna spara, sortera och återvända till innehåll inom kategorier som träning, kost och livsstil.

## AI användning

AI har använts som stöd för:
* formulering av texter
* förklaring av tekniska koncept
* genererat och strukturerat GitHub Issues baserat på projektets krav i README-filen
* felsökning och optimering av kod

## Framtida utveckling 

* Notiser
* Se online användare
* Chatt funktion

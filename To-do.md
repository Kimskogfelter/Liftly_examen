# Liftly - Project To-Do List

## APPLE STORE KRAV: Vad krävs för att slippa ett "nej" från Apple (App Store)?
Apple är kända för att vara strikta vid granskningen (App Store Review). Om du skickar in appen i sitt nuvarande skick finns det några vanliga fallgropar som riskerar att ge dig ett avslag:

1. Innehållsmoderering (Kopplat till din fulords- och gilla-fråga!):

Apple kräver att appar som tillåter användare att generera eget innehåll (som inlägg, kommentarer och bilder) har ett system för att hantera kränkande innehåll.

Krav för att inte få nej: Du måste ha en funktion för att rapportera inlägg/användare (ReportPostModal i post components, samt ReportUserModal i user components?), samt en funktion för att blockera användare. Utan detta blir det nästan garanterat ett nej. (Ett automatiskt fulordsfilter är ett stort plus, men rapporteringsknappen är ett absolut krav).

2. Användarvillkor och Integritetspolicy (Terms & Privacy Policy):

Du måste ha en länk till en integritetspolicy (Privacy Policy) som förklarar vilka uppgifter ni sparar (e-post, lösenord, bilder). Den måste finnas tillgänglig både på en webbsida och i appen.

3. Radering av konto:

Sedan några år tillbaka kräver Apple att om en app låter användare skapa ett konto, så måste det också finnas en enkel knapp inne i appen för att radera sitt konto och all sin data permanent.

4. "Placeholder"-innehåll / Skräpdata:

Appen får inte se ut som en testprototyp fylld med "Lorem Ipsum"-texter eller buggiga element som inte fungerar när granskaren klickar runt.


## Säkerhet & Autentisering
- Ändra namnet token till accessToken i både frontend och backend för bättre förståelse av vad den gör

## Nya Funktioner
- skönhetsfilter till bild/video, måste väll finnas enkla tillägg för detta?? eller måste man koda allt själv??
- fixa så man får notiser i och utanför appen när något händer, tex en kommentar eller gilla markering
- fixa ett språk filter mot fula ord?! 

- fixa betalplan för server så den alltid är uppe??
- fixa så appen kan lanseras hos app store och andriod för att lätt laddas ner

- uppdatera README.md med screenshots från de olika delarna på appen

## ✅ Redan Klart
- [x] Vända inläggsordning (`.reverse()`) på profilsidan så nyaste inläggen visas överst.
- [x] Standardisera toppmarginaler och layout på Search, Saved, Category och Profile.
- [x] **All / Following Tab-meny (`Home.jsx`)**
  Fixa sticky-positionering så att flikarna inte hamnar ovanpå eller täcker inläggen vid scroll.
- [x] **Skapa inlägg (`CreatePostForm.jsx`)**
Gör "Add photo/video"-knappen mer framträdande och centrerad överst i rutan med text.
- [x] **Bildbeskäring (`PostCard.jsx`)**
Justera bild-höjd och `object-cover` så att vertikala bilder/videos inte beskärs för hårt i flödet.
- [x] **Egen Hashtag-sida**
Skapa en dedikerad vy som visar alla inlägg taggade med en viss hashtag när man klickar på den.
- [x] **Träningspass & Mallar**
  - [x] Bygga funktion för att skapa och spara egna träningspass som enkelt kan plockas fram och loggas under gympasset. Namnge som "Workouts" i navmeny
- [x] **Glömt Lösenord**
  - [x] Skapa återställningsflöde med e-post/tillfällig token för lösenordsåterställning.
- [x] skapa reply schema, controller etc för kommentarer så användare kan svara på varandras kommentarer på inlägg
- [x] Lägg till en following sida som ska visa alla man följer så man lätt kan avfölja personer
- [x] Pagination & Infinite Scroll (Flöde, Profil, Kategori, Hashtag, Sparade & Sök)
  - [x] Backend: Uppdaterat samtliga post-endpoints (/posts, /posts/following, /posts/users/:userId, /posts/category, /posts/hashtag, /users/savedposts, /search) till att hantera page och limit samt returnera en enhetlig paginerad datastruktur (posts, hasMore, currentPage, totalPosts).
  - [x] Frontend: Implementerat Infinite Scroll med IntersectionObserver i PostFeed och alla tillhörande vyer (HomePage, ProfilePage, CategoryPage, HashtagPage, SavedPostsPage, SearchPage) för sömlös och prestandaoptimerad laddning på mobil och desktop.
- [x] **Backend: Refresh Tokens & Cookies**
  - [x] Installera och konfigurera `cookie-parser` i Express.
  - [x] Uppdatera `/login`-controllern att skapa `accessToken` (15m) och `refreshToken` (30d) i en `httpOnly` cookie.
  - [x] Skapa endpoint `/api/v1/users/refresh` som validerar cookien och skickar en ny `accessToken`.
- [x] **Frontend: Silent Token Refresh**
  - [x] Skapa en Axios Interceptor som fångar 401-svar i bakgrunden.
  - [x] Förnya `accessToken` automatiskt utan att användaren märker det eller blir utloggad.
- [x] Lägg till länk till instagram/tiktok/youtube ifall man vill på en användares profilsida 
- [x] RENSA bort alla console.logs
- [x] fixa problemet med att man loggas ut från mobilen, har med refresh token i user controllern att göra (egen domän!!)
- [x] ordna fler under kategorier på musik, mat, träning
- [x] ändra sido scroll menyn på saved posts för mobil vyn till en drop down lista? 
- [x] **Tränings- & Matdagbok**
  - [x] Utveckla loggbok där användare kan registrera daglig träning och kost/kcal/protein intag i samma vy.
- ta bort ljudet som spelas upp när ett set är klart under träningspass samt ändra till vibration istället?! 
- dubbelkolla ifall du behöver någon del som användaren klickar i att de godkänner att deras info sparas pga GDPR när de skapar en användare ?! FIXAT med checkbox vid reg samt länk till privacy policy sida
- [x] **Recept & Mat**
  - [x] Skapa struktur och gränssnitt för att bygga egna recept (ingredienser, instruktioner, tillagningstid och makronätring).
- [x] fixa så glömt lösenord mejl skickas till alla användare inte bara mig själv! tydligen blockerat av resend under test och behöver fixa egen domän alt nå annat gratis fix
- [x] fixa kontakta oss sida så folk kan skicka in förbättringar, buggar etc till min email/egen mejl till lifly?!
- [x] lägg till antal träffar gällande posts på söksidan, saved posts, category och hashtag. tänk på pagination !!
- [x] fixa så men enklare ser att det är ett musik inlägg i post grid item 
- [x] fixa att man kan klicka i avklarat träningspass på single workout page vyn, så bockas de av automatiskt i kalendern
- [x] dubbelkolla att ingen del i backend skickar med känslig information till frontend!!
- [x] se till så det syns att det är en delad kalender vy i post grid item komponenten

# Liftly - Project To-Do List


## Säkerhet & Autentisering
- [ ] **Backend: Refresh Tokens & Cookies**
  - [ ] Installera och konfigurera `cookie-parser` i Express.
  - [ ] Uppdatera `/login`-controllern att skapa `accessToken` (15m) och `refreshToken` (30d) i en `httpOnly` cookie.
  - [ ] Skapa endpoint `/api/v1/users/refresh-token` som validerar cookien och skickar en ny `accessToken`.
- [ ] **Frontend: Silent Token Refresh**
  - [ ] Skapa en Axios Interceptor som fångar 401-svar i bakgrunden.
  - [ ] Förnya `accessToken` automatiskt utan att användaren märker det eller blir utloggad.
- Ändra namnet token till accessToken i både frontend och backend för bättre förståelse av vad den gör
- dubbelkolla att ingen del i backend skickar med känslig information till frontend!!


## Nya Funktioner
- [ ] **Recept & Mat**
  - [ ] Skapa struktur och gränssnitt för att bygga egna recept (ingredienser, instruktioner, tillagningstid och makronätring).
- [ ] **Tränings- & Matdagbok**
  - [ ] Utveckla loggbok där användare kan registrera daglig träning och kost i samma vy.
- Lägg till länk till instagram/tiktok/youtube ifall man vill på en användares profilsida 
- fixa så glömt lösenord mejl skickas till alla användare inte bara mig själv! tydligen blockerat av resend under test och behöver fixa egen domän alt nå annat gratis fix
- ändra sido scroll menyn på saved posts för mobil vyn till en drop down lista? 
- fixa problemet med att man loggas ut från mobilen, har med refresh token i user controllern att göra (egen domän!!)






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
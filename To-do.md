# Liftly - Project To-Do List

## Prestanda & Skalbarhet
- [ ] **Pagination & Lazy Loading (Flöde)**
  - [ ] **Backend:** Uppdatera GET `/posts` för att ta emot `page` och `limit` (t.ex. `limit=10`) och returnera datan i batcher.
  - [ ] **Frontend:** Implementera Infinite Scroll (med `IntersectionObserver` eller `react-infinite-scroll-component`) för att ladda fler inlägg automatiskt vid scroll.

## Säkerhet & Autentisering
- [ ] **Backend: Refresh Tokens & Cookies**
  - [ ] Installera och konfigurera `cookie-parser` i Express.
  - [ ] Uppdatera `/login`-controllern att skapa `accessToken` (15m) och `refreshToken` (30d) i en `httpOnly` cookie.
  - [ ] Skapa endpoint `/api/v1/users/refresh-token` som validerar cookien och skickar en ny `accessToken`.
- [ ] **Frontend: Silent Token Refresh**
  - [ ] Skapa en Axios Interceptor som fångar 401-svar i bakgrunden.
  - [ ] Förnya `accessToken` automatiskt utan att användaren märker det eller blir utloggad.
- [ ] **Glömt Lösenord**
  - [ ] Skapa återställningsflöde med e-post/tillfällig token för lösenordsåterställning.

## Nya Funktioner (Träning & Hälsa)
- [ ] **Recept & Mat**
  - [ ] Skapa struktur och gränssnitt för att bygga egna recept (ingredienser, instruktioner, tillagningstid och makronätring).
- [ ] **Tränings- & Matdagbok**
  - [ ] Utveckla loggbok där användare kan registrera daglig träning och kost i samma vy.
- [ ] **Träningspass & Mallar**
  - [ ] Bygga funktion för att skapa och spara egna träningspass som enkelt kan plockas fram och loggas under gympasset.

## UI & Design (Frontend)
- [ ] **Egen Hashtag-sida**
  - [ ] Skapa en dedikerad vy som visar alla inlägg taggade med en viss hashtag när man klickar på den.
- [ ] **Bildbeskäring (`PostCard.jsx`)**
  - [ ] Justera bild-höjd och `object-cover` så att vertikala bilder/videos inte beskärs för hårt i flödet.

## ✅ Redan Klart
- [x] Vända inläggsordning (`.reverse()`) på profilsidan så nyaste inläggen visas överst.
- [x] Standardisera toppmarginaler och layout på Search, Saved, Category och Profile.
- [x] **All / Following Tab-meny (`Home.jsx`)**
  Fixa sticky-positionering så att flikarna inte hamnar ovanpå eller täcker inläggen vid scroll.
- [x] **Skapa inlägg (`CreatePostForm.jsx`)**
Gör "Add photo/video"-knappen mer framträdande och centrerad överst i rutan med text.
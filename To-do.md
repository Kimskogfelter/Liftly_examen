# Liftly - Project To-Do List

## Säkerhet & Autentisering (TikTok-varianten)
- [ ] **Backend: Refresh Tokens & Cookies**
  - [ ] Installera och konfigurera `cookie-parser` i Express.
  - [ ] Uppdatera `/login`-controllern att skapa `accessToken` (15m) och `refreshToken` (30d) i en `httpOnly` cookie.
  - [ ] Skapa endpoint `/api/v1/users/refresh-token` som validerar cookien och skickar en ny `accessToken`.
- [ ] **Frontend: Silent Token Refresh**
  - [ ] Skapa en Axios Interceptor som fångar 401-svar i bakgrunden.
  - [ ] Förnya `accessToken` automatiskt utan att användaren märker det eller blir utloggad.
- [ ] **Glömt Lösenord**
  - [ ] Skapa återställningsflöde med e-post/tillfällig token för lösenordsåterställning.

---

## Backend & Databas-logik
- [ ] **Category "General" Default Fix**
  - [ ] Undersök varför `category` inte skickas med/sparas vid skapande av inlägg så att default blir "General".

---

## UI & Design (Frontend)
- [ ] **Egen Hashtag-sida**
  - [ ] Skapa en ny, dedikerad sida/vy för hashtags när man klickar på en hashtag i ett inlägg.
- [ ] **Skapa inlägg (`CreatePostForm.jsx`)**
  - [ ] Gör "Add photo/video"-knappen mer framträdande och centrerad överst i rutan med text.
- [ ] **Bildbeskäring (`PostCard.jsx`)**
  - [ ] Justera bild-höjd/`object-cover` så att uppladdade bilder/videos inte beskärs för hårt.

---

## ✅ Redan Klart
- [x] Vända inläggsordning (`.reverse()`) på profilsidan så nyaste inläggen visas överst.
- [x] Standardisera toppmarginaler och layout på Search, Saved, Category och Profile.
- [x] **All / Following Tab-meny (`Home.jsx`)**
  Fixa sticky-positionering så att flikarna inte hamnar ovanpå eller täcker inläggen vid scroll.
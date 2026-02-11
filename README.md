# Liftly - Examensarbete för Glimåkra Folkhögskola

Examensarbete för Glimåkra Folkhögskola. Detta projekt är en social nätverksplattform där användare kan skapa egna konton, posta inlägg, kommentera andra och interagera i olika gymrelaterade ämnen som träning, kost, recept och mode.

# KRAV

## Frontend
### användare
1. Ska kunna skapa en användare 
2. Ska kunna logga in med sin skapade användare
3. Ska kunna logga ut med sin skapade användare
4. Ska kunna skapa egna inlägg med text
5. Ska kunna skapa egna inlägg med bild
6. Ska kunna skapa egna inlägg med video
7. Ska kunna redigera egna inlägg
8. Ska kunna radera egna inlägg
9. Ska kunna kommentera på andra användares inlägg
10. Ska kunna "gilla" spara andra användares inlägg för att kolla på senare
11. Ska kunna besöka en annan användares profil 
12. Ska ha en egen profil sida

### besökare
1. Ska kunna se alla inlägg på hemsidan
2. Ska kunna besöka en användars profil

## Backend
### admin
1. Ska kunna blockera en användare från appen
2. Ska kunna radera en användare från appen 

### databas
1. Spara användarnamn
2. Spara inlägg med: text, bild, video, datum, likes, kommentarer, skapad av user_id, post_id
3. Spara kommentarer: text, skapad av user_id, datum, kopplat till inlägg
4. Likes/sparade inlägg: user_id + post_id relation
5. Admin inlogg? : spara blockarade användare, raderade användare, datum, admin_id
6. Relationer: user -> post (1 till många)
7. Relationer: post -> comment (1 till många)
8. Relationer: user -> likes (många-till-många)

### funktioner 
1. Lösenordhantering: glömt/ändra lösenord
2. Validering: se till att text, bild/video, profilinfo följer rätt format/filstorlek
3. Säkerhet: sessionshantering, token-baserad autentisering, skydd mot oönskad åtkomst
4. Filhantering: hur bilder/videos lagras – lokalt eller moln?
5. Notiser/feedback: bekräftelse på like, kommentar eller radering
6. Sök och filter: sök efter användare eller inlägg
7. Relationer i databasen: t.ex. “följare” om du vill expandera socialt senare ??






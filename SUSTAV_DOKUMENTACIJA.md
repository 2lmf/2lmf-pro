# 2LMF PRO - Sustav Web Kalkulatora i CRM-a

## 1. Pregled Sustava
Ovaj sustav povezuje **Web Kalkulator** (Frontend) s **Google Tablicama** (Backend/Baza podataka). Glavna svrha je automatizacija izrade ponuda, slanje emailova i praćenje upita bez potrebe za plaćanjem skupih CRM alata.

---

## 2. Arhitektura Podataka (Kako radi?)

### A. Frontend (Kalkulator na webu - `kalkulator.js`)
*   **Logika Izračuna:** Sadrži formule za izračun potrebne m² fasade, ljepila, mrežice itd.
*   **Baza Cijena:** Ima svoju internu bazu, ali prilikom pokretanja **povlači svježe cijene** s Google Sheeta (funkcija `fetchPrices()`).
*   **Slanje Upita:** Kad kupac klikne "Zatraži ponudu", web šalje JSON podatke (šifre artikala, količine) na Google Skriptu.

### B. Backend (Google Apps Script - `CRM_Complete.gs`)
Ovo je "mozak" operacije. Nalazi se u `Extensions > Apps Script` unutar Google Sheeta.

#### Glavne Funkcije:
1.  **`doPost(e)` - Primanje Upita:**
    *   Prima podatke s weba.
    *   Dodjeljuje jedinstveni ID ponude (npr. `u00123`).
    *   **Enrichment (Obogaćivanje):** Na temelju primljenih šifri (SKU) gleda u tablicu `CJENIK` i pronalazi nabavne cijene.
2.  **`generateHtml` & `generateAdminHtml` - Generiranje Emailova:**
    *   **Za Kupca:** Kreira lijepu HTML ponudu s maloprodajnim cijenama (MPC), QR kodom za plaćanje i Uvjetima kupnje.
    *   **Za 2LMF (Admin):** Kreira interni izvještaj koji sadrži:
        *   **Analizu Zarade:** Usporedba Prodajna vs. Nabavna cijena, izračun profita i marže.
        *   **Tablicu Dobavljača:** Jedinstvena lista svih materijala s nabavnim cijenama (bez PDV-a) spremna za narudžbu.
3.  **`doGet(e)` - Sinkronizacija Cijena:**
    *   Omogućuje web kalkulatoru da "pročita" tablicu `CJENIK` i ažurira cijene na webu u stvarnom vremenu.

### C. Baza Podataka (Google Sheets)
Skripta automatski kreira i održava 3 ključna lista (Tab):
1.  **`Upiti`:** Log svih pristiglih upita (Ime, Email, Iznos, Status, JSON).
2.  **`Generator Ponuda`:** Interaktivni alat za ručno kreiranje ili učitavanje ponuda (za desktop/mobitel rad).
3.  **`CJENIK`:** Glavni izvor istine. Sadrži stupce:
    *   `A` Šifra (SKU) - *Ključ za povezivanje s webom*
    *   `B` Naziv
    *   `C` Nabavna (BEZ PDV) - *Za dobavljače*
    *   `D` Nabavna (SA PDV) - *Za izračun profita*
    *   `E` Prodajna (SA PDV) - *Cijena za kupca*

---

## 3. Upute za Postavljanje Novog Klijenta (Deployment)

Ako želite ovaj sustav postaviti za nekog drugog (npr. "Firma X"), slijedite ove korake:

1.  **Kopiranje Datoteka:**
    *   Kopirajte `kalkulator.html` / `.js` / `.css` na web server klijenta.
    *   Kreirajte novi Google Sheet na Google Driveu klijenta.

2.  **Postavljanje Skripte:**
    *   U Google Sheetu idite na `Extensions` -> `Apps Script`.
    *   Zalijepite sadržaj skripte `CRM_Complete.gs`.
    *   Spremite projekt.

3.  **Inicijalizacija:**
    *   Osvježite Sheet. Pojavit će se izbornik **"2LMF ADMIN"**.
    *   Kliknite **"1. Postavi/Ažuriraj Sustav"**. Skripta će sama kreirati sve tablice (Upiti, Generator, Cjenik).
    *   Unesite artikle i cijene u tablicu **`CJENIK`**. (Važno: Šifre moraju odgovarati onima u `kalkulator.js`).

4.  **Aktivacija (Deploy):**
    *   U Apps Scriptu kliknite `Deploy` -> `New deployment`.
    *   Type: `Web app`.
    *   Execute as: `Me` (vlasnik sheeta).
    *   Who has access: `Anyone` (ovo je ključno da web može slat podatke).
    *   Kopirajte dobiveni **Web App URL**.

5.  **Povezivanje:**
    *   Otvorite `kalkulator.js`.
    *   Pronađite varijablu `GAS_URL`.
    *   Zamijenite stari URL novim URL-om koji ste upravo dobili.

To je to! Sustav je spreman za rad.

---

## 4. Održavanje
*   **Promjena Cijena:** Samo promijenite broj u tablici `CJENIK` na Google Sheetu. Web će to povući automatski.
*   **Novi Artikli:** Dodajte red u `CJENIK` i dodajte odgovarajući kod u `items_data.js` na webu.

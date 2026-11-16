# Nightstamp

Clubs und Events in Graz, Wien, Linz, Salzburg und Innsbruck. Aufbau und Aussehen folgen der Vorschau
(`Nightstamp_Vorschau.html`), aber mit echten Clubs und Terminen, KI-Assistent, Altersprüfung,
Datenschutz/Impressum/AGB und Zahlung über Stripe.

## Starten

```bash
cd nightstamp
npm install
cp .env.example .env   # Werte eintragen, siehe unten
npm start              # http://localhost:3000
```

Ohne Schlüssel läuft die Seite auch: KI und Zahlung zeigen dann einen Hinweis, dass sie noch nicht
eingerichtet sind, und Anmeldelinks erscheinen im Server-Log statt per E-Mail.

## Was du eintragen musst (`.env`)

| Wofür | Variablen | Woher |
| --- | --- | --- |
| KI-Assistent | `ANTHROPIC_API_KEY` | platform.claude.com |
| Zahlung | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com |
| E-Mail | `SMTP_URL`, `MAIL_FROM` | dein E-Mail-Anbieter |
| Rechtstexte | `OPERATOR_*` | deine Betreiberdaten |
| Adresse | `BASE_URL`, `NODE_ENV=production` | deine Domain (https) |

**Stripe einrichten**

1. Im Dashboard unter *Entwickler → Webhooks* einen Endpunkt auf `BASE_URL/api/stripe/webhook` anlegen mit den
   Ereignissen `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`,
   `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
2. Unter *Einstellungen → Zahlungsmethoden* einschalten, was angeboten werden soll (Karte, Apple Pay, Google Pay,
   EPS, PayPal, Klarna …). Der Checkout zeigt automatisch die passenden an.
3. Unter *Einstellungen → Abrechnung → Kundenportal* das Portal aktivieren, damit „Abo und Rechnungen verwalten“
   funktioniert.

Preise stehen in `server.js` (`PLANS`), in Cent und inklusive Umsatzsteuer.

## Clubs und Events pflegen

Die Inhalte liegen in zwei Dateien:

- `data/venues.json` – Städte und Clubs (Name, Adresse, Musik, Website)
- `data/events.json` – Termine mit Datum, Uhrzeit, Preis, Mindestalter, Link und Quelle

Felder, die nicht bekannt sind, bleiben `null`; die Website zeigt dann „beim Veranstalter“ statt einer geschätzten
Zahl. Vergangene Termine blendet die Seite von selbst aus. Nach jeder Änderung:

```bash
npm run check   # prüft die Dateien auf Tippfehler
```

und den Server neu starten. Kostenlos sichtbar sind die ersten drei Clubs jeder Stadt in der Reihenfolge der Datei.

## Aufbau

```
server.js          Server: Website, Konten, Zusagen, Live-Meldungen, Erinnerungen, KI, Stripe
public/index.html  Seite
public/app.js      Oberfläche (Deutsch/Englisch)
public/legal.js    Datenschutz, Impressum, AGB mit Rücktrittsrecht, Jugendschutz
public/styles.css  Aussehen (aus der Vorschau, plus Ergänzungen)
public/fonts/      Schriften, lokal ausgeliefert (kein Google-Abruf)
data/              Clubs, Events und die Datenbank-Datei db.json (wird beim Betrieb angelegt)
```

## Datenschutz und Alter in Kürze

- Alterstor beim ersten Besuch (ab 16), Geburtsdatum bei der Registrierung. Gespeichert wird nur „volljährig ja/nein“.
- Premium und Zusagen bei 18+-Events erst ab 18.
- Kein Tracking, keine Werbung, keine Drittanbieter-Skripte, Schriften lokal. Nur ein technisch nötiges Cookie nach der Anmeldung.
- Unter „Konto“: alle Daten herunterladen (Art. 15/20 DSGVO) und Konto sofort löschen (Art. 17).
- KI-Chat erst nach Einwilligung; der Verlauf wird am Server nicht gespeichert.
- Karten- und Kontodaten werden nur bei Stripe eingegeben.

## Vor dem Start erledigen

- Rechtstexte in `public/legal.js` von einer Rechtsberatung prüfen lassen. Sie sind sorgfältig geschrieben, ersetzen aber keine Beratung.
- Auftragsverarbeitungsverträge mit Hosting-Anbieter, E-Mail-Dienst, Stripe und Anthropic abschließen.
- `data/db.json` ist eine einfache Datei. Für eine Instanz reicht das; bei mehreren Servern oder vielen Nutzern auf eine Datenbank umstellen. Regelmäßig sichern.
- Eventdaten laufend aktualisieren (siehe oben) und bei den Clubs gegenprüfen.

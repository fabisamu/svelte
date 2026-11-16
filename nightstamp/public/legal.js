/* Nightstamp – Rechtstexte: Datenschutz, Impressum, AGB mit Rücktrittsrecht, Jugendschutz.
   Die Betreiberangaben kommen vom Server (Umgebungsvariablen OPERATOR_*).
   Fehlende Angaben werden deutlich markiert, damit nichts Unvollständiges online geht. */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function val(v, label) {
    return v ? esc(v) : '<span class="missing">[' + esc(label) + ' fehlt – bitte am Server eintragen]</span>';
  }
  function euro(cents) { return (cents / 100).toFixed(2).replace('.', ',') + ' €'; }

  function operatorBlock(o) {
    return '<address>' + val(o.name, 'Name des Betreibers') + '<br>' + val(o.street, 'Straße und Hausnummer') + '<br>' +
      val(o.city, 'PLZ und Ort') + '<br>E-Mail: ' + val(o.email, 'E-Mail-Adresse') +
      (o.phone ? '<br>Telefon: ' + esc(o.phone) : '') + '</address>';
  }
  function draftNote(o) {
    if (o.name && o.street && o.city && o.email) return '';
    return '<p class="note"><b>Noch nicht vollständig.</b> Die Angaben zum Betreiber fehlen. Vor dem Start müssen sie am Server eingetragen ' +
      'und dieser Text von einer Rechtsberatung geprüft werden.</p>';
  }

  var TITLES = {
    privacy: { de: 'Datenschutz', en: 'Privacy' },
    imprint: { de: 'Impressum', en: 'Imprint' },
    terms: { de: 'AGB und Rücktrittsrecht', en: 'Terms and withdrawal' },
    youth: { de: 'Alter und Jugendschutz', en: 'Age and youth protection' }
  };

  function privacy(d) {
    var o = d.operator;
    return draftNote(o) +
      '<p>Nightstamp erhebt so wenige Daten wie möglich. Es gibt keine Werbung, kein Tracking und keine Analyse-Dienste. ' +
      'Diese Erklärung sagt dir, welche Daten wir wofür verarbeiten und welche Rechte du hast.</p>' +

      '<h2>1. Wer ist verantwortlich?</h2>' + operatorBlock(o) +

      '<h2>2. Wenn du die Website nur ansiehst</h2>' +
      '<p>Dein Browser schickt bei jedem Aufruf technisch notwendige Daten an unseren Server, vor allem deine IP-Adresse. ' +
      'Wir brauchen sie, um dir die Seite zu schicken und Missbrauch abzuwehren (zum Beispiel zu viele Anfragen in kurzer Zeit). ' +
      'Die Anwendung speichert IP-Adressen nicht dauerhaft und schreibt sie in kein Protokoll. ' +
      'Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).</p>' +
      '<p>Hosting: ' + val(o.host, 'Name und Sitz des Hosting-Anbieters') + '. Der Anbieter verarbeitet die Daten in unserem Auftrag.</p>' +
      '<p>Schriften, Symbole und Skripte liegen auf unserem eigenen Server. Es werden keine Inhalte von Drittanbietern nachgeladen.</p>' +

      '<h2>3. Altersbestätigung</h2>' +
      '<p>Nightstamp ist ab 16 Jahren. Beim ersten Besuch fragen wir, ob du mindestens 16 bist. Die Antwort wird nur in deinem Browser gespeichert, ' +
      'nicht bei uns. Wenn du ein Konto anlegst, fragen wir dein Geburtsdatum ab. Wir prüfen damit dein Alter und speichern danach nur, ' +
      'ob du volljährig bist (ja oder nein). Das Geburtsdatum selbst speichern wir nicht.</p>' +

      '<h2>4. Konto</h2>' +
      '<p>Für ein Konto speichern wir: deine E-Mail-Adresse, ob du volljährig bist, den Zeitpunkt der Registrierung und deiner Zustimmung zu dieser Erklärung. ' +
      'Du meldest dich über einen Link an, den wir dir per E-Mail schicken. Ein Passwort gibt es nicht. ' +
      'Rechtsgrundlage ist die Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO).</p>' +
      '<p>Mit deinem Konto verknüpft speichern wir außerdem:</p><ul>' +
      '<li><b>Zusagen</b> („Ich gehe hin“). Öffentlich ist nur die Anzahl, nie dein Name oder deine E-Mail-Adresse.</li>' +
      '<li><b>Live-Meldungen</b>, wie voll es ist. Sie werden spätestens am Morgen nach dem Event gelöscht.</li>' +
      '<li><b>Erinnerungen</b> an Events (Premium). Dafür schicken wir dir am Eventtag eine E-Mail.</li>' +
      '<li><b>Premium-Status</b>: gewählter Pass, Laufzeit und die Kundennummer bei unserem Zahlungsdienst.</li></ul>' +

      '<h2>5. Zahlung</h2>' +
      '<p>Zahlungen wickelt Stripe ab (Stripe Payments Europe, Limited, 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland). ' +
      'Zum Bezahlen wirst du auf eine Seite von Stripe weitergeleitet. Karten- und Kontodaten gibst du nur dort ein. Wir sehen und speichern sie nie. ' +
      'Wir übermitteln an Stripe deine E-Mail-Adresse und den gewählten Pass und erhalten zurück, ob die Zahlung geklappt hat. ' +
      'Stripe verarbeitet Daten auch in eigener Verantwortung, etwa zur Betrugsabwehr, und kann Daten in die USA übermitteln. ' +
      'Näheres steht in der Datenschutzerklärung von Stripe (stripe.com/at/privacy). ' +
      'Rechtsgrundlage ist die Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO). Rechnungsdaten müssen wir sieben Jahre aufbewahren ' +
      '(§ 132 BAO, Art. 6 Abs. 1 lit. c DSGVO).</p>' +

      '<h2>6. KI-Assistent</h2>' +
      '<p>Der Assistent ist eine künstliche Intelligenz, kein Mensch. Wenn du ihm schreibst, schicken wir deine Nachrichten und den bisherigen ' +
      'Gesprächsverlauf an Anthropic (Anthropic, PBC, San Francisco, USA), den Anbieter des Sprachmodells Claude. Anthropic verarbeitet die Daten ' +
      'in unserem Auftrag und erstellt die Antwort. Dabei werden Daten in die USA übermittelt. Grundlage dafür sind die von der EU-Kommission ' +
      'vorgesehenen Garantien (Angemessenheitsbeschluss beziehungsweise Standardvertragsklauseln).</p>' +
      '<p>Wir schicken weder deine E-Mail-Adresse noch andere Kontodaten mit. Wir selbst speichern den Gesprächsverlauf nicht: ' +
      'Er liegt nur in deinem Browser und ist weg, sobald du die Seite schließt oder neu lädst. Wir zählen lediglich, wie viele Fragen pro Tag gestellt wurden, ' +
      'um das Tageslimit einzuhalten. Anthropic speichert Anfragen nach eigenen Angaben für begrenzte Zeit, um Missbrauch zu erkennen.</p>' +
      '<p>Schreib bitte keine sensiblen Daten in den Chat (Gesundheit, Adresse, volle Namen anderer Personen). ' +
      'Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die du vor der ersten Nachricht gibst. ' +
      'Du kannst sie jederzeit widerrufen, indem du im Chat auf „Einwilligung widerrufen“ tippst. Die Antworten der KI können falsch sein.</p>' +

      '<h2>7. E-Mails</h2>' +
      '<p>Wir schicken dir nur E-Mails, die du selbst auslöst: den Anmeldelink und Erinnerungen, die du eingeschaltet hast. Es gibt keinen Newsletter. ' +
      'Für den Versand nutzen wir einen E-Mail-Dienstleister, der die Daten in unserem Auftrag verarbeitet.</p>' +

      '<h2>8. Cookies und Speicher im Browser</h2>' +
      '<p>Wir verwenden nur, was technisch nötig ist. Deshalb gibt es keinen Cookie-Banner (§ 165 Abs. 3 TKG 2021).</p><ul>' +
      '<li><b>Cookie „ns_sid“</b>: hält dich angemeldet. Es wird erst gesetzt, wenn du dich anmeldest, gilt 30 Tage und wird beim Abmelden gelöscht.</li>' +
      '<li><b>Lokaler Speicher</b>: gewählte Sprache, deine Altersbestätigung und deine Einwilligung für den KI-Assistenten. Diese Angaben bleiben in deinem Browser.</li></ul>' +

      '<h2>9. Wie lange speichern wir?</h2><ul>' +
      '<li>Kontodaten: bis du dein Konto löschst. Das geht jederzeit unter „Konto“ und wirkt sofort.</li>' +
      '<li>Zusagen: bis zum Tag nach dem Event. Live-Meldungen: höchstens bis zum Morgen danach.</li>' +
      '<li>Anmeldelinks: 30 Minuten. Anmeldung im Browser: 30 Tage.</li>' +
      '<li>Rechnungsdaten bei Stripe: sieben Jahre (gesetzliche Pflicht).</li></ul>' +

      '<h2>10. Deine Rechte</h2>' +
      '<p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. ' +
      'Eine Einwilligung kannst du jederzeit widerrufen. Unter „Konto“ kannst du alle gespeicherten Daten als Datei herunterladen und dein Konto löschen. ' +
      'Für alles andere schreib an ' + val(o.email, 'E-Mail-Adresse') + '.</p>' +
      '<p>Wenn du meinst, dass wir deine Daten nicht richtig behandeln, kannst du dich bei der Österreichischen Datenschutzbehörde beschweren: ' +
      'Barichgasse 40–42, 1030 Wien, dsb.gv.at.</p>' +

      '<h2>11. Jugendliche</h2>' +
      '<p>Nightstamp richtet sich an Personen ab 16 Jahren. Premium kaufen und Events ab 18 zusagen kannst du erst ab 18.</p>' +

      '<p class="fine">Stand: ' + esc(d.updated) + '</p>';
  }

  function imprint(d) {
    var o = d.operator;
    return draftNote(o) +
      '<p>Angaben nach § 5 E-Commerce-Gesetz und Offenlegung nach § 25 Mediengesetz.</p>' +
      '<h2>Medieninhaber und Betreiber</h2>' + operatorBlock(o) +
      '<h2>Unternehmen</h2><ul>' +
      '<li>Unternehmensgegenstand: ' + val(o.business, 'Unternehmensgegenstand') + '</li>' +
      '<li>UID-Nummer: ' + (o.uid ? esc(o.uid) : 'keine') + '</li>' +
      '<li>Firmenbuch: ' + (o.register ? esc(o.register) : 'nicht eingetragen') + '</li>' +
      '<li>Aufsichtsbehörde: ' + val(o.authority, 'zuständige Behörde (zum Beispiel Bezirkshauptmannschaft oder Magistrat)') + '</li></ul>' +
      '<h2>Grundlegende Richtung</h2>' +
      '<p>Nightstamp informiert über Clubs und Veranstaltungen in österreichischen Städten.</p>' +
      '<h2>Angaben zu Events und Clubs</h2>' +
      '<p>Die Angaben stammen aus öffentlichen Veranstaltungskalendern; die Quelle steht bei jedem Event. Termine, Zeiten und Preise können sich ändern ' +
      'oder Events können ausfallen. Bitte prüfe sie vor dem Besuch beim Veranstalter. Nightstamp ist nicht Veranstalter und verkauft keine Tickets. ' +
      'Clubs und Veranstalter, die einen Eintrag korrigieren oder entfernen lassen möchten, schreiben bitte an ' + val(o.email, 'E-Mail-Adresse') + '.</p>' +
      '<h2>Links</h2>' +
      '<p>Für Inhalte verlinkter fremder Seiten sind deren Betreiber verantwortlich.</p>' +
      '<h2>Schriften</h2>' +
      '<p>Bricolage Grotesque und Instrument Sans, beide unter der SIL Open Font License 1.1.</p>';
  }

  function terms(d) {
    var o = d.operator, p = d.prices;
    return draftNote(o) +
      '<h2>1. Worum geht es?</h2>' +
      '<p>Diese Bedingungen gelten zwischen dir und dem Betreiber von Nightstamp (siehe Impressum). Nightstamp zeigt Clubs und Events und ist in der Grundversion kostenlos. ' +
      'Premium schaltet zusätzliche Funktionen frei.</p>' +
      '<h2>2. Konto und Alter</h2>' +
      '<p>Die Website darfst du ab 16 Jahren nutzen. Ein Konto bekommst du mit einer bestätigten E-Mail-Adresse. Premium kannst du erst ab 18 Jahren kaufen. ' +
      'Pro Person ist ein Konto erlaubt. Zusagen und Live-Meldungen müssen ehrlich sein; wer Zahlen manipuliert, kann gesperrt werden.</p>' +
      '<h2>3. Was Premium enthält</h2>' +
      '<p>Alle Clubs jeder Stadt, Live-Andrang am Eventabend, Erinnerungen per E-Mail am Eventtag und mehr Fragen an den KI-Assistenten pro Tag. ' +
      'Der Live-Andrang beruht auf Meldungen anderer Gäste; wenn niemand meldet, gibt es keine Anzeige.</p>' +
      '<h2>4. Preise und Laufzeit</h2><ul>' +
      '<li>Wochenpass: ' + euro(p.week.cents) + ' (Studierende ' + euro(p.week.student) + '), einmalige Zahlung, endet nach 7 Tagen von selbst.</li>' +
      '<li>Monatsabo: ' + euro(p.month.cents) + ' pro Monat (Studierende ' + euro(p.month.student) + ').</li>' +
      '<li>Jahresabo: ' + euro(p.year.cents) + ' pro Jahr (Studierende ' + euro(p.year.student) + ').</li></ul>' +
      '<p>Alle Preise enthalten die gesetzliche Umsatzsteuer. Den Studierendenpreis bekommst du, wenn dein Konto mit der E-Mail-Adresse einer österreichischen Hochschule angelegt ist.</p>' +
      '<p>Abos verlängern sich jeweils um einen Monat beziehungsweise ein Jahr, bis du kündigst. Kündigen kannst du jederzeit zum Ende der bezahlten Laufzeit: ' +
      'unter „Konto“ → „Abo und Rechnungen verwalten“. Bis dahin bleibt Premium aktiv.</p>' +
      '<h2>5. Zahlung</h2>' +
      '<p>Die Zahlung läuft über Stripe. Welche Zahlungsarten angeboten werden (zum Beispiel Karte, Apple Pay, Google Pay, EPS), siehst du vor dem Bezahlen. ' +
      'Bei Abos wird der Betrag zu Beginn jeder Laufzeit abgebucht. Schlägt eine Abbuchung fehl, endet Premium.</p>' +
      '<h2>6. Rücktrittsrecht</h2>' +
      '<p>Als Verbraucherin oder Verbraucher kannst du binnen 14 Tagen ab Vertragsabschluss ohne Angabe von Gründen vom Vertrag zurücktreten ' +
      '(§ 11 Fern- und Auswärtsgeschäfte-Gesetz). Dafür genügt eine eindeutige Erklärung, zum Beispiel eine E-Mail an ' + val(o.email, 'E-Mail-Adresse') +
      ' mit dem Satz: „Ich trete von meinem Vertrag über Nightstamp Premium zurück.“ sowie deiner Konto-E-Mail-Adresse. Die Frist ist gewahrt, wenn du die Erklärung vor Ablauf absendest.</p>' +
      '<p>Nach einem Rücktritt zahlen wir dir alle Zahlungen binnen 14 Tagen auf dem ursprünglichen Zahlungsweg zurück.</p>' +
      '<p>Premium wird sofort nach der Zahlung freigeschaltet. Deshalb bitten wir dich beim Kauf um deine ausdrückliche Zustimmung, dass wir vor Ablauf der Rücktrittsfrist beginnen. ' +
      'Trittst du danach zurück, zahlst du nur den Anteil für die Zeit, in der Premium bis zum Rücktritt aktiv war. ' +
      'Ist die Leistung vollständig erbracht (zum Beispiel ein abgelaufener Wochenpass), besteht kein Rücktrittsrecht mehr.</p>' +
      '<h2>7. Events, Tickets, Clubs</h2>' +
      '<p>Nightstamp ist nicht Veranstalter und verkauft keine Tickets. Ticketlinks führen zu den Veranstaltern oder deren Ticketpartnern; dort kommt der Vertrag zustande. ' +
      'Alle Angaben zu Events sind ohne Gewähr. Über den Einlass entscheidet der Club.</p>' +
      '<h2>8. KI-Assistent</h2>' +
      '<p>Der Assistent ist eine KI. Seine Antworten können unvollständig oder falsch sein und sind keine verbindliche Auskunft.</p>' +
      '<h2>9. Haftung</h2>' +
      '<p>Wir haften für Vorsatz und grobe Fahrlässigkeit sowie für Personenschäden. Für leichte Fahrlässigkeit haften wir sonst nicht. Deine gesetzlichen Gewährleistungsrechte bleiben unberührt.</p>' +
      '<h2>10. Schlussbestimmungen</h2>' +
      '<p>Es gilt österreichisches Recht. Zwingende Verbraucherschutzbestimmungen des Staates, in dem du wohnst, bleiben anwendbar.</p>' +
      '<p class="fine">Stand: ' + esc(d.updated) + '</p>';
  }

  function youth() {
    return '<p>Nightstamp ist für Leute ab 16. Hier steht, wie wir mit dem Alter umgehen und was beim Ausgehen gilt.</p>' +
      '<h2>Auf Nightstamp</h2><ul>' +
      '<li>Beim ersten Besuch bestätigst du, dass du mindestens 16 bist.</li>' +
      '<li>Für ein Konto prüfen wir dein Geburtsdatum. Unter 16 gibt es kein Konto.</li>' +
      '<li>Premium kaufen kannst du erst ab 18.</li>' +
      '<li>Bei Events, die ab 18 sind, kannst du nur zusagen, wenn du volljährig bist.</li>' +
      '<li>Der KI-Assistent gibt keine Tipps zum Umgehen von Alterskontrollen.</li></ul>' +
      '<h2>Mindestalter bei Events</h2>' +
      '<p>Wenn der Veranstalter ein Mindestalter nennt, steht es beim Event. Steht dort „beim Veranstalter erfragen“, kennen wir es nicht. ' +
      'Viele Clubnächte sind ab 18, auch wenn es nicht dabeisteht. Nimm immer einen amtlichen Lichtbildausweis mit. Über den Einlass entscheidet der Club.</p>' +
      '<h2>Was in Österreich gilt</h2>' +
      '<p>Jugendschutz ist Landessache. Die wichtigsten Regeln sind in den Bundesländern weitgehend gleich:</p><ul>' +
      '<li>Bier, Wein und Sekt: ab 16.</li>' +
      '<li>Spirituosen und Getränke, die sie enthalten (auch Mischgetränke): ab 18.</li>' +
      '<li>Tabak, E-Zigaretten und Nikotinbeutel: ab 18.</li>' +
      '<li>Ausgehen: Ab 16 gibt es in der Regel keine zeitliche Grenze mehr. Für Jüngere gelten Ausgehzeiten, die je nach Bundesland etwas abweichen.</li></ul>' +
      '<p>Verbindlich ist das Jugendschutzgesetz deines Bundeslandes. Einen Überblick gibt es auf oesterreich.gv.at unter „Jugendschutz“.</p>' +
      '<h2>Wenn etwas schiefgeht</h2><ul>' +
      '<li>Rettung: 144 · Euronotruf: 112 · Polizei: 133</li>' +
      '<li>Rat auf Draht (für junge Leute, kostenlos, rund um die Uhr): 147</li>' +
      '<li>Lass dein Getränk nicht unbeaufsichtigt. Wenn dir oder jemandem plötzlich schlecht oder schwindlig wird, hol sofort das Clubpersonal und ruf die Rettung.</li>' +
      '<li>Geh nicht allein nach Hause, wenn es sich vermeiden lässt, und sag jemandem Bescheid, wenn du gut angekommen bist.</li></ul>';
  }

  window.NS_LEGAL = {
    pages: ['privacy', 'imprint', 'terms', 'youth'],
    title: function (page, lang) { return TITLES[page][lang] || TITLES[page].de; },
    html: function (page, data) {
      if (page === 'privacy') return privacy(data);
      if (page === 'imprint') return imprint(data);
      if (page === 'terms') return terms(data);
      return youth();
    }
  };
})();

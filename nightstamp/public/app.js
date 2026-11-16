/* Nightstamp – Oberfläche. Aufbau und Aussehen folgen der Vorschau; die Daten kommen vom Server. */
(function () {
  'use strict';

  /* ---------- Icons ---------- */
  var ICON = {
    search: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4.2-4.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.1l-5.6 2.9 1.1-6.2L2.9 9.4l6.3-.9z" fill="currentColor"/></svg>',
    person: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    ext: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    bell: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 20.5a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    spark: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" fill="currentColor"/></svg>'
  };
  var LEVELS = ['quiet', 'good', 'full', 'queue'];
  var GENRE_ORDER = ['techno', 'rave', 'dnb', 'house', 'hiphop', 'latin', 'rock', 'pop', 'party', 'festival', 'student'];
  var FREE_CLUBS = 3;

  /* ---------- Texte ---------- */
  var T = {
    de: {
      note: function (d) { return 'Eventdaten Stand ' + d + ' · ohne Gewähr · ab 16'; },
      q1: 'Was geht', q2: 'in', q3: '?',
      whenLabel: 'Zeitraum', cityLabel: 'Stadt', langLabel: 'Sprache', nav: 'Hauptmenü',
      when: { today: 'heute', tomorrow: 'morgen', weekend: 'am Wochenende', all: 'demnächst' },
      hint: 'Echte Clubs und Termine aus öffentlichen Veranstaltungskalendern. Die Quelle steht bei jedem Event. Prüfe Zeit und Tickets vor dem Losgehen beim Veranstalter.',
      genreLabel: 'Musikrichtung', all: 'Alle',
      genres: { techno: 'Techno', rave: 'Rave', dnb: 'Drum & Bass', hiphop: 'HipHop', house: 'House', latin: 'Latin', rock: 'Rock', pop: 'Pop & Indie', party: 'Party', festival: 'Festival', student: 'Studentenparty' },
      events: 'Events', clubs: 'Clubs', premium: 'Premium', discover: 'Entdecken', signin: 'Anmelden', account: 'Konto',
      today: 'Heute', tomorrow: 'Morgen', noTime: 'offen',
      go: 'Ich gehe hin', gone: 'Bin dabei',
      going: function (n) { return n === 0 ? 'Noch keine Zusagen' : n === 1 ? '1 geht hin' : n + ' gehen hin'; },
      ticketsFrom: function (p) { return 'Tickets ab ' + p + ' €'; },
      from: function (p) { return 'ab ' + p + ' €'; },
      free: 'Eintritt frei', infoTickets: 'Infos & Tickets', priceUnknown: 'Preis beim Veranstalter',
      emptyEvents: function (c) { return 'Dazu ist in ' + c + ' gerade nichts eingetragen.'; },
      emptyClubs: function (c) { return 'Dazu ist in ' + c + ' kein Club eingetragen.'; },
      showAllDates: 'Alle Termine zeigen', showAll: 'Alle Musikrichtungen zeigen',
      back: 'Zurück zur Liste',
      fWhen: 'Wann', fWhere: 'Wo', fMusic: 'Musik', fEntry: 'Einlass', fSource: 'Quelle',
      fAddress: 'Adresse', fWeb: 'Website', fProgram: 'Programm',
      fromTime: function (t) { return 'ab ' + t; }, timeOpen: 'Uhrzeit beim Veranstalter',
      age: function (a) { return a ? 'ab ' + a + ' Jahren' : 'Mindestalter beim Veranstalter erfragen. Ausweis mitnehmen.'; },
      buyNote: 'Du kaufst direkt beim Veranstalter. Nightstamp verkauft keine Tickets und verlangt keinen Aufschlag.',
      sourceLine: function (s, d) { return 'Quelle: ' + s + ' · Stand ' + d; },
      remOff: 'Erinnerung am Eventtag', remOn: 'Erinnerung ist an',
      remSet: 'Erinnerung an. Du bekommst am Eventtag eine E-Mail.', remUnset: 'Erinnerung aus.',
      voteRule: 'Zählt nur mit bestätigtem Konto, eine Stimme pro Konto. Öffentlich ist nur die Zahl, nie dein Name.',
      liveTitle: 'Wie voll ist es?', liveAsk: 'Bist du schon dort? Wie voll ist es?',
      lv: { quiet: 'Ruhig', good: 'Gut besucht', full: 'Voll', queue: 'Lange Schlange' },
      liveMeta: function (m, n) { return 'Letzte Meldung vor ' + m + ' Min., ' + n + (n === 1 ? ' Meldung' : ' Meldungen') + ' in der letzten Stunde'; },
      liveNone: 'Noch keine Meldung', liveNoneText: 'In der letzten Stunde hat niemand gemeldet.',
      liveLater: 'Live-Meldungen gibt es am Abend des Events.',
      liveLocked: 'Mit Premium siehst du live, wie voll es ist und ob eine Schlange steht.',
      liveWho: 'Melden kann, wer zugesagt hat.',
      liveThanks: 'Danke! Deine Meldung hilft allen, die noch unterwegs sind.',
      liveTeaser: 'Wie voll?',
      copy: 'Infos kopieren', copied: 'Kopiert', copyFail: 'Kopieren ist hier gesperrt.',
      askAi: 'KI zu diesem Event fragen',
      askAiPrompt: function (t, v) { return 'Erzähl mir mehr über „' + t + '“ im ' + v + '. Was sollte ich wissen und was passt sonst noch dazu?'; },
      site: function (v) { return 'Website von ' + v; },
      next: 'Nächste Events', noNext: 'Bei uns ist gerade kein Termin eingetragen. Das aktuelle Programm findest du auf der Website des Clubs.',
      moreClubs: function (n, c) { return 'Noch ' + n + (n === 1 ? ' Club' : ' Clubs') + ' in ' + c; },
      moreClubsText: 'Kostenlos siehst du drei Clubs jeder Stadt. Mit Premium siehst du alle.',
      allClubsBtn: 'Alle Clubs mit Premium',
      clubLocked: 'Website, Programm und Live-Andrang dieses Clubs siehst du mit Premium.',
      seePremium: 'Premium ansehen',
      close: 'Schließen', cancel: 'Abbrechen',
      up: {
        live: ['Live-Andrang gibt es mit Premium', 'Sieh vor dem Losgehen, wie voll es gerade ist und ob eine Schlange steht. Die Meldungen kommen von Leuten, die schon dort sind.'],
        reminder: ['Erinnerungen gibt es mit Premium', 'Wir schicken dir am Eventtag eine E-Mail mit Zeit, Ort und Ticketlink.'],
        clubs: ['Alle Clubs gibt es mit Premium', 'Kostenlos siehst du drei Clubs jeder Stadt. Mit Premium siehst du alle, mit Website, Programm und Live-Andrang.']
      },
      upPrice: 'Ab 4,99 € pro Woche, für Studierende ab 3,99 €.',
      authTitle: { vote: 'Melde dich an, um zuzusagen', buy: 'Melde dich an, um Premium zu holen', account: 'Anmelden', reminder: 'Melde dich an für Erinnerungen' },
      authText: {
        vote: 'Zusagen zählen nur mit bestätigtem Konto, eine Stimme pro Konto. So kann niemand die Zahlen mit Bots aufblähen.',
        buy: 'Dein Pass gehört zu deinem Konto und gilt auf jedem Gerät.',
        account: 'Mit einem Konto kannst du zusagen, melden, wie voll es ist, und Premium nutzen.',
        reminder: 'Die Erinnerung schicken wir an die E-Mail-Adresse deines Kontos.'
      },
      emailLabel: 'E-Mail-Adresse', birthLabel: 'Geburtsdatum',
      birthHelp: 'Wir prüfen damit nur dein Alter. Gespeichert wird lediglich, ob du volljährig bist.',
      privacyLabel1: 'Ich habe die ', privacyLabel2: ' gelesen und bin einverstanden, dass mein Konto angelegt wird.',
      authSubmit: 'Anmeldelink schicken',
      errEmail: 'Gib eine E-Mail-Adresse ein, zum Beispiel name@beispiel.at.',
      errBirth: 'Gib dein Geburtsdatum ein.',
      errPrivacy: 'Bitte bestätige die Datenschutzerklärung.',
      authFine: 'Kein Passwort nötig. Du bekommst einen Link per E-Mail, der 30 Minuten gilt.',
      sentTitle: 'Schau in dein Postfach',
      sentText: function (e) { return 'Wir haben einen Anmeldelink an ' + e + ' geschickt. Öffne ihn auf diesem Gerät. Er gilt 30 Minuten.'; },
      sentDev: 'Entwicklungsmodus: Es ist kein E-Mail-Versand eingerichtet. Der Link steht auch im Server-Log.',
      sentDevBtn: 'Anmeldelink jetzt öffnen',
      signedIn: 'Angemeldet.', signedVote: 'Angemeldet. Deine Zusage zählt.',
      accTitle: 'Dein Konto', accConfirmed: function (e) { return e + ', bestätigt'; },
      plan: 'Dein Plan', planFree: 'Kostenlos',
      planNames: { week: 'Wochenpass', month: 'Monatsabo', year: 'Jahresabo' },
      planUntil: function (n, d, renews) { return 'Premium, ' + n + '. ' + (renews ? 'Verlängert sich am ' + d + '.' : 'Läuft bis ' + d + ' und endet dann von selbst.'); },
      manage: 'Abo und Rechnungen verwalten',
      myGoing: 'Deine Zusagen', myNone: 'Noch keine Zusagen. Tippe bei einem Event auf „Ich gehe hin“.',
      myReminders: 'Deine Erinnerungen',
      myData: 'Deine Daten',
      myDataText: 'Öffentlich ist nur die Anzahl der Zusagen, nie dein Name. Du kannst alles, was wir zu deinem Konto speichern, als Datei herunterladen oder dein Konto samt Daten sofort löschen.',
      exportBtn: 'Meine Daten herunterladen',
      logout: 'Abmelden', del: 'Konto löschen', delConfirm: 'Konto und alle Daten löschen',
      delAsk: 'Dein Konto, deine Zusagen, Erinnerungen und Meldungen werden sofort gelöscht. Ein laufendes Abo wird beendet. Das lässt sich nicht rückgängig machen.',
      loggedOut: 'Abgemeldet.', deleted: 'Konto gelöscht. Deine Daten sind entfernt.',
      premiumLead: 'Events, Zusagen und Ticketlinks bleiben kostenlos. Premium zeigt dir mehr, bevor du losgehst.',
      reasons: [
        ['Alle Clubs der Stadt', 'Kostenlos siehst du drei pro Stadt.'],
        ['Live sehen, wie voll es ist', 'Vor dem Losgehen, nicht erst vor der Tür.'],
        ['Kein Event vergessen', 'Erinnerung per E-Mail am Eventtag.'],
        ['Mehr Fragen an die KI', 'Bis zu 50 Fragen pro Tag an den Ausgeh-Assistenten.']
      ],
      priceLabel: 'Preis', normal: 'Normalpreis', studentL: 'Studierende',
      studentOk: 'Dein Konto läuft auf eine Hochschul-Adresse. Der Studierendenpreis gilt.',
      studentNote: 'Den Studierendenpreis bekommst du, wenn dein Konto mit der E-Mail-Adresse einer österreichischen Hochschule angelegt ist (zum Beispiel …@uni-graz.at oder …ac.at).',
      choose: 'Wähle deinen Pass',
      passes: [
        { id: 'week', n: 'Wochenpass', u: 'einmalig', d: 'Für den Urlaub. Einmal zahlen, endet nach 7 Tagen von selbst.' },
        { id: 'month', n: 'Monatsabo', u: 'pro Monat', d: 'Jeden Monat kündbar.' },
        { id: 'year', n: 'Jahresabo', u: 'pro Jahr', d: 'Entspricht 3,33 € im Monat.', ds: 'Entspricht 2,50 € im Monat.' }
      ],
      termsLabel1: 'Ich akzeptiere die ', termsLabel2: ' und habe die ', termsLabel3: ' gelesen.',
      withdrawLabel: 'Ich möchte, dass Premium sofort freigeschaltet wird. Mir ist bekannt, dass ich bei einem Rücktritt innerhalb von 14 Tagen den Anteil für die bereits genutzte Zeit zahle.',
      buyPass: function (n, p) { return n + ' für ' + p + ' kaufen'; },
      payMethods: 'Du bezahlst sicher über Stripe: mit Karte, Apple Pay oder Google Pay, je nach Verfügbarkeit auch mit EPS-Überweisung, PayPal oder Klarna. Alle Preise inklusive Umsatzsteuer. Deine Zahlungsdaten gibst du nur bei Stripe ein, wir sehen sie nie.',
      buyFine: 'Abos kannst du jederzeit zum Ende der Laufzeit in deinem Konto kündigen. Premium gibt es ab 18.',
      payOff: 'Die Zahlung ist auf diesem Server noch nicht eingerichtet. Premium kann gerade nicht gekauft werden.',
      errTerms: 'Bitte bestätige beide Kästchen.',
      paidWait: 'Danke! Die Zahlung wird bestätigt …', paidOk: 'Premium ist aktiv. Viel Spaß!',
      paidSlow: 'Die Zahlung ist noch nicht bestätigt. Das kann ein paar Minuten dauern. Lade die Seite dann neu.',
      paidCancel: 'Zahlung abgebrochen. Es wurde nichts abgebucht.',
      premActive: 'Premium ist aktiv',
      includes: 'Kostenlos und Premium im Vergleich', colFeature: 'Funktion', colFree: 'Kostenlos', colPrem: 'Premium', yes: 'Ja', no: 'Nein',
      cmp: function (f) {
        return [
          ['Alle Events und Ticketlinks', 1, 1],
          ['„Ich gehe hin“', 1, 1],
          ['Clubs', FREE_CLUBS + ' je Stadt', 'Alle'],
          ['Live: Wie voll ist es?', 'Nur melden', 1],
          ['Erinnerung am Eventtag', 0, 1],
          ['KI-Assistent', f.aiFree + ' Fragen pro Tag', f.aiPremium + ' pro Tag']
        ];
      },
      gateTitle: 'Bist du mindestens 16 Jahre alt?',
      gateText: 'Auf Nightstamp geht es um Clubs und Nachtleben. Die Seite ist für Leute ab 16.',
      gateFine: 'Deine Antwort wird nur in diesem Browser gespeichert.',
      gateYes: 'Ja, ich bin 16 oder älter', gateNo: 'Nein',
      gateDenied: 'Dann musst du noch etwas warten.', gateDeniedText: 'Nightstamp ist erst ab 16. Schau wieder vorbei, wenn es so weit ist.',
      gateRetry: 'Ich habe mich vertippt',
      aiBtn: 'KI fragen', aiTitle: 'Ausgeh-Assistent', aiTag: 'KI · kann sich irren',
      aiHello: 'Hi! Sag mir Stadt, Tag oder Musik und ich suche dir aus unseren Terminen etwas Passendes.',
      aiSugg: function (c) { return ['Was geht am Wochenende in ' + c + '?', 'Welche Clubs in ' + c + ' spielen Techno?', 'Ich mag Indie und Rock. Was passt in den nächsten Wochen?']; },
      aiPlaceholder: 'Deine Frage …', aiSend: 'Senden', aiClear: 'Verlauf löschen', aiRevoke: 'Einwilligung widerrufen',
      aiFine: 'Antworten kommen von einer KI und können falsch sein. Prüfe Zeit und Tickets beim Veranstalter.',
      aiLeft: function (n) { return 'Heute noch ' + n + (n === 1 ? ' Frage' : ' Fragen'); },
      aiConsentTitle: 'Bevor es losgeht',
      aiConsentText: [
        'Der Ausgeh-Assistent ist eine künstliche Intelligenz (Claude von Anthropic), kein Mensch.',
        'Deine Nachrichten werden zur Beantwortung an Anthropic in die USA übermittelt. Dein Konto und deine E-Mail-Adresse schicken wir nicht mit. Wir speichern den Verlauf nicht.',
        'Schreib bitte keine sensiblen Daten in den Chat. Die Antworten können Fehler enthalten.'
      ],
      aiConsentMore1: 'Mehr dazu in der ', aiConsentMore2: '.',
      aiConsentBtn: 'Einverstanden, Chat starten',
      aiRevoked: 'Einwilligung widerrufen. Der Verlauf ist gelöscht.',
      aiOff: 'Der KI-Assistent ist auf diesem Server noch nicht eingerichtet.',
      legalLang: '',
      footNote: function (d) { return 'Stand der Eventdaten: ' + d + '. Alle Angaben ohne Gewähr. Nightstamp ist nicht Veranstalter und verkauft keine Tickets. Keine Werbung, kein Tracking.'; },
      loadFail: 'Die Daten konnten nicht geladen werden.', retry: 'Nochmal versuchen',
      err: {
        too_young: 'Nightstamp ist erst ab 16 Jahren.', bad_email: 'Diese E-Mail-Adresse sieht nicht richtig aus.', bad_birthdate: 'Dieses Geburtsdatum sieht nicht richtig aus.',
        slow_down: 'Das war etwas schnell. Warte kurz und versuch es nochmal.', mail_not_configured: 'Der E-Mail-Versand ist noch nicht eingerichtet. Anmelden geht gerade nicht.',
        link_invalid: 'Dieser Anmeldelink ist abgelaufen oder wurde schon benutzt. Fordere einen neuen an.',
        login_required: 'Bitte melde dich zuerst an.', adults_only: 'Das geht erst ab 18.', not_going: 'Melden kann, wer zugesagt hat.', not_tonight: 'Melden geht nur am Abend des Events.',
        premium_required: 'Das gibt es mit Premium.', pay_not_configured: 'Die Zahlung ist noch nicht eingerichtet.', not_student: 'Der Studierendenpreis gilt nur mit Hochschul-E-Mail-Adresse.',
        already_premium: 'Du hast schon ein laufendes Abo.', no_event: 'Dieses Event gibt es nicht mehr.', cancel_failed: 'Dein Abo konnte nicht beendet werden. Versuch es später nochmal oder schreib uns.',
        ai_not_configured: 'Der KI-Assistent ist noch nicht eingerichtet.', ai_busy: 'Der Assistent ist gerade überlastet. Versuch es gleich nochmal.',
        ai_limit_free: 'Du hast dein Tageslimit erreicht. Mit Premium kannst du mehr fragen.', ai_limit_premium: 'Du hast dein Tageslimit erreicht. Morgen geht es weiter.',
        ai_refused: 'Dabei kann ich nicht helfen.', ai_error: 'Da ist etwas schiefgegangen. Versuch es nochmal.',
        server_error: 'Da ist etwas schiefgegangen. Versuch es nochmal.', offline: 'Keine Verbindung zum Server.'
      }
    },
    en: {
      note: function (d) { return 'Event data as of ' + d + ' · no guarantee · 16+'; },
      q1: 'What’s on', q2: 'in', q3: '?',
      whenLabel: 'Time span', cityLabel: 'City', langLabel: 'Language', nav: 'Main menu',
      when: { today: 'today', tomorrow: 'tomorrow', weekend: 'this weekend', all: 'soon' },
      hint: 'Real clubs and dates from public event calendars. Every event names its source. Check time and tickets with the organiser before you head out.',
      genreLabel: 'Music', all: 'All',
      genres: { techno: 'Techno', rave: 'Rave', dnb: 'Drum & bass', hiphop: 'Hip hop', house: 'House', latin: 'Latin', rock: 'Rock', pop: 'Pop & indie', party: 'Party', festival: 'Festival', student: 'Student party' },
      events: 'Events', clubs: 'Clubs', premium: 'Premium', discover: 'Discover', signin: 'Sign in', account: 'Account',
      today: 'Today', tomorrow: 'Tomorrow', noTime: 'tba',
      go: 'I’m going', gone: 'I’m in',
      going: function (n) { return n === 0 ? 'Nobody yet' : n + ' going'; },
      ticketsFrom: function (p) { return 'Tickets from €' + p; },
      from: function (p) { return 'from €' + p; },
      free: 'Free entry', infoTickets: 'Info & tickets', priceUnknown: 'Price from the organiser',
      emptyEvents: function (c) { return 'Nothing is listed for that in ' + c + ' right now.'; },
      emptyClubs: function (c) { return 'No club is listed for that in ' + c + '.'; },
      showAllDates: 'Show all dates', showAll: 'Show all music',
      back: 'Back to the list',
      fWhen: 'When', fWhere: 'Where', fMusic: 'Music', fEntry: 'Admission', fSource: 'Source',
      fAddress: 'Address', fWeb: 'Website', fProgram: 'Programme',
      fromTime: function (t) { return 'from ' + t; }, timeOpen: 'time from the organiser',
      age: function (a) { return a ? a + ' and over' : 'Ask the organiser about the minimum age. Bring ID.'; },
      buyNote: 'You buy straight from the organiser. Nightstamp sells no tickets and adds no fee.',
      sourceLine: function (s, d) { return 'Source: ' + s + ' · as of ' + d; },
      remOff: 'Reminder on the day', remOn: 'Reminder is on',
      remSet: 'Reminder on. We’ll email you on the day.', remUnset: 'Reminder off.',
      voteRule: 'Counts only with a confirmed account, one vote per account. Only the number is public, never your name.',
      liveTitle: 'How full is it?', liveAsk: 'Already there? How full is it?',
      lv: { quiet: 'Quiet', good: 'Lively', full: 'Packed', queue: 'Long queue' },
      liveMeta: function (m, n) { return 'Last report ' + m + ' min ago, ' + n + (n === 1 ? ' report' : ' reports') + ' in the past hour'; },
      liveNone: 'No report yet', liveNoneText: 'Nobody has reported in the past hour.',
      liveLater: 'Live reports start on the night of the event.',
      liveLocked: 'With Premium you see live how full it is and whether there’s a queue.',
      liveWho: 'Only people who said they’re going can report.',
      liveThanks: 'Thanks! Your report helps everyone still on their way.',
      liveTeaser: 'How full?',
      copy: 'Copy details', copied: 'Copied', copyFail: 'Copying is blocked here.',
      askAi: 'Ask the AI about this event',
      askAiPrompt: function (t, v) { return 'Tell me more about “' + t + '” at ' + v + '. What should I know, and what else would fit?'; },
      site: function (v) { return v + ' website'; },
      next: 'Coming up', noNext: 'We have no date listed right now. You’ll find the current programme on the club’s website.',
      moreClubs: function (n, c) { return n + (n === 1 ? ' more club' : ' more clubs') + ' in ' + c; },
      moreClubsText: 'Free shows three clubs in each city. Premium shows all of them.',
      allClubsBtn: 'All clubs with Premium',
      clubLocked: 'Premium shows this club’s website, programme and live crowd level.',
      seePremium: 'See Premium',
      close: 'Close', cancel: 'Cancel',
      up: {
        live: ['Live crowd levels come with Premium', 'See how full it is and whether there’s a queue before you head out. Reports come from people who are already there.'],
        reminder: ['Reminders come with Premium', 'We email you on the day with time, place and ticket link.'],
        clubs: ['All clubs come with Premium', 'Free shows three clubs in each city. Premium shows all of them, with website, programme and live crowd level.']
      },
      upPrice: 'From €4.99 a week, students from €3.99.',
      authTitle: { vote: 'Sign in to say you’re going', buy: 'Sign in to get Premium', account: 'Sign in', reminder: 'Sign in for reminders' },
      authText: {
        vote: 'Votes count only with a confirmed account, one vote per account. That keeps bots from inflating the numbers.',
        buy: 'Your pass belongs to your account and works on every device.',
        account: 'With an account you can say you’re going, report how full it is and use Premium.',
        reminder: 'We send the reminder to your account’s email address.'
      },
      emailLabel: 'Email address', birthLabel: 'Date of birth',
      birthHelp: 'We only use it to check your age. We store nothing but whether you are 18 or over.',
      privacyLabel1: 'I have read the ', privacyLabel2: ' and agree to my account being created.',
      authSubmit: 'Send sign-in link',
      errEmail: 'Enter an email address, for example name@example.com.',
      errBirth: 'Enter your date of birth.',
      errPrivacy: 'Please confirm the privacy policy.',
      authFine: 'No password needed. We email you a link that is valid for 30 minutes.',
      sentTitle: 'Check your inbox',
      sentText: function (e) { return 'We sent a sign-in link to ' + e + '. Open it on this device. It is valid for 30 minutes.'; },
      sentDev: 'Development mode: no email service is set up. The link is also in the server log.',
      sentDevBtn: 'Open sign-in link now',
      signedIn: 'Signed in.', signedVote: 'Signed in. Your vote counts.',
      accTitle: 'Your account', accConfirmed: function (e) { return e + ', confirmed'; },
      plan: 'Your plan', planFree: 'Free',
      planNames: { week: 'Week pass', month: 'Monthly', year: 'Yearly' },
      planUntil: function (n, d, renews) { return 'Premium, ' + n + '. ' + (renews ? 'Renews on ' + d + '.' : 'Runs until ' + d + ' and then ends by itself.'); },
      manage: 'Manage subscription and invoices',
      myGoing: 'Events you’re going to', myNone: 'Nothing yet. Tap “I’m going” on an event.',
      myReminders: 'Your reminders',
      myData: 'Your data',
      myDataText: 'Only the number of people going is public, never your name. You can download everything we store for your account, or delete your account and data right away.',
      exportBtn: 'Download my data',
      logout: 'Sign out', del: 'Delete account', delConfirm: 'Delete account and all data',
      delAsk: 'Your account, votes, reminders and reports are deleted right away. A running subscription ends. This can’t be undone.',
      loggedOut: 'Signed out.', deleted: 'Account deleted. Your data is gone.',
      premiumLead: 'Events, votes and ticket links stay free. Premium shows you more before you head out.',
      reasons: [
        ['Every club in town', 'Free shows three per city.'],
        ['See live how full it is', 'Before you leave, not at the door.'],
        ['Never forget an event', 'Email reminder on the day.'],
        ['More questions for the AI', 'Up to 50 questions a day for the going-out assistant.']
      ],
      priceLabel: 'Price', normal: 'Standard', studentL: 'Students',
      studentOk: 'Your account uses a university address. The student price applies.',
      studentNote: 'You get the student price if your account uses the email address of an Austrian university (for example …@uni-graz.at or …ac.at).',
      choose: 'Choose your pass',
      passes: [
        { id: 'week', n: 'Week pass', u: 'one-off', d: 'For a trip. Pay once, ends by itself after 7 days.' },
        { id: 'month', n: 'Monthly', u: 'per month', d: 'Cancel any month.' },
        { id: 'year', n: 'Yearly', u: 'per year', d: 'Works out at €3.33 a month.', ds: 'Works out at €2.50 a month.' }
      ],
      termsLabel1: 'I accept the ', termsLabel2: ' and have read the ', termsLabel3: '.',
      withdrawLabel: 'I want Premium to start right away. I understand that if I withdraw within 14 days, I pay for the share of time already used.',
      buyPass: function (n, p) { return 'Buy ' + n + ' for ' + p; },
      payMethods: 'You pay securely through Stripe: by card, Apple Pay or Google Pay, and where available EPS bank transfer, PayPal or Klarna. All prices include VAT. You enter payment details only at Stripe; we never see them.',
      buyFine: 'You can cancel subscriptions in your account at any time, effective at the end of the paid period. Premium is for ages 18 and over.',
      payOff: 'Payment is not set up on this server yet. Premium can’t be bought right now.',
      errTerms: 'Please tick both boxes.',
      paidWait: 'Thanks! Confirming your payment …', paidOk: 'Premium is active. Have fun!',
      paidSlow: 'Your payment isn’t confirmed yet. That can take a few minutes. Then reload the page.',
      paidCancel: 'Payment cancelled. Nothing was charged.',
      premActive: 'Premium is active',
      includes: 'Free and Premium compared', colFeature: 'Feature', colFree: 'Free', colPrem: 'Premium', yes: 'Yes', no: 'No',
      cmp: function (f) {
        return [
          ['All events and ticket links', 1, 1],
          ['“I’m going”', 1, 1],
          ['Clubs', FREE_CLUBS + ' per city', 'All'],
          ['Live: how full is it?', 'Report only', 1],
          ['Reminder on the day', 0, 1],
          ['AI assistant', f.aiFree + ' questions a day', f.aiPremium + ' a day']
        ];
      },
      gateTitle: 'Are you at least 16 years old?',
      gateText: 'Nightstamp is about clubs and nightlife. The site is for people aged 16 and over.',
      gateFine: 'Your answer is stored only in this browser.',
      gateYes: 'Yes, I’m 16 or older', gateNo: 'No',
      gateDenied: 'Then you’ll have to wait a little.', gateDeniedText: 'Nightstamp is for ages 16 and over. Come back when it’s time.',
      gateRetry: 'I tapped the wrong button',
      aiBtn: 'Ask AI', aiTitle: 'Going-out assistant', aiTag: 'AI · can be wrong',
      aiHello: 'Hi! Tell me a city, a day or the music you like and I’ll find something from our listings.',
      aiSugg: function (c) { return ['What’s on in ' + c + ' this weekend?', 'Which clubs in ' + c + ' play techno?', 'I like indie and rock. What fits in the next weeks?']; },
      aiPlaceholder: 'Your question …', aiSend: 'Send', aiClear: 'Clear chat', aiRevoke: 'Withdraw consent',
      aiFine: 'Answers come from an AI and can be wrong. Check time and tickets with the organiser.',
      aiLeft: function (n) { return n + (n === 1 ? ' question' : ' questions') + ' left today'; },
      aiConsentTitle: 'Before we start',
      aiConsentText: [
        'The going-out assistant is an artificial intelligence (Claude by Anthropic), not a person.',
        'Your messages are sent to Anthropic in the USA to be answered. We don’t send your account or email address along, and we don’t store the conversation.',
        'Please don’t put sensitive data in the chat. Answers can contain mistakes.'
      ],
      aiConsentMore1: 'More in the ', aiConsentMore2: '.',
      aiConsentBtn: 'Agree and start chat',
      aiRevoked: 'Consent withdrawn. The chat is cleared.',
      aiOff: 'The AI assistant is not set up on this server yet.',
      legalLang: 'Legal texts are provided in German, the language of the contract.',
      footNote: function (d) { return 'Event data as of ' + d + '. No guarantee for any details. Nightstamp is not an organiser and sells no tickets. No ads, no tracking.'; },
      loadFail: 'The data could not be loaded.', retry: 'Try again',
      err: {
        too_young: 'Nightstamp is for ages 16 and over.', bad_email: 'That email address doesn’t look right.', bad_birthdate: 'That date of birth doesn’t look right.',
        slow_down: 'That was a bit fast. Wait a moment and try again.', mail_not_configured: 'Email isn’t set up yet, so signing in doesn’t work right now.',
        link_invalid: 'This sign-in link has expired or was already used. Request a new one.',
        login_required: 'Please sign in first.', adults_only: 'That’s for ages 18 and over.', not_going: 'Only people who said they’re going can report.', not_tonight: 'Reports only work on the night of the event.',
        premium_required: 'That comes with Premium.', pay_not_configured: 'Payment isn’t set up yet.', not_student: 'The student price needs a university email address.',
        already_premium: 'You already have a running subscription.', no_event: 'This event no longer exists.', cancel_failed: 'We couldn’t end your subscription. Try again later or write to us.',
        ai_not_configured: 'The AI assistant isn’t set up yet.', ai_busy: 'The assistant is busy right now. Try again in a moment.',
        ai_limit_free: 'You’ve reached today’s limit. Premium lets you ask more.', ai_limit_premium: 'You’ve reached today’s limit. More tomorrow.',
        ai_refused: 'I can’t help with that.', ai_error: 'Something went wrong. Try again.',
        server_error: 'Something went wrong. Try again.', offline: 'No connection to the server.'
      }
    }
  };

  /* ---------- Speicher im Browser (nur Sprache, Altersbestätigung, KI-Einwilligung) ---------- */
  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (err) { return null; } }
  function lsSet(k, v) { try { if (v === null) window.localStorage.removeItem(k); else window.localStorage.setItem(k, v); } catch (err) { /* privater Modus */ } }
  function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (err) { return null; } }
  function ssSet(k, v) { try { if (v === null) window.sessionStorage.removeItem(k); else window.sessionStorage.setItem(k, v); } catch (err) { /* privater Modus */ } }

  /* ---------- Hilfen ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeUrl(u) { return /^https:\/\//.test(u || '') ? u : '#'; }
  function dayDiff(a, b) { return Math.round((Date.parse(a + 'T12:00:00Z') - Date.parse(b + 'T12:00:00Z')) / 86400000); }

  /* ---------- Zustand ---------- */
  var DATA = null, VENUES = {}, EVENTS = [];
  var state = {
    lang: lsGet('ns_lang') || ((navigator.language || 'de').toLowerCase().indexOf('de') === 0 ? 'de' : 'en'),
    city: 'graz', when: 'today', genre: 'all', tab: 'events',
    view: { type: 'list' }, just: null, scrollY: 0,
    gate: lsGet('ns_age16') === '1' ? 'ok' : 'ask',
    dialog: null, returnFocus: null,
    pass: 'week', student: false, confirmDelete: false, buyErr: false,
    ai: { consent: lsGet('ns_ai_consent') === '1', msgs: [], busy: false, left: null, draft: '' },
    loadError: false
  };

  function t() { return T[state.lang]; }
  function me() { return DATA && DATA.me; }
  function isPremium() { return !!(me() && me().premium); }
  function locale() { return state.lang === 'de' ? 'de-AT' : 'en-GB'; }
  function fmtDate(iso, opts) { return new Intl.DateTimeFormat(locale(), Object.assign({ timeZone: 'UTC' }, opts)).format(new Date(iso + 'T12:00:00Z')); }
  function fmtDay(iso) { return fmtDate(iso, { weekday: 'short', day: 'numeric', month: 'short' }); }
  function fmtStand() { return DATA ? fmtDate(DATA.updated, { day: 'numeric', month: 'numeric', year: 'numeric' }) : ''; }
  function fmtTs(ms) { return new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(ms)); }
  function euro(cents) { var s = (cents / 100).toFixed(2); return state.lang === 'de' ? s.replace('.', ',') + ' €' : '€' + s; }
  function venue(id) { return VENUES[id] || null; }
  function city(id) { for (var i = 0; i < DATA.cities.length; i++) { if (DATA.cities[i].id === id) return DATA.cities[i]; } return DATA.cities[0]; }
  function eventById(id) { for (var i = 0; i < EVENTS.length; i++) { if (EVENTS[i].id === id) return EVENTS[i]; } return null; }
  function addr(v) { return v.street + ', ' + v.zip + ' ' + city(v.city)[state.lang]; }
  function dayLabel(e) {
    var rel = e.off === 0 ? t().today : (e.off === 1 ? t().tomorrow : '');
    return { rel: rel, date: fmtDay(e.date) };
  }
  function whenText(e) { var d = dayLabel(e); return (d.rel ? d.rel + ', ' : '') + d.date + ', ' + (e.time ? t().fromTime(e.time) : t().timeOpen); }
  function isGoing(e) { return !!(me() && me().going.indexOf(e.id) !== -1); }
  function hasReminder(e) { return !!(me() && me().reminders.indexOf(e.id) !== -1); }
  function passById(id) { var P = t().passes; for (var i = 0; i < P.length; i++) { if (P[i].id === id) return P[i]; } return P[0]; }
  function passPrice(p) { var x = DATA.prices[p.id]; return euro(state.student ? x.student : x.cents); }
  function passDesc(p) { return state.student && p.ds ? p.ds : p.d; }

  function setData(d) {
    DATA = d;
    VENUES = {};
    d.venues.forEach(function (v) { VENUES[v.id] = v; });
    EVENTS = d.events.filter(function (e) { return VENUES[e.venue]; }).map(function (e) {
      var v = VENUES[e.venue];
      return Object.assign({}, e, { venue: v, city: v.city, off: Math.max(0, dayDiff(e.date, d.today)) });
    }).sort(function (a, b) { return a.off - b.off || ((a.time || '99') < (b.time || '99') ? -1 : 1); });
  }
  function setMe(m) { if (DATA) DATA.me = m; }

  function inWhen(off, when) {
    if (when === 'today') return off === 0;
    if (when === 'tomorrow') return off === 1;
    if (when === 'weekend') {
      var dow = new Date(DATA.today + 'T12:00:00Z').getUTCDay();
      if (dow === 0) return off === 0;
      return off >= Math.max(0, 5 - dow) && off <= 7 - dow;
    }
    return true;
  }
  function cityClubs(cityId) { return DATA.venues.filter(function (v) { return v.city === cityId; }); }
  function clubLocked(v) { return !isPremium() && cityClubs(v.city).slice(0, FREE_CLUBS).indexOf(v) === -1; }
  function filteredEvents() {
    return EVENTS.filter(function (e) {
      return e.city === state.city && inWhen(e.off, state.when) && (state.genre === 'all' || e.genre === state.genre);
    });
  }
  function filteredClubs() {
    return cityClubs(state.city).filter(function (v) { return state.genre === 'all' || v.genres.indexOf(state.genre) !== -1; });
  }
  function cityGenres() {
    var have = {};
    cityClubs(state.city).forEach(function (v) { v.genres.forEach(function (g) { have[g] = 1; }); });
    EVENTS.forEach(function (e) { if (e.city === state.city) have[e.genre] = 1; });
    return GENRE_ORDER.filter(function (g) { return have[g]; });
  }
  function pickDefaultWhen() {
    var has = function (w) { return EVENTS.some(function (e) { return e.city === state.city && inWhen(e.off, w); }); };
    state.when = has('today') ? 'today' : (has('weekend') ? 'weekend' : 'all');
  }

  /* ---------- Server ---------- */
  function api(path, body) {
    var opts = body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {};
    opts.credentials = 'same-origin';
    return fetch(path, opts).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(j.error || 'server_error'); e.code = j.error || 'server_error'; throw e; }
        return j;
      });
    }, function () { var e = new Error('offline'); e.code = 'offline'; throw e; });
  }
  function errText(err) { var L = t().err; return L[err && err.code] || L.server_error; }
  function fail(err) { toast(errText(err)); }
  function reload() { return api('/api/data').then(function (d) { setData(d); return d; }); }

  /* ---------- Bausteine ---------- */
  function link(page, text) { return '<button type="button" class="linkbtn" data-action="legal" data-page="' + page + '">' + esc(text) + '</button>'; }
  function legalName(page) { return window.NS_LEGAL.title(page, state.lang); }
  function stampBtn(e) {
    var on = isGoing(e);
    return '<button type="button" class="stampbtn' + (state.just === e.id && on ? ' just' : '') + '" id="go-' + esc(e.id) + '" data-action="go" data-id="' + esc(e.id) + '" aria-pressed="' + on + '">' +
      esc(on ? t().gone : t().go) + '</button>';
  }
  function genreChip(g) { return '<span class="chip" style="--g:var(--g-' + g + ')"><i></i>' + esc(t().genres[g] || g) + '</span>'; }
  function priceLabel(e) {
    var L = t();
    return e.price === 0 ? L.free : (e.price ? L.ticketsFrom(e.price) : L.infoTickets);
  }
  function ticketBit(e) {
    return '<a class="ticketbtn" href="' + esc(safeUrl(e.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(priceLabel(e)) + ICON.ext + '</a>';
  }
  function liveBit(e, prefix) {
    var L = t();
    if (!e.liveNight) return '';
    if (isPremium()) {
      if (!e.live || !e.live.level) return '<span class="live" style="--lv:var(--lv-quiet)">' + esc(L.liveNone) + '</span>';
      return '<span class="live" style="--lv:var(--lv-' + e.live.level + ')"><i></i>' + esc(L.lv[e.live.level]) + '</span>';
    }
    return '<button type="button" class="livelock" id="' + prefix + 'lv-' + esc(e.id) + '" data-action="upsell" data-feature="live">' + ICON.lock + esc(L.liveTeaser) + '</button>';
  }
  function eventRow(e, withDate, prefix) {
    var d = dayLabel(e);
    return '<article class="row" style="--g:var(--g-' + e.genre + ')">' +
      '<div class="time">' + esc(e.time || t().noTime) + '</div>' +
      '<div class="body">' +
        '<h3><button type="button" class="linkbtn" id="' + prefix + 'ev-' + esc(e.id) + '" data-action="event" data-id="' + esc(e.id) + '">' + esc(e.title) + '</button></h3>' +
        '<p class="where">' + esc(withDate ? (d.rel ? d.rel + ', ' : '') + d.date + ', ' + e.venue.name : e.venue.name) + '</p>' +
        '<p class="meta">' + genreChip(e.genre) + ticketBit(e) + liveBit(e, prefix) + '</p>' +
      '</div>' +
      '<div class="go">' + stampBtn(e) + '<span class="count">' + esc(t().going(e.going)) + '</span></div>' +
    '</article>';
  }
  function emptyBlock(text) {
    var L = t(), h = '<div class="empty"><p>' + esc(text) + '</p><div class="acts">';
    if (state.tab === 'events' && state.when !== 'all') h += '<button type="button" class="primary" id="e-all-dates" data-action="alldates">' + esc(L.showAllDates) + '</button>';
    if (state.genre !== 'all') h += '<button type="button" class="ghost" id="e-all" data-action="genre" data-genre="all">' + esc(L.showAll) + '</button>';
    return h + '</div></div>';
  }

  /* ---------- Ansichten ---------- */
  function viewList() {
    var L = t(), c = city(state.city), cityName = c[state.lang];
    var evs = filteredEvents(), clubs = filteredClubs();
    var h = '';

    h += '<h1 class="question"><span>' + esc(L.q1) + '</span> ' +
      '<span class="pickwrap"><select class="pick" id="when" aria-label="' + esc(L.whenLabel) + '">';
    ['today', 'tomorrow', 'weekend', 'all'].forEach(function (w) {
      h += '<option value="' + w + '"' + (state.when === w ? ' selected' : '') + '>' + esc(L.when[w]) + '</option>';
    });
    h += '</select></span> <span>' + esc(L.q2) + '</span> ' +
      '<span class="pickwrap"><select class="pick" id="city" aria-label="' + esc(L.cityLabel) + '">';
    DATA.cities.forEach(function (x) {
      h += '<option value="' + x.id + '"' + (state.city === x.id ? ' selected' : '') + '>' + esc(x[state.lang]) + '</option>';
    });
    h += '</select></span><span>' + esc(L.q3) + '</span><span class="measure" aria-hidden="true"></span></h1>';
    h += '<p class="hint">' + esc(L.hint) + '</p>';

    h += '<div class="genres" role="group" aria-label="' + esc(L.genreLabel) + '">';
    h += '<button type="button" class="gchip" id="g-all" data-action="genre" data-genre="all" aria-pressed="' + (state.genre === 'all') + '">' + esc(L.all) + '</button>';
    cityGenres().forEach(function (g) {
      h += '<button type="button" class="gchip" id="g-' + g + '" style="--g:var(--g-' + g + ')" data-action="genre" data-genre="' + g + '" aria-pressed="' + (state.genre === g) + '"><i></i>' + esc(L.genres[g]) + '</button>';
    });
    h += '</div>';

    h += '<div class="tabs">' +
      '<button type="button" class="tab" id="tab-events" data-action="tab" data-tab="events" aria-pressed="' + (state.tab === 'events') + '">' + esc(L.events) + '<span class="n">' + evs.length + '</span></button>' +
      '<button type="button" class="tab" id="tab-clubs" data-action="tab" data-tab="clubs" aria-pressed="' + (state.tab === 'clubs') + '">' + esc(L.clubs) + '<span class="n">' + clubs.length + '</span></button>' +
    '</div>';

    if (state.tab === 'events') {
      if (!evs.length) {
        h += emptyBlock(L.emptyEvents(cityName));
      } else {
        var last = -1;
        evs.forEach(function (e) {
          if (e.off !== last) {
            var d = dayLabel(e);
            h += '<h2 class="day">' + (d.rel ? '<b>' + esc(d.rel) + '</b>' : '') + esc(d.date) + '</h2>';
            last = e.off;
          }
          h += eventRow(e, false, 'l');
        });
      }
    } else if (!clubs.length) {
      h += emptyBlock(L.emptyClubs(cityName));
    } else {
      var open = clubs.filter(function (v) { return !clubLocked(v); });
      var shut = clubs.filter(clubLocked);
      open.forEach(function (v) {
        var n = EVENTS.filter(function (e) { return e.venue.id === v.id; }).length;
        h += '<article class="club">' +
          '<h3><button type="button" class="linkbtn" id="cl-' + v.id + '" data-action="club" data-id="' + v.id + '">' + esc(v.name) + '</button></h3>' +
          '<p class="where">' + esc(addr(v)) + '</p>' +
          '<p class="meta">' + v.genres.map(genreChip).join('') + (n ? '<span class="count">' + n + ' ' + esc(L.events) + '</span>' : '') + '</p>' +
        '</article>';
      });
      if (shut.length) {
        var gs = [];
        shut.forEach(function (v) { v.genres.forEach(function (g) { if (gs.indexOf(g) === -1) gs.push(g); }); });
        h += '<div class="locked">' + ICON.lock + '<div><p><b>' + esc(L.moreClubs(shut.length, cityName)) + '</b></p>' +
          '<p class="meta">' + gs.map(genreChip).join('') + '</p>' +
          '<p class="fine">' + esc(L.moreClubsText) + '</p>' +
          '<button type="button" class="primary hot" id="clubs-premium" data-action="premium">' + ICON.star + esc(L.allClubsBtn) + '</button></div></div>';
      }
    }
    return h;
  }

  function liveBox(e) {
    var L = t(), h = '<section class="livebox"><h2>' + esc(L.liveTitle) + '</h2>';
    if (!e.liveNight) return h + '<p class="fine">' + esc(L.liveLater) + '</p></section>';
    var mine = me() && me().reports[e.id];
    if (isPremium()) {
      if (e.live && e.live.level) {
        h += '<p class="livebig" style="--lv:var(--lv-' + e.live.level + ')"><i></i>' + esc(L.lv[e.live.level]) + '</p>';
        h += '<p class="fine">' + esc(L.liveMeta(e.live.mins, e.live.n)) + '</p>';
      } else {
        h += '<p class="livebig" style="--lv:var(--lv-quiet)">' + esc(L.liveNone) + '</p><p class="fine">' + esc(L.liveNoneText) + '</p>';
      }
    } else {
      h += '<p style="margin:.4rem 0 .7rem">' + esc(L.liveLocked) + '</p>';
      h += '<button type="button" class="primary hot" id="live-premium" data-action="premium">' + ICON.star + esc(L.seePremium) + '</button>';
    }
    if (isGoing(e)) {
      h += '<p class="lvask">' + esc(L.liveAsk) + '</p><div class="lvrow" role="group" aria-label="' + esc(L.liveTitle) + '">';
      LEVELS.forEach(function (k) {
        h += '<button type="button" class="lvbtn" id="rep-' + k + '" style="--lv:var(--lv-' + k + ')" data-action="report" data-id="' + esc(e.id) + '" data-level="' + k + '" aria-pressed="' + (mine === k) + '"><i></i>' + esc(L.lv[k]) + '</button>';
      });
      h += '</div>';
    } else {
      h += '<p class="fine" style="margin-top:.8rem">' + esc(L.liveWho) + '</p>';
    }
    return h + '</section>';
  }

  function viewEvent(e) {
    var L = t(), on = isPremium() && hasReminder(e);
    var h = '<button type="button" class="back" id="back" data-action="back">' + esc(L.back) + '</button>';
    h += '<article style="--g:var(--g-' + e.genre + ')">';
    h += '<h1 class="title" id="view-title" tabindex="-1">' + esc(e.title) + '</h1>';
    h += '<p class="lede">' + esc(whenText(e) + ', ' + e.venue.name) + '</p>';

    h += '<div class="buy"><div class="buytop"><div>' +
      '<span class="bigprice">' + esc(e.price === 0 ? L.free : (e.price ? L.from(e.price) : L.priceUnknown)) + '</span>' +
      '<span class="fine">' + esc(L.buyNote) + '</span></div>' +
      '<a class="primary hot" id="tk-main" href="' + esc(safeUrl(e.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(L.infoTickets) + ICON.ext + '</a></div>' +
      '<div class="acts"><button type="button" class="ghost" id="reminder" data-action="reminder" data-id="' + esc(e.id) + '" aria-pressed="' + on + '">' + ICON.bell + esc(on ? L.remOn : L.remOff) + (isPremium() ? '' : ICON.lock) + '</button></div>' +
      '</div>';

    h += '<div class="gobox">' + stampBtn(e) + '<span class="count">' + esc(L.going(e.going)) + '</span><p class="fine">' + esc(L.voteRule) + '</p></div>';
    h += liveBox(e);
    h += '<dl class="facts top-rule">' +
      '<div><dt>' + esc(L.fWhen) + '</dt><dd>' + esc(whenText(e)) + '</dd></div>' +
      '<div><dt>' + esc(L.fWhere) + '</dt><dd>' +
        '<button type="button" class="linkbtn" id="to-club" data-action="club" data-id="' + e.venue.id + '">' + esc(e.venue.name) + '</button>' +
        '<span class="fine">' + esc(addr(e.venue)) + '</span></dd></div>' +
      '<div><dt>' + esc(L.fMusic) + '</dt><dd>' + genreChip(e.genre) + '</dd></div>' +
      '<div><dt>' + esc(L.fEntry) + '</dt><dd>' + esc(L.age(e.age)) + '</dd></div>' +
      '<div><dt>' + esc(L.fSource) + '</dt><dd>' + esc(e.source) + '<span class="fine">' + esc(L.sourceLine(e.source, fmtStand()).split(' · ')[1]) + '</span></dd></div>' +
    '</dl>';
    h += '<div class="acts"><button type="button" class="ghost" id="copy" data-action="copy" data-id="' + esc(e.id) + '">' + esc(L.copy) + '</button>' +
      (DATA.features.ai ? '<button type="button" class="ghost" id="ask-ai" data-action="ask-ai" data-id="' + esc(e.id) + '">' + ICON.spark + esc(L.askAi) + '</button>' : '') + '</div>';
    h += '</article>';
    return h;
  }

  function viewClub(v) {
    var L = t(), locked = clubLocked(v);
    var next = EVENTS.filter(function (e) { return e.venue.id === v.id; }).slice(0, 8);
    var h = '<button type="button" class="back" id="back" data-action="back">' + esc(L.back) + '</button>';
    h += '<h1 class="title" id="view-title" tabindex="-1">' + esc(v.name) + '</h1>';
    h += '<dl class="facts top-rule">' +
      '<div><dt>' + esc(L.fAddress) + '</dt><dd>' + esc(addr(v)) + '</dd></div>' +
      '<div><dt>' + esc(L.fMusic) + '</dt><dd class="meta" style="margin:0">' + v.genres.map(genreChip).join('') + '</dd></div>';
    if (!locked) {
      h += '<div><dt>' + esc(L.fWeb) + '</dt><dd><a class="ticketbtn" id="site-' + v.id + '" href="' + esc(safeUrl(v.url)) + '" target="_blank" rel="noopener noreferrer">' + esc(L.site(v.name)) + ICON.ext + '</a></dd></div>';
    }
    h += '</dl>';
    if (locked) {
      h += '<div class="locked">' + ICON.lock + '<div><p>' + esc(L.clubLocked) + '</p>' +
        '<button type="button" class="primary hot" id="club-premium" data-action="premium">' + ICON.star + esc(L.seePremium) + '</button></div></div>';
      return h;
    }
    h += '<h2 class="sub">' + esc(L.next) + '</h2>';
    if (!next.length) h += '<p class="fine">' + esc(L.noNext) + '</p>';
    else h += '<div style="margin-top:.6rem">' + next.map(function (e) { return eventRow(e, true, 'c'); }).join('') + '</div>';
    return h;
  }

  function viewPremium() {
    var L = t(), sel = passById(state.pass), m = me();
    var h = '<h1 class="title" id="view-title" tabindex="-1">' + esc(L.premium) + '</h1><p class="lede">' + esc(L.premiumLead) + '</p>';
    h += '<ul class="reasons">' + L.reasons.map(function (r) {
      return '<li>' + ICON.check + '<b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></li>';
    }).join('') + '</ul>';

    if (isPremium()) {
      h += '<div class="panel"><h2>' + esc(L.premActive) + '</h2><p>' + esc(L.planUntil(L.planNames[m.premium.plan] || m.premium.plan, fmtTs(m.premium.until), m.premium.renews)) + '</p>' +
        (m.billing ? '<button type="button" class="ghost" id="manage" data-action="billing">' + esc(L.manage) + ICON.ext + '</button>' : '') + '</div>';
    }
    if (!isPremium() || !m.premium.renews) {
      h += '<div class="seg full" role="group" aria-label="' + esc(L.priceLabel) + '">' +
        '<button type="button" id="price-normal" data-action="pricing" data-student="0" aria-pressed="' + !state.student + '">' + esc(L.normal) + '</button>' +
        '<button type="button" id="price-student" data-action="pricing" data-student="1" aria-pressed="' + state.student + '">' + esc(L.studentL) + '</button></div>';
      if (state.student) h += '<p class="fine" style="margin:.5rem 0 0">' + esc(m && m.studentEligible ? L.studentOk : L.studentNote) + '</p>';
      h += '<fieldset class="passes"><legend class="sub" style="margin-top:1rem">' + esc(L.choose) + '</legend>';
      L.passes.forEach(function (p) {
        h += '<label class="passopt" for="pass-' + p.id + '">' +
          '<input type="radio" name="pass" id="pass-' + p.id + '" value="' + p.id + '"' + (state.pass === p.id ? ' checked' : '') + '>' +
          '<span class="pn">' + esc(p.n) + '</span><span class="pp">' + esc(passPrice(p)) + '</span>' +
          '<span class="pd">' + esc(passDesc(p)) + '</span><span class="pu">' + esc(p.u) + '</span></label>';
      });
      h += '</fieldset>';
      if (!DATA.features.pay) {
        h += '<p class="note">' + esc(L.payOff) + '</p>';
      } else {
        h += '<div class="check"><input id="buy-terms" type="checkbox"><label for="buy-terms">' + esc(L.termsLabel1) + link('terms', legalName('terms')) + esc(L.termsLabel2) + link('privacy', legalName('privacy')) + esc(L.termsLabel3) + '</label></div>';
        h += '<div class="check"><input id="buy-withdraw" type="checkbox"><label for="buy-withdraw">' + esc(L.withdrawLabel) + '</label></div>';
        h += '<p class="err" id="buy-err" role="alert">' + (state.buyErr ? esc(L.errTerms) : '') + '</p>';
        h += '<button type="button" class="primary hot wide" id="buy" data-action="buy">' + esc(L.buyPass(sel.n, passPrice(sel))) + '</button>';
        h += '<p class="fine" style="margin:.6rem 0 0">' + esc(L.payMethods) + '</p>';
      }
      h += '<p class="fine" style="margin:.6rem 0 0">' + esc(L.buyFine) + '</p>';
    }

    h += '<h2 class="sub">' + esc(L.includes) + '</h2>';
    h += '<table class="cmp"><thead><tr><th scope="col"><span class="sr">' + esc(L.colFeature) + '</span></th><th scope="col">' + esc(L.colFree) + '</th><th scope="col">' + esc(L.colPrem) + '</th></tr></thead><tbody>';
    L.cmp(DATA.features).forEach(function (r) {
      h += '<tr><th scope="row" style="font-weight:500">' + esc(r[0]) + '</th>' + cmpCell(r[1]) + cmpCell(r[2]) + '</tr>';
    });
    h += '</tbody></table>';
    return h;
  }
  function cmpCell(v) {
    var L = t();
    if (v === 1) return '<td>' + ICON.check + '<span class="sr">' + esc(L.yes) + '</span></td>';
    if (v === 0) return '<td class="no"><span aria-hidden="true">–</span><span class="sr">' + esc(L.no) + '</span></td>';
    return '<td class="txt">' + esc(v) + '</td>';
  }

  function viewAccount() {
    var L = t(), m = me();
    var mine = EVENTS.filter(isGoing);
    var rems = EVENTS.filter(hasReminder);
    var h = '<h1 class="title" id="view-title" tabindex="-1">' + esc(L.accTitle) + '</h1>';
    h += '<p class="lede">' + esc(L.accConfirmed(m.email)) + '</p>';
    h += '<h2 class="sub">' + esc(L.plan) + '</h2>';
    if (isPremium()) h += '<p>' + esc(L.planUntil(L.planNames[m.premium.plan] || m.premium.plan, fmtTs(m.premium.until), m.premium.renews)) + '</p>';
    else h += '<p>' + esc(L.planFree) + '</p>';
    h += '<div class="acts">';
    if (!isPremium()) h += '<button type="button" class="primary hot" id="acc-premium" data-action="premium">' + ICON.star + esc(L.seePremium) + '</button>';
    if (m.billing) h += '<button type="button" class="ghost" id="manage" data-action="billing">' + esc(L.manage) + ICON.ext + '</button>';
    h += '</div>';
    h += '<h2 class="sub">' + esc(L.myGoing) + '</h2>';
    if (!mine.length) h += '<p class="fine">' + esc(L.myNone) + '</p>';
    else h += '<div style="margin-top:.6rem">' + mine.map(function (e) { return eventRow(e, true, 'a'); }).join('') + '</div>';
    if (rems.length) {
      h += '<h2 class="sub">' + esc(L.myReminders) + '</h2><div style="margin-top:.6rem">' + rems.map(function (e) { return eventRow(e, true, 'm'); }).join('') + '</div>';
    }
    h += '<h2 class="sub">' + esc(L.myData) + '</h2><p class="fine">' + esc(L.myDataText) + '</p>';
    if (state.confirmDelete) {
      h += '<div class="panel"><p>' + esc(L.delAsk) + '</p><div class="acts">' +
        '<button type="button" class="primary hot" id="del-yes" data-action="delete-yes">' + esc(L.delConfirm) + '</button>' +
        '<button type="button" class="ghost" id="del-no" data-action="delete-no">' + esc(L.cancel) + '</button></div></div>';
    } else {
      h += '<div class="acts"><a class="ghost" id="export" href="/api/me/export" download>' + esc(L.exportBtn) + '</a>' +
        '<button type="button" class="ghost" id="logout" data-action="logout">' + esc(L.logout) + '</button>' +
        '<button type="button" class="ghost danger" id="del" data-action="delete">' + esc(L.del) + '</button></div>';
    }
    return h;
  }

  function viewLegal(page) {
    var L = t();
    var h = '<button type="button" class="back" id="back" data-action="back">' + esc(L.back) + '</button>';
    h += '<article class="legal"><h1 class="title" id="view-title" tabindex="-1">' + esc(legalName(page)) + '</h1>';
    if (L.legalLang) h += '<p class="fine">' + esc(L.legalLang) + '</p>';
    h += window.NS_LEGAL.html(page, { operator: DATA.operator, prices: DATA.prices, updated: fmtStand() });
    return h + '</article>';
  }

  /* ---------- Dialoge ---------- */
  function authDialog(d) {
    var L = t(), h = '';
    h += '<h2 id="dlg-title">' + esc(L.authTitle[d.reason]) + '</h2><p>' + esc(L.authText[d.reason]) + '</p>';
    h += '<form id="authForm" novalidate>' +
      '<div class="field"><label for="auth-email">' + esc(L.emailLabel) + '</label>' +
      '<input class="input" id="auth-email" name="email" type="email" autocomplete="email" inputmode="email" value="' + esc(d.email || '') + '" aria-describedby="auth-email-err"' + (d.errEmail ? ' aria-invalid="true"' : '') + '>' +
      '<p class="err" id="auth-email-err">' + (d.errEmail ? esc(L.errEmail) : '') + '</p></div>' +
      '<div class="field"><label for="auth-birth">' + esc(L.birthLabel) + '</label>' +
      '<input class="input" id="auth-birth" name="birthdate" type="date" autocomplete="bday" min="1900-01-01" max="' + esc(DATA.today) + '" value="' + esc(d.birth || '') + '" aria-describedby="auth-birth-help auth-birth-err"' + (d.errBirth ? ' aria-invalid="true"' : '') + '>' +
      '<p class="fine" id="auth-birth-help" style="margin:0">' + esc(L.birthHelp) + '</p>' +
      '<p class="err" id="auth-birth-err">' + (d.errBirth ? esc(d.errBirth === true ? L.errBirth : d.errBirth) : '') + '</p></div>' +
      '<div class="check"><input id="auth-privacy" name="privacy" type="checkbox"' + (d.privacy ? ' checked' : '') + ' aria-describedby="auth-privacy-err"' + (d.errPrivacy ? ' aria-invalid="true"' : '') + '>' +
      '<label for="auth-privacy">' + esc(L.privacyLabel1) + link('privacy', legalName('privacy')) + esc(L.privacyLabel2) + '</label></div>' +
      '<p class="err" id="auth-privacy-err">' + (d.errPrivacy ? esc(L.errPrivacy) : '') + '</p>' +
      '<p class="err" id="auth-err" role="alert">' + (d.error ? esc(d.error) : '') + '</p>' +
      '<button type="submit" class="primary hot wide" id="auth-submit"' + (d.busy ? ' disabled' : '') + '>' + esc(L.authSubmit) + '</button>' +
    '</form>';
    h += '<p class="fine" style="margin-top:1rem">' + esc(L.authFine) + '</p>';
    h += '<button type="button" class="ghost" id="dlg-close" data-action="close">' + esc(L.cancel) + '</button>';
    return h;
  }
  function chatDialog() {
    var L = t(), a = state.ai, h = '';
    h += '<div class="chathead"><div><h2 id="dlg-title">' + esc(L.aiTitle) + '</h2><span class="aitag">' + esc(L.aiTag) + '</span></div>' +
      '<button type="button" class="xbtn" id="dlg-close" data-action="close" aria-label="' + esc(L.close) + '">×</button></div>';
    if (!DATA.features.ai) return h + '<p class="note">' + esc(L.aiOff) + '</p>';
    if (!a.consent) {
      h += '<h3 class="sub" style="margin:.4rem 0 .6rem">' + esc(L.aiConsentTitle) + '</h3>';
      L.aiConsentText.forEach(function (p) { h += '<p>' + esc(p) + '</p>'; });
      h += '<p class="fine">' + esc(L.aiConsentMore1) + link('privacy', legalName('privacy')) + esc(L.aiConsentMore2) + '</p>';
      h += '<div class="acts"><button type="button" class="primary hot" id="dlg-go" data-action="ai-consent">' + esc(L.aiConsentBtn) + '</button>' +
        '<button type="button" class="ghost" data-action="close">' + esc(L.cancel) + '</button></div>';
      return h;
    }
    h += '<div class="msgs" id="msgs" role="log" aria-live="polite">';
    h += '<div class="msg assistant">' + esc(L.aiHello) + '</div>';
    a.msgs.forEach(function (m, i) {
      var wait = a.busy && i === a.msgs.length - 1 && m.role === 'assistant' && !m.content;
      h += '<div class="msg ' + m.role + (m.err ? ' err' : '') + (wait ? ' wait' : '') + '">' + esc(m.content) + '</div>';
    });
    h += '</div>';
    if (!a.msgs.length) {
      h += '<div class="sugg">' + L.aiSugg(city(state.city)[state.lang]).map(function (s) {
        return '<button type="button" data-action="ai-sugg" data-text="' + esc(s) + '">' + esc(s) + '</button>';
      }).join('') + '</div>';
    }
    h += '<form class="chatform" id="chatForm"><label class="sr" for="chat-input">' + esc(L.aiPlaceholder) + '</label>' +
      '<input class="input" id="chat-input" maxlength="1000" autocomplete="off" placeholder="' + esc(L.aiPlaceholder) + '" value="' + esc(a.draft) + '">' +
      '<button type="submit" class="primary hot" id="chat-send"' + (a.busy ? ' disabled' : '') + '>' + esc(L.aiSend) + '</button></form>';
    h += '<p class="fine" style="margin:.5rem 0 0">' + esc(L.aiFine) + (a.left !== null ? ' ' + esc(L.aiLeft(a.left)) + '.' : '') + '</p>';
    h += '<div class="chatfine"><button type="button" class="linkbtn" data-action="ai-clear">' + esc(L.aiClear) + '</button>' +
      '<button type="button" class="linkbtn" data-action="ai-revoke">' + esc(L.aiRevoke) + '</button></div>';
    return h;
  }
  function dialogHtml(d) {
    var L = t(), h = '';
    if (d.type === 'auth') h = authDialog(d);
    else if (d.type === 'chat') h = chatDialog();
    else if (d.type === 'sent') {
      h += '<h2 id="dlg-title">' + esc(L.sentTitle) + '</h2><p>' + esc(L.sentText(d.email)) + '</p>';
      if (d.devLink) h += '<p class="note">' + esc(L.sentDev) + '</p><div class="acts"><a class="primary hot" id="dlg-go" href="' + esc(d.devLink) + '">' + esc(L.sentDevBtn) + '</a></div>';
      h += '<div class="acts"><button type="button" class="ghost" id="dlg-close" data-action="close">' + esc(L.close) + '</button></div>';
    } else if (d.type === 'upsell') {
      var u = L.up[d.feature];
      h += '<h2 id="dlg-title">' + esc(u[0]) + '</h2><p>' + esc(u[1]) + '</p><p class="fine">' + esc(L.upPrice) + '</p>';
      h += '<div class="acts"><button type="button" class="primary hot" id="dlg-go" data-action="to-premium">' + ICON.star + esc(L.seePremium) + '</button>' +
        '<button type="button" class="ghost" id="dlg-close" data-action="close">' + esc(L.close) + '</button></div>';
    }
    return '<div class="scrim" data-action="close"></div><div class="dialog' + (d.type === 'chat' ? ' chat' : '') + '" role="dialog" aria-modal="true" aria-labelledby="dlg-title">' + h + '</div>';
  }
  function gateHtml() {
    var L = t(), h = '<div class="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title"><div class="gatein">' +
      '<div class="brand" style="font-size:1.45rem">Nightstamp</div>';
    if (state.gate === 'denied') {
      h += '<h2 id="gate-title">' + esc(L.gateDenied) + '</h2><p>' + esc(L.gateDeniedText) + '</p>' +
        '<div class="acts"><button type="button" class="ghost" id="gate-retry" data-action="gate-retry">' + esc(L.gateRetry) + '</button></div>';
    } else {
      h += '<h2 id="gate-title">' + esc(L.gateTitle) + '</h2><p>' + esc(L.gateText) + '</p><p class="fine">' + esc(L.gateFine) + '</p>' +
        '<div class="acts"><button type="button" class="primary hot" id="gate-yes" data-action="gate-yes">' + esc(L.gateYes) + '</button>' +
        '<button type="button" class="ghost" id="gate-no" data-action="gate-no">' + esc(L.gateNo) + '</button></div>';
    }
    h += '<ul class="footlinks" style="margin-top:2rem">' + window.NS_LEGAL.pages.map(function (p) { return '<li>' + link(p, legalName(p)) + '</li>'; }).join('') + '</ul>';
    return h + '</div></div>';
  }

  var layer = document.getElementById('layer');
  var page = document.getElementById('page');
  var bar = document.getElementById('bar');
  var fab = document.getElementById('aifab');
  var app = document.getElementById('app');

  function gateShown() { return state.gate !== 'ok' && state.view.type !== 'legal'; }
  function setInert(on) {
    [page, bar, fab].forEach(function (el) {
      if (on) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });
    document.body.style.overflow = on ? 'hidden' : '';
  }
  function renderLayer() {
    if (gateShown()) { layer.innerHTML = gateHtml(); setInert(true); return; }
    if (!state.dialog) { layer.innerHTML = ''; setInert(false); return; }
    layer.innerHTML = dialogHtml(state.dialog);
    setInert(true);
    var box = document.getElementById('msgs');
    if (box) box.scrollTop = box.scrollHeight;
  }
  function focusId(id) {
    var el = id && document.getElementById(id);
    if (el && el.focus) { try { el.focus({ preventScroll: true }); } catch (err) { el.focus(); } return true; }
    return false;
  }
  function openDialog(d) {
    var a = document.activeElement;
    if (!state.dialog) state.returnFocus = a && a.id ? a.id : null;
    state.dialog = d;
    renderLayer();
    focusId(d.type === 'auth' ? 'auth-email' : (d.type === 'chat' && state.ai.consent ? 'chat-input' : 'dlg-go')) || focusId('dlg-close');
  }
  function closeDialog(keepFocus) {
    state.dialog = null;
    renderLayer();
    if (!keepFocus) focusId(state.returnFocus);
  }

  /* ---------- Zeichnen ---------- */
  function fitPicks() {
    var m = app.querySelector('.measure');
    if (!m) return;
    var picks = app.querySelectorAll('select.pick');
    for (var i = 0; i < picks.length; i++) {
      var s = picks[i];
      m.textContent = s.options[s.selectedIndex].text;
      var em = parseFloat(window.getComputedStyle(s).fontSize) || 32;
      s.style.width = Math.ceil(m.getBoundingClientRect().width + em * 0.75) + 'px';
    }
    m.textContent = '';
  }
  function renderChrome() {
    var L = t(), vt = state.view.type;
    document.documentElement.lang = state.lang;
    document.getElementById('demoNote').textContent = DATA ? L.note(fmtStand()) : '';
    document.getElementById('foot').innerHTML = DATA
      ? '<ul class="footlinks">' + window.NS_LEGAL.pages.map(function (p) { return '<li>' + link(p, legalName(p)) + '</li>'; }).join('') + '</ul><p style="margin:0">' + esc(L.footNote(fmtStand())) + '</p>'
      : '';
    document.getElementById('langGroup').setAttribute('aria-label', L.langLabel);
    document.getElementById('langDe').setAttribute('aria-pressed', String(state.lang === 'de'));
    document.getElementById('langEn').setAttribute('aria-pressed', String(state.lang === 'en'));
    bar.setAttribute('aria-label', L.nav);
    var nd = document.getElementById('nav-discover'), np = document.getElementById('nav-premium'), na = document.getElementById('nav-account');
    nd.innerHTML = ICON.search + '<span>' + esc(L.discover) + '</span>';
    np.innerHTML = ICON.star + '<span>' + esc(L.premium) + '</span>';
    na.innerHTML = ICON.person + '<span>' + esc(me() ? L.account : L.signin) + '</span>';
    [[nd, vt === 'list' || vt === 'event' || vt === 'club'], [np, vt === 'premium'], [na, vt === 'account']].forEach(function (p) {
      if (p[1]) p[0].setAttribute('aria-current', 'page'); else p[0].removeAttribute('aria-current');
    });
    fab.innerHTML = ICON.spark + '<span>' + esc(L.aiBtn) + '</span>';
    fab.hidden = !DATA;
  }
  function render() {
    var v = state.view, keep = document.activeElement && document.activeElement.id;
    renderChrome();
    if (!DATA) {
      app.innerHTML = state.loadError
        ? '<div class="empty" style="margin-top:2rem"><p>' + esc(t().loadFail) + '</p><button type="button" class="primary" data-action="retry">' + esc(t().retry) + '</button></div>'
        : '';
      return;
    }
    if (v.type === 'account' && !me()) { state.view = v = { type: 'list' }; }
    var ev = v.type === 'event' ? eventById(v.id) : null;
    var cl = v.type === 'club' ? venue(v.id) : null;
    if (ev) app.innerHTML = viewEvent(ev);
    else if (cl) app.innerHTML = viewClub(cl);
    else if (v.type === 'premium') app.innerHTML = viewPremium();
    else if (v.type === 'account') app.innerHTML = viewAccount();
    else if (v.type === 'legal') app.innerHTML = viewLegal(v.page);
    else { state.view = { type: 'list' }; app.innerHTML = viewList(); fitPicks(); }
    state.just = null;
    renderLayer();
    if (keep && !state.dialog && !gateShown()) focusId(keep);
  }

  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3600);
  }

  function open(view) {
    if (state.view.type === 'list') state.scrollY = window.scrollY || 0;
    state.view = view;
    state.confirmDelete = false;
    state.buyErr = false;
    render();
    window.scrollTo(0, 0);
    focusId('view-title');
  }
  function goList(restore) {
    state.view = { type: 'list' };
    render();
    window.scrollTo(0, restore ? state.scrollY : 0);
  }

  /* ---------- Aktionen mit Server ---------- */
  function needLogin(reason, pending) {
    if (me()) return false;
    ssSet('ns_pending', pending ? JSON.stringify(pending) : null);
    openDialog({ type: 'auth', reason: reason });
    return true;
  }
  function toggleGoing(id, forceOn) {
    var e = eventById(id);
    if (!e) return Promise.resolve();
    var on = forceOn || !isGoing(e);
    return api('/api/going', { eventId: id, on: on }).then(function (r) {
      e.going = r.going;
      setMe(r.me);
      if (on) state.just = id;
      render();
    }, fail);
  }
  function sendReport(id, level) {
    api('/api/report', { eventId: id, level: level }).then(function (r) {
      var e = eventById(id);
      if (e && r.live) e.live = r.live;
      setMe(r.me);
      render();
      toast(t().liveThanks);
    }, fail);
  }
  function toggleReminder(id) {
    var e = eventById(id), on = !hasReminder(e);
    api('/api/reminder', { eventId: id, on: on }).then(function (r) {
      setMe(r.me);
      render();
      toast(on ? t().remSet : t().remUnset);
    }, fail);
  }
  function buy() {
    var L = t();
    if (needLogin('buy')) return;
    if (!me().adult) { toast(L.err.adults_only); return; }
    var a = document.getElementById('buy-terms'), b = document.getElementById('buy-withdraw');
    if (!a || !b || !a.checked || !b.checked) {
      state.buyErr = true;
      document.getElementById('buy-err').textContent = L.errTerms;
      focusId(a && !a.checked ? 'buy-terms' : 'buy-withdraw');
      return;
    }
    var btn = document.getElementById('buy');
    btn.disabled = true;
    api('/api/checkout', { plan: state.pass, student: state.student, terms: true, withdrawal: true, lang: state.lang }).then(function (r) {
      window.location.href = r.url;
    }, function (err) { btn.disabled = false; fail(err); });
  }
  function billing() {
    api('/api/billing', { lang: state.lang }).then(function (r) { window.location.href = r.url; }, fail);
  }
  function waitForPremium(tries) {
    reload().then(function () {
      if (isPremium()) { render(); toast(t().paidOk); }
      else if (tries > 0) setTimeout(function () { waitForPremium(tries - 1); }, 2000);
      else { render(); toast(t().paidSlow); }
    }, function () { toast(t().paidSlow); });
  }

  /* ---------- KI-Chat ---------- */
  function askAi(text) {
    var a = state.ai, L = t();
    text = String(text || '').trim();
    if (!text || a.busy) return;
    a.msgs = a.msgs.filter(function (m) { return !m.err; });
    a.msgs.push({ role: 'user', content: text });
    var reply = { role: 'assistant', content: '' };
    // Der Server erwartet abwechselnd Frage und Antwort. Fragen ohne Antwort (nach einem Fehler) fallen weg.
    var history = [];
    a.msgs.forEach(function (m) {
      if (!m.content) return;
      if (history.length && history[history.length - 1].role === m.role) history.pop();
      history.push(m);
    });
    history = history.slice(-23);
    while (history.length && history[0].role !== 'user') history.shift();
    a.msgs.push(reply);
    a.busy = true;
    a.draft = '';
    renderLayer();
    focusId('chat-input');

    function bubble() { var box = document.getElementById('msgs'); return box ? box.lastElementChild : null; }
    function paint() {
      var el = bubble();
      if (el) { el.textContent = reply.content; el.classList.toggle('wait', !reply.content); el.parentNode.scrollTop = el.parentNode.scrollHeight; }
    }
    function finish(code) {
      a.busy = false;
      if (code) {
        if (reply.content) a.msgs.push({ role: 'assistant', content: L.err[code] || L.err.ai_error, err: true });
        else { reply.content = L.err[code] || L.err.ai_error; reply.err = true; }
      }
      if (state.dialog && state.dialog.type === 'chat') { var hadFocus = document.activeElement && document.activeElement.id === 'chat-input'; renderLayer(); if (hadFocus) focusId('chat-input'); }
    }

    fetch('/api/chat', {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent: true, lang: state.lang, messages: history.map(function (m) { return { role: m.role, content: m.content }; }) })
    }).then(function (r) {
      if (!r.ok || !r.body) return r.json().catch(function () { return {}; }).then(function (j) { finish(j.error || 'ai_error'); });
      var reader = r.body.getReader(), dec = new TextDecoder(), buf = '', errCode = null;
      function pump() {
        return reader.read().then(function (x) {
          if (x.done) { finish(errCode || (reply.content ? null : 'ai_error')); return; }
          buf += dec.decode(x.value, { stream: true });
          var parts = buf.split('\n\n');
          buf = parts.pop();
          parts.forEach(function (p) {
            if (p.indexOf('data: ') !== 0) return;
            var msg;
            try { msg = JSON.parse(p.slice(6)); } catch (err) { return; }
            if (msg.t) { reply.content += msg.t; paint(); }
            if (msg.error) errCode = msg.error;
            if (msg.done && typeof msg.left === 'number') a.left = msg.left;
          });
          return pump();
        });
      }
      return pump();
    }).catch(function () { finish('offline'); });
  }
  function openChat(draft) {
    if (draft) state.ai.draft = draft;
    openDialog({ type: 'chat' });
  }

  /* ---------- Ereignisse ---------- */
  document.addEventListener('click', function (evt) {
    var el = evt.target.closest ? evt.target.closest('[data-action]') : null;
    if (!el) return;
    var a = el.getAttribute('data-action'), id = el.getAttribute('data-id'), L = t();
    if (a === 'lang') { state.lang = el.getAttribute('data-lang'); lsSet('ns_lang', state.lang); render(); }
    else if (a === 'retry') { boot(); }
    else if (a === 'gate-yes') { state.gate = 'ok'; lsSet('ns_age16', '1'); render(); }
    else if (a === 'gate-no') { state.gate = 'denied'; renderLayer(); focusId('gate-retry'); }
    else if (a === 'gate-retry') { state.gate = 'ask'; renderLayer(); focusId('gate-yes'); }
    else if (a === 'legal') { state.dialog = null; open({ type: 'legal', page: el.getAttribute('data-page') }); }
    else if (!DATA) { return; }
    else if (a === 'genre') { state.genre = el.getAttribute('data-genre'); render(); }
    else if (a === 'tab') { state.tab = el.getAttribute('data-tab'); render(); }
    else if (a === 'alldates') { state.when = 'all'; render(); }
    else if (a === 'go') { if (!needLogin('vote', { type: 'go', id: id })) toggleGoing(id); }
    else if (a === 'report') { sendReport(id, el.getAttribute('data-level')); }
    else if (a === 'reminder') {
      if (needLogin('reminder')) return;
      if (!isPremium()) { openDialog({ type: 'upsell', feature: 'reminder' }); return; }
      toggleReminder(id);
    }
    else if (a === 'upsell') { openDialog({ type: 'upsell', feature: el.getAttribute('data-feature') }); }
    else if (a === 'to-premium') { closeDialog(true); open({ type: 'premium' }); }
    else if (a === 'event') { open({ type: 'event', id: id }); }
    else if (a === 'club') { open({ type: 'club', id: id }); }
    else if (a === 'premium') { open({ type: 'premium' }); }
    else if (a === 'discover') { goList(false); }
    else if (a === 'account') { if (!needLogin('account')) open({ type: 'account' }); }
    else if (a === 'back') { goList(true); }
    else if (a === 'close') { closeDialog(); }
    else if (a === 'pricing') { state.student = el.getAttribute('data-student') === '1'; render(); }
    else if (a === 'buy') { buy(); }
    else if (a === 'billing') { billing(); }
    else if (a === 'ai') { openChat(); }
    else if (a === 'ask-ai') { var ev = eventById(id); if (ev) openChat(L.askAiPrompt(ev.title, ev.venue.name)); }
    else if (a === 'ai-consent') { state.ai.consent = true; lsSet('ns_ai_consent', '1'); renderLayer(); focusId('chat-input'); }
    else if (a === 'ai-sugg') { askAi(el.getAttribute('data-text')); }
    else if (a === 'ai-clear') { if (!state.ai.busy) { state.ai.msgs = []; renderLayer(); focusId('chat-input'); } }
    else if (a === 'ai-revoke') {
      if (state.ai.busy) return;
      state.ai.consent = false; state.ai.msgs = []; state.ai.draft = ''; lsSet('ns_ai_consent', null);
      closeDialog(); toast(L.aiRevoked);
    }
    else if (a === 'logout') {
      api('/api/auth/logout', {}).then(function () { return reload(); }).then(function () { state.confirmDelete = false; goList(false); toast(L.loggedOut); }, fail);
    }
    else if (a === 'delete') { state.confirmDelete = true; render(); focusId('del-yes'); }
    else if (a === 'delete-no') { state.confirmDelete = false; render(); focusId('del'); }
    else if (a === 'delete-yes') {
      api('/api/me/delete', {}).then(function () { return reload(); }).then(function () { state.confirmDelete = false; goList(false); toast(L.deleted); }, fail);
    }
    else if (a === 'copy') {
      var e = eventById(id);
      if (!e) return;
      var price = e.price === 0 ? L.free : (e.price ? L.from(e.price) : '');
      var text = 'Nightstamp: ' + e.title + ', ' + whenText(e) + ', ' + e.venue.name + ', ' + addr(e.venue) + (price ? ', ' + price : '') + ' – ' + e.url;
      try {
        navigator.clipboard.writeText(text).then(function () { toast(L.copied); }, function () { toast(L.copyFail); });
      } catch (err) { toast(L.copyFail); }
    }
  });

  document.addEventListener('submit', function (evt) {
    var f = evt.target;
    if (!f) return;
    if (f.id === 'chatForm') {
      evt.preventDefault();
      askAi(document.getElementById('chat-input').value);
      return;
    }
    if (f.id !== 'authForm') return;
    evt.preventDefault();
    var d = state.dialog, L = t();
    var email = document.getElementById('auth-email').value.trim();
    var birth = document.getElementById('auth-birth').value;
    var privacy = document.getElementById('auth-privacy').checked;
    d.email = email; d.birth = birth; d.privacy = privacy; d.error = '';
    d.errEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    d.errBirth = !/^\d{4}-\d{2}-\d{2}$/.test(birth);
    d.errPrivacy = !privacy;
    if (d.errEmail || d.errBirth || d.errPrivacy) {
      renderLayer();
      focusId(d.errEmail ? 'auth-email' : (d.errBirth ? 'auth-birth' : 'auth-privacy'));
      return;
    }
    d.busy = true;
    renderLayer();
    api('/api/auth/start', { email: email, birthdate: birth, privacy: true, lang: state.lang }).then(function (r) {
      state.dialog = { type: 'sent', email: email, devLink: r.devLink || '' };
      renderLayer();
      focusId('dlg-go') || focusId('dlg-close');
    }, function (err) {
      d.busy = false;
      if (err.code === 'too_young' || err.code === 'bad_birthdate') d.errBirth = L.err[err.code];
      else if (err.code === 'bad_email') d.errEmail = true;
      else d.error = errText(err);
      renderLayer();
      focusId(d.errBirth ? 'auth-birth' : (d.errEmail ? 'auth-email' : 'auth-submit'));
    });
  });

  document.addEventListener('change', function (evt) {
    var el = evt.target;
    if (el.id === 'when') { state.when = el.value; render(); }
    else if (el.id === 'city') { state.city = el.value; state.genre = 'all'; pickDefaultWhen(); render(); }
    else if (el.name === 'pass') {
      state.pass = el.value;
      var p = passById(state.pass), b = document.getElementById('buy');
      if (b) b.textContent = t().buyPass(p.n, passPrice(p));
    }
  });
  document.addEventListener('input', function (evt) {
    if (evt.target.id === 'chat-input') state.ai.draft = evt.target.value;
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.key === 'Escape' && state.dialog && !gateShown()) { evt.preventDefault(); closeDialog(); }
  });

  window.addEventListener('resize', fitPicks);
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitPicks); }

  /* ---------- Start ---------- */
  function boot() {
    var q = new URLSearchParams(window.location.search);
    var token = q.get('confirm'), paid = q.get('paid');
    if (token || paid) window.history.replaceState(null, '', window.location.pathname);
    state.loadError = false;

    var first = token
      ? api('/api/auth/confirm', { token: token }).then(function () { return 'ok'; }, function (err) { return err; })
      : Promise.resolve(null);

    first.then(function (confirmed) {
      return reload().then(function () {
        pickDefaultWhen();
        // Wer einen gültigen Anmeldelink öffnet, hat sein Alter bereits mit dem Geburtsdatum belegt
        if (confirmed === 'ok' && me()) { state.gate = 'ok'; lsSet('ns_age16', '1'); }
        render();
        if (confirmed === 'ok') {
          var pending = null;
          try { pending = JSON.parse(ssGet('ns_pending') || 'null'); } catch (err) { pending = null; }
          ssSet('ns_pending', null);
          if (pending && pending.type === 'go' && eventById(pending.id)) {
            toggleGoing(pending.id, true).then(function () { toast(t().signedVote); });
          } else toast(t().signedIn);
        } else if (confirmed) {
          fail(confirmed);
        }
        if (paid === '1') { open({ type: 'premium' }); toast(t().paidWait); waitForPremium(8); }
        else if (paid === '0') { open({ type: 'premium' }); toast(t().paidCancel); }
      });
    }).catch(function () { state.loadError = true; render(); });
  }

  render();
  boot();
})();

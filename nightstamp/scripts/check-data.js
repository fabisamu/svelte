// Prüft data/venues.json und data/events.json auf Tippfehler, bevor sie online gehen.
// Aufruf: npm run check
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(fs.readFileSync(path.join(here, '..', 'data', f), 'utf8'));
const { cities, venues } = read('venues.json');
const { events } = read('events.json');
const GENRES = ['techno', 'rave', 'dnb', 'house', 'hiphop', 'latin', 'rock', 'pop', 'party', 'festival', 'student'];
const problems = [];
const cityIds = new Set(cities.map((c) => c.id));
const venueIds = new Set();

for (const v of venues) {
	if (venueIds.has(v.id)) problems.push(`Club-ID doppelt: ${v.id}`);
	venueIds.add(v.id);
	if (!cityIds.has(v.city)) problems.push(`${v.id}: unbekannte Stadt "${v.city}"`);
	for (const k of ['name', 'street', 'zip', 'url']) if (!v[k]) problems.push(`${v.id}: "${k}" fehlt`);
	if (!/^https:\/\//.test(v.url || '')) problems.push(`${v.id}: url muss mit https:// beginnen`);
	for (const g of v.genres || []) if (!GENRES.includes(g)) problems.push(`${v.id}: unbekannte Musikrichtung "${g}"`);
}
const eventIds = new Set();
const today = new Date().toISOString().slice(0, 10);
let past = 0;
for (const e of events) {
	if (eventIds.has(e.id)) problems.push(`Event-ID doppelt: ${e.id}`);
	eventIds.add(e.id);
	if (!venueIds.has(e.venue)) problems.push(`${e.id}: unbekannter Club "${e.venue}"`);
	if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date || '') || Number.isNaN(Date.parse(e.date))) problems.push(`${e.id}: Datum muss JJJJ-MM-TT sein`);
	if (e.time !== null && !/^\d{2}:\d{2}$/.test(e.time)) problems.push(`${e.id}: Uhrzeit muss HH:MM oder null sein`);
	if (!GENRES.includes(e.genre)) problems.push(`${e.id}: unbekannte Musikrichtung "${e.genre}"`);
	if (e.price !== null && !(typeof e.price === 'number' && e.price >= 0)) problems.push(`${e.id}: Preis muss Zahl oder null sein`);
	if (e.age !== null && !(Number.isInteger(e.age) && e.age > 0)) problems.push(`${e.id}: Alter muss ganze Zahl oder null sein`);
	if (!e.title || !e.source) problems.push(`${e.id}: Titel oder Quelle fehlt`);
	if (!/^https:\/\//.test(e.url || '')) problems.push(`${e.id}: url muss mit https:// beginnen`);
	if (e.date < today) past++;
}
console.log(`${venues.length} Clubs, ${events.length} Events (${past} davon schon vorbei).`);
if (problems.length) {
	console.error(problems.map((p) => '  ✗ ' + p).join('\n'));
	process.exit(1);
}
console.log('Alles in Ordnung.');

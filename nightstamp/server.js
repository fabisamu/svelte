// Nightstamp – Server
// Liefert die Website aus und stellt die API bereit: Konten (E-Mail-Link, Alterspruefung),
// Zusagen, Live-Meldungen, Erinnerungen, KI-Assistent (Claude) und Zahlung (Stripe Checkout).
// Geheimnisse (API-Schluessel) bleiben hier am Server und erreichen nie den Browser.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(HERE, 'public');
const env = process.env;

const PORT = Number(env.PORT || 3000);
const BASE_URL = (env.BASE_URL || 'http://localhost:' + PORT).replace(/\/+$/, '');
const PROD = env.NODE_ENV === 'production';
const SECURE = BASE_URL.startsWith('https://');
const DB_FILE = env.DB_FILE || path.join(HERE, 'data', 'db.json');
const AI_MODEL = env.AI_MODEL || 'claude-opus-5-5';
const AI_FREE_PER_DAY = Number(env.AI_FREE_PER_DAY || 5);
const AI_PREMIUM_PER_DAY = Number(env.AI_PREMIUM_PER_DAY || 50);
const AI_GLOBAL_PER_DAY = Number(env.AI_GLOBAL_PER_DAY || 2000);
const MIN_AGE = 16;
const TZ = 'Europe/Vienna';

const anthropic = env.ANTHROPIC_API_KEY || env.ANTHROPIC_AUTH_TOKEN ? new Anthropic() : null;
const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;
const mailer = env.SMTP_URL ? nodemailer.createTransport(env.SMTP_URL) : null;
const MAIL_FROM = env.MAIL_FROM || 'Nightstamp <no-reply@localhost>';

const OPERATOR = {
	name: env.OPERATOR_NAME || '',
	street: env.OPERATOR_STREET || '',
	city: env.OPERATOR_CITY || '',
	email: env.OPERATOR_EMAIL || '',
	phone: env.OPERATOR_PHONE || '',
	uid: env.OPERATOR_UID || '',
	register: env.OPERATOR_REGISTER || '',
	business: env.OPERATOR_BUSINESS || '',
	authority: env.OPERATOR_AUTHORITY || '',
	host: env.OPERATOR_HOSTING || ''
};

/* ---------- Preise (Bruttopreise in Cent, inkl. USt) ---------- */
const PLANS = {
	week: { cents: 499, student: 399, days: 7, name: 'Nightstamp Premium – Wochenpass (7 Tage, einmalig)' },
	month: { cents: 799, student: 499, interval: 'month', name: 'Nightstamp Premium – Monatsabo' },
	year: { cents: 3999, student: 2999, interval: 'year', name: 'Nightstamp Premium – Jahresabo' }
};
const STUDENT_DOMAINS = (
	'uni-graz.at,tugraz.at,medunigraz.at,kug.ac.at,fh-joanneum.at,univie.ac.at,tuwien.ac.at,wu.ac.at,boku.ac.at,' +
	'meduniwien.ac.at,jku.at,ufg.at,fh-ooe.at,plus.ac.at,sbg.ac.at,fh-salzburg.ac.at,uibk.ac.at,i-med.ac.at,mci.edu,' +
	(env.STUDENT_DOMAINS || '')
)
	.split(',')
	.map((s) => s.trim().toLowerCase())
	.filter(Boolean);

function isStudentEmail(email) {
	const domain = email.split('@')[1] || '';
	if (domain.endsWith('.ac.at')) return true;
	return STUDENT_DOMAINS.some((d) => domain === d || domain.endsWith('.' + d));
}

/* ---------- Inhalte: Clubs und Events ---------- */
function readJson(file) {
	return JSON.parse(fs.readFileSync(path.join(HERE, 'data', file), 'utf8'));
}
const VENUE_DATA = readJson('venues.json');
const EVENT_DATA = readJson('events.json');
const VENUES = new Map(VENUE_DATA.venues.map((v) => [v.id, v]));
const EVENTS = new Map(EVENT_DATA.events.filter((e) => VENUES.has(e.venue)).map((e) => [e.id, e]));

function today() {
	return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date());
}
function hourNow() {
	return Number(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }).format(new Date()));
}
function yesterday() {
	const d = new Date(today() + 'T12:00:00Z');
	d.setUTCDate(d.getUTCDate() - 1);
	return d.toISOString().slice(0, 10);
}
/** Ein Event gilt am Eventtag als "laeuft" und noch bis 6 Uhr am naechsten Morgen. */
function isLiveNight(e) {
	return e.date === today() || (e.date === yesterday() && hourNow() < 6);
}
function upcomingEvents() {
	const t = today();
	return [...EVENTS.values()].filter((e) => e.date >= t || isLiveNight(e));
}

/* ---------- Datenbank (JSON-Datei) ---------- */
let db = { users: {}, sessions: {}, magic: {}, going: {}, reports: {}, usage: {} };
try {
	db = { ...db, ...JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) };
} catch {
	// erste Ausfuehrung: Datei entsteht beim ersten Speichern
}
let saveTimer = null;
function save() {
	if (saveTimer) return;
	saveTimer = setTimeout(() => {
		saveTimer = null;
		const tmp = DB_FILE + '.tmp';
		fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
		fs.writeFileSync(tmp, JSON.stringify(db));
		fs.renameSync(tmp, DB_FILE);
	}, 200);
}
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const newToken = () => crypto.randomBytes(32).toString('base64url');

function userByEmail(email) {
	return Object.values(db.users).find((u) => u.email === email) || null;
}
function isPremium(u) {
	return !!(u && u.premium && u.premium.until > Date.now());
}
function goingCount(id) {
	return (db.going[id] || []).length;
}

/* ---------- Kleine Helfer ---------- */
const hits = new Map();
/** Einfaches Limit im Arbeitsspeicher. IP-Adressen werden nicht gespeichert oder protokolliert. */
function limited(key, max, windowMs) {
	const now = Date.now();
	const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
	if (list.length >= max) {
		hits.set(key, list);
		return true;
	}
	list.push(now);
	hits.set(key, list);
	return false;
}
setInterval(() => {
	const now = Date.now();
	for (const [k, list] of hits) if (!list.some((t) => now - t < 86400000)) hits.delete(k);
}, 3600000).unref();

function clientIp(req) {
	const fwd = env.TRUST_PROXY ? String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() : '';
	return fwd || req.socket.remoteAddress || 'unknown';
}
function cookies(req) {
	const out = {};
	for (const part of String(req.headers.cookie || '').split(';')) {
		const i = part.indexOf('=');
		if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
	}
	return out;
}
function sessionCookie(value, maxAge) {
	return `ns_sid=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${SECURE ? '; Secure' : ''}`;
}
function currentUser(req) {
	const sid = cookies(req).ns_sid;
	if (!sid) return null;
	const s = db.sessions[sha(sid)];
	if (!s || s.exp < Date.now()) return null;
	return db.users[s.uid] || null;
}
function send(res, status, body, headers = {}) {
	const data = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
	res.writeHead(status, {
		'Content-Type': typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
		'Cache-Control': 'no-store',
		...headers
	});
	res.end(data);
}
class HttpError extends Error {
	constructor(status, code) {
		super(code);
		this.status = status;
		this.code = code;
	}
}
function readBody(req, max = 65536) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		let size = 0;
		req.on('data', (c) => {
			size += c.length;
			if (size > max) {
				reject(new HttpError(413, 'too_large'));
				req.destroy();
			} else chunks.push(c);
		});
		req.on('end', () => resolve(Buffer.concat(chunks)));
		req.on('error', reject);
	});
}
async function readJsonBody(req) {
	if (!String(req.headers['content-type'] || '').startsWith('application/json')) throw new HttpError(415, 'json_only');
	// Schutz gegen fremde Seiten, die im Namen eingeloggter Leute Anfragen schicken
	const origin = req.headers.origin;
	if (origin && origin !== new URL(BASE_URL).origin) throw new HttpError(403, 'bad_origin');
	try {
		return JSON.parse((await readBody(req)).toString('utf8') || '{}');
	} catch (err) {
		if (err instanceof HttpError) throw err;
		throw new HttpError(400, 'bad_json');
	}
}
function needUser(req) {
	const u = currentUser(req);
	if (!u) throw new HttpError(401, 'login_required');
	return u;
}
function ageOn(birth) {
	const [y, m, d] = birth.split('-').map(Number);
	const [ty, tm, td] = today().split('-').map(Number);
	return ty - y - (tm < m || (tm === m && td < d) ? 1 : 0);
}

/* ---------- Live-Andrang ---------- */
const LEVELS = ['quiet', 'good', 'full', 'queue'];
function liveFor(e) {
	if (!isLiveNight(e)) return null;
	const fresh = (db.reports[e.id] || []).filter((r) => Date.now() - r.at < 60 * 60000);
	if (!fresh.length) return { level: null, n: 0, mins: 0 };
	const latest = fresh.reduce((a, b) => (a.at > b.at ? a : b));
	const count = {};
	for (const r of fresh) count[r.level] = (count[r.level] || 0) + 1;
	// haeufigste Meldung der letzten Stunde, bei Gleichstand die juengste
	const top = Math.max(...Object.values(count));
	const level = count[latest.level] === top ? latest.level : LEVELS.find((l) => count[l] === top);
	return { level, n: fresh.length, mins: Math.round((Date.now() - latest.at) / 60000) };
}

/* ---------- Antworten fuer die Website ---------- */
function publicUser(u) {
	if (!u) return null;
	const mine = {};
	for (const [id, list] of Object.entries(db.reports)) {
		const r = list.find((x) => x.uid === u.id);
		if (r) mine[id] = r.level;
	}
	return {
		email: u.email,
		adult: !!u.adult,
		studentEligible: isStudentEmail(u.email),
		premium: isPremium(u) ? { plan: u.premium.plan, until: u.premium.until, renews: !!u.premium.renews } : null,
		billing: !!u.stripeCustomer,
		going: Object.keys(db.going).filter((id) => db.going[id].includes(u.id)),
		reminders: Object.keys(u.reminders || {}),
		reports: mine
	};
}
function dataPayload(u) {
	const prem = isPremium(u);
	return {
		today: today(),
		updated: EVENT_DATA.updated,
		cities: VENUE_DATA.cities,
		venues: VENUE_DATA.venues,
		events: upcomingEvents().map((e) => {
			const lv = liveFor(e);
			return { ...e, going: goingCount(e.id), liveNight: !!lv, live: lv && prem ? lv : null };
		}),
		features: { ai: !!anthropic, pay: !!stripe, aiFree: AI_FREE_PER_DAY, aiPremium: AI_PREMIUM_PER_DAY },
		prices: Object.fromEntries(Object.entries(PLANS).map(([k, p]) => [k, { cents: p.cents, student: p.student }])),
		operator: OPERATOR,
		me: publicUser(u)
	};
}

/* ---------- E-Mail ---------- */
async function sendMail(to, subject, text) {
	if (!mailer) return false;
	await mailer.sendMail({ from: MAIL_FROM, to, subject, text });
	return true;
}

/* ---------- Konto ---------- */
async function authStart(req, res) {
	const b = await readJsonBody(req);
	const email = String(b.email || '').trim().toLowerCase();
	const birth = String(b.birthdate || '');
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) throw new HttpError(400, 'bad_email');
	if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || Number.isNaN(Date.parse(birth))) throw new HttpError(400, 'bad_birthdate');
	if (b.privacy !== true) throw new HttpError(400, 'privacy_required');
	const age = ageOn(birth);
	if (age < MIN_AGE || age > 120) throw new HttpError(403, 'too_young');
	if (limited('auth:' + clientIp(req), 8, 10 * 60000) || limited('auth:' + email, 4, 10 * 60000)) {
		throw new HttpError(429, 'slow_down');
	}
	if (!mailer && PROD) throw new HttpError(503, 'mail_not_configured');

	const token = newToken();
	// Das Geburtsdatum wird nicht gespeichert, nur ob die Person volljaehrig ist.
	db.magic[sha(token)] = { email, adult: age >= 18, exp: Date.now() + 30 * 60000 };
	save();
	const link = `${BASE_URL}/?confirm=${token}`;
	const en = b.lang === 'en';
	const sent = await sendMail(
		email,
		en ? 'Your Nightstamp sign-in link' : 'Dein Anmeldelink für Nightstamp',
		en
			? `Hi!\n\nOpen this link to confirm your email address and sign in to Nightstamp. It is valid for 30 minutes and works once:\n\n${link}\n\nIf you did not ask for this, ignore this email. Nothing will happen.`
			: `Hallo!\n\nMit diesem Link bestätigst du deine E-Mail-Adresse und meldest dich bei Nightstamp an. Er gilt 30 Minuten und funktioniert einmal:\n\n${link}\n\nWenn du das nicht warst, ignoriere diese E-Mail. Es passiert dann nichts.`
	);
	if (!sent) console.log('[dev] Kein SMTP eingerichtet. Anmeldelink für ' + email + ': ' + link);
	send(res, 200, { ok: true, devLink: sent ? undefined : link });
}

async function authConfirm(req, res) {
	const b = await readJsonBody(req);
	const key = sha(String(b.token || ''));
	const m = db.magic[key];
	delete db.magic[key];
	if (!m || m.exp < Date.now()) {
		save();
		throw new HttpError(400, 'link_invalid');
	}
	let u = userByEmail(m.email);
	if (!u) {
		u = { id: crypto.randomUUID(), email: m.email, adult: m.adult, createdAt: Date.now(), privacyAt: Date.now(), reminders: {} };
		db.users[u.id] = u;
	} else if (m.adult) {
		u.adult = true;
	}
	const sid = newToken();
	db.sessions[sha(sid)] = { uid: u.id, exp: Date.now() + 30 * 86400000 };
	save();
	send(res, 200, { ok: true, me: publicUser(u) }, { 'Set-Cookie': sessionCookie(sid, 30 * 86400) });
}

async function logout(req, res) {
	await readJsonBody(req);
	const sid = cookies(req).ns_sid;
	if (sid) delete db.sessions[sha(sid)];
	save();
	send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie('', 0) });
}

function exportData(req, res) {
	const u = needUser(req);
	const out = {
		hinweis: 'Auskunft nach Art. 15 und 20 DSGVO: alle Daten, die Nightstamp zu deinem Konto gespeichert hat.',
		konto: { email: u.email, volljaehrig: !!u.adult, erstellt: new Date(u.createdAt).toISOString(), datenschutz_akzeptiert: new Date(u.privacyAt).toISOString() },
		premium: u.premium ? { plan: u.premium.plan, bis: new Date(u.premium.until).toISOString(), verlaengert_sich: !!u.premium.renews } : null,
		stripe_kundennummer: u.stripeCustomer || null,
		zusagen: Object.keys(db.going).filter((id) => db.going[id].includes(u.id)),
		erinnerungen: Object.keys(u.reminders || {}),
		live_meldungen: Object.entries(db.reports).flatMap(([id, list]) =>
			list.filter((r) => r.uid === u.id).map((r) => ({ event: id, meldung: r.level, zeit: new Date(r.at).toISOString() }))
		)
	};
	send(res, 200, JSON.stringify(out, null, 2), {
		'Content-Type': 'application/json; charset=utf-8',
		'Content-Disposition': 'attachment; filename="nightstamp-meine-daten.json"'
	});
}

async function deleteAccount(req, res) {
	await readJsonBody(req);
	const u = needUser(req);
	if (stripe && u.premium && u.premium.sub) {
		try {
			await stripe.subscriptions.cancel(u.premium.sub);
		} catch (err) {
			if (err.code !== 'resource_missing') {
				console.error('Abo konnte nicht gekündigt werden:', err.message);
				throw new HttpError(502, 'cancel_failed');
			}
		}
	}
	for (const id of Object.keys(db.going)) db.going[id] = db.going[id].filter((x) => x !== u.id);
	for (const id of Object.keys(db.reports)) db.reports[id] = db.reports[id].filter((r) => r.uid !== u.id);
	for (const [k, s] of Object.entries(db.sessions)) if (s.uid === u.id) delete db.sessions[k];
	delete db.usage['u:' + u.id];
	delete db.users[u.id];
	save();
	send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie('', 0) });
}

/* ---------- Zusagen, Meldungen, Erinnerungen ---------- */
function eventFromBody(b) {
	const e = EVENTS.get(String(b.eventId || ''));
	if (!e || !(e.date >= today() || isLiveNight(e))) throw new HttpError(404, 'no_event');
	return e;
}
async function setGoing(req, res) {
	const b = await readJsonBody(req);
	const u = needUser(req);
	const e = eventFromBody(b);
	if (e.age >= 18 && !u.adult) throw new HttpError(403, 'adults_only');
	const list = (db.going[e.id] = (db.going[e.id] || []).filter((x) => x !== u.id));
	if (b.on) list.push(u.id);
	else if (db.reports[e.id]) db.reports[e.id] = db.reports[e.id].filter((r) => r.uid !== u.id);
	save();
	send(res, 200, { ok: true, going: list.length, me: publicUser(u) });
}
async function setReport(req, res) {
	const b = await readJsonBody(req);
	const u = needUser(req);
	const e = eventFromBody(b);
	if (!LEVELS.includes(b.level)) throw new HttpError(400, 'bad_level');
	if (!isLiveNight(e)) throw new HttpError(409, 'not_tonight');
	if (!(db.going[e.id] || []).includes(u.id)) throw new HttpError(403, 'not_going');
	db.reports[e.id] = (db.reports[e.id] || []).filter((r) => r.uid !== u.id && Date.now() - r.at < 12 * 3600000);
	db.reports[e.id].push({ uid: u.id, level: b.level, at: Date.now() });
	save();
	send(res, 200, { ok: true, live: isPremium(u) ? liveFor(e) : null, me: publicUser(u) });
}
async function setReminder(req, res) {
	const b = await readJsonBody(req);
	const u = needUser(req);
	const e = eventFromBody(b);
	if (!isPremium(u)) throw new HttpError(402, 'premium_required');
	u.reminders = u.reminders || {};
	if (b.on) u.reminders[e.id] = u.reminders[e.id] || 0;
	else delete u.reminders[e.id];
	save();
	send(res, 200, { ok: true, me: publicUser(u) });
}

/** Schickt am Eventtag ab 10 Uhr eine Erinnerung und raeumt abgelaufene Daten weg. */
async function housekeeping() {
	const t = today();
	const now = Date.now();
	for (const [k, m] of Object.entries(db.magic)) if (m.exp < now) delete db.magic[k];
	for (const [k, s] of Object.entries(db.sessions)) if (s.exp < now) delete db.sessions[k];
	for (const [k, v] of Object.entries(db.usage)) if (v.day !== t) delete db.usage[k];
	for (const id of Object.keys(db.reports)) {
		const e = EVENTS.get(id);
		if (!e || !isLiveNight(e)) delete db.reports[id];
	}
	for (const id of Object.keys(db.going)) {
		const e = EVENTS.get(id);
		if (!e || (e.date < t && !isLiveNight(e))) delete db.going[id];
	}
	for (const u of Object.values(db.users)) {
		for (const [id, sentAt] of Object.entries(u.reminders || {})) {
			const e = EVENTS.get(id);
			if (!e || e.date < t) {
				delete u.reminders[id];
				continue;
			}
			if (sentAt || e.date !== t || hourNow() < 10 || !isPremium(u) || !mailer) continue;
			const v = VENUES.get(e.venue);
			try {
				await sendMail(
					u.email,
					`Heute: ${e.title}`,
					`Heute ist es so weit: ${e.title}\n${e.time ? 'Beginn ' + e.time + ' Uhr, ' : ''}${v.name}, ${v.street}, ${v.zip}\n\nInfos und Tickets: ${e.url}\n\nDiese Erinnerung hast du auf Nightstamp eingeschaltet. Abschalten kannst du sie beim Event oder in deinem Konto: ${BASE_URL}`
				);
				u.reminders[id] = now;
			} catch (err) {
				console.error('Erinnerung nicht gesendet:', err.message);
			}
		}
	}
	save();
}
setInterval(() => housekeeping().catch((err) => console.error(err)), 15 * 60000).unref();

/* ---------- KI-Assistent ---------- */
const GENRE_NAMES = {
	techno: 'Techno', rave: 'Rave', dnb: 'Drum & Bass', house: 'House', hiphop: 'HipHop', latin: 'Latin',
	rock: 'Rock/Metal/Punk', pop: 'Pop/Indie', party: 'Party (gemischt)', festival: 'Festival', student: 'Studentenparty'
};
// Fester Teil des Systemprompts. Er aendert sich nur, wenn die Datendateien sich aendern,
// und wird deshalb zwischengespeichert (Prompt-Caching). Das Datum steht bewusst dahinter.
const AI_SYSTEM =
	`Du bist der Ausgeh-Assistent von Nightstamp, einer Website für Clubs und Events in Graz, Wien, Linz, Salzburg und Innsbruck.

Deine Aufgabe: Leuten helfen, einen passenden Abend zu finden. Du empfiehlst Events und Clubs aus der Liste unten, vergleichst sie und beantwortest Fragen dazu (Wann, wo, welche Musik, ab welchem Alter, wo es Tickets gibt).

So arbeitest du:
- Verwende für Events, Clubs, Zeiten, Adressen und Preise ausschließlich die Daten unten. Sie sind alles, was Nightstamp weiß. Erfinde nichts dazu. Wenn etwas nicht in den Daten steht (zum Beispiel Preis, Mindestalter, Line-up oder Öffnungszeiten), sag das offen und verweise auf den Link des Veranstalters.
- Wenn zu einer Stadt, einem Tag oder einer Musikrichtung nichts eingetragen ist, sag das klar und schlag die nächstliegende Alternative aus den Daten vor.
- Die Daten stammen aus öffentlichen Veranstaltungskalendern und können sich ändern. Bei konkreten Plänen erinnerst du kurz daran, Zeit und Tickets beim Veranstalter zu prüfen.
- Antworte kurz und konkret, im lockeren Du-Ton, in der Sprache der Nachricht (Deutsch oder Englisch). Nenne bei Events immer Datum, Uhrzeit (falls bekannt) und Ort. Schreib einfachen Text ohne Markdown-Formatierung, Aufzählungen mit Bindestrich sind in Ordnung.
- Die Leute hier sind mindestens 16, manche noch nicht 18. Geh verantwortungsvoll mit Alkohol um: keine Trinkspiele, keine Tipps, wie man Alterskontrollen oder Türsteher umgeht, keine Hilfe beim Beschaffen von Drogen. Bei Fragen zu sicherem Heimkommen, K.-o.-Tropfen oder wenn es jemandem schlecht geht, hilf sachlich und nenne den Notruf 144 (Rettung) oder 112.
- Du bist eine KI und kannst dich irren. Du kannst keine Tickets kaufen, nichts reservieren und keine Kontodaten sehen. Für Fragen zu Konto, Zahlung oder Datenschutz verweise auf die Seiten "Konto", "Premium" und "Datenschutz" der Website.
- Bei Themen, die nichts mit Ausgehen, Musik, den Städten oder Nightstamp zu tun haben, sag freundlich, dass du dafür nicht gedacht bist.

CLUBS UND VERANSTALTUNGSORTE
` +
	VENUE_DATA.cities
		.map(
			(c) =>
				c.de + ':\n' +
				VENUE_DATA.venues
					.filter((v) => v.city === c.id)
					.map((v) => `- ${v.name}, ${v.street}, ${v.zip} ${c.de}. Musik: ${v.genres.map((g) => GENRE_NAMES[g]).join(', ')}. Website: ${v.url}`)
					.join('\n')
		)
		.join('\n\n') +
	`

EVENTS (Stand ${EVENT_DATA.updated}; "unbekannt" heißt: die Quelle nennt es nicht)
` +
	[...EVENTS.values()]
		.sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))
		.map((e) => {
			const v = VENUES.get(e.venue);
			const c = VENUE_DATA.cities.find((x) => x.id === v.city);
			const price = e.price === null ? 'unbekannt' : e.price === 0 ? 'frei' : 'ab ' + e.price + ' €';
			return `- ${e.date} | ${e.time || 'Uhrzeit unbekannt'} | ${c.de} | ${v.name} | ${e.title} | ${GENRE_NAMES[e.genre]} | Eintritt: ${price} | Mindestalter: ${e.age || 'unbekannt'} | ${e.url}`;
		})
		.join('\n');

function aiQuota(req, u) {
	const t = today();
	const key = u ? 'u:' + u.id : 'ip:' + sha(clientIp(req) + t).slice(0, 16);
	const max = isPremium(u) ? AI_PREMIUM_PER_DAY : AI_FREE_PER_DAY;
	const mine = db.usage[key] && db.usage[key].day === t ? db.usage[key] : (db.usage[key] = { day: t, n: 0 });
	const all = db.usage.all && db.usage.all.day === t ? db.usage.all : (db.usage.all = { day: t, n: 0 });
	return { mine, all, max };
}

async function chat(req, res) {
	const b = await readJsonBody(req);
	if (!anthropic) throw new HttpError(503, 'ai_not_configured');
	if (b.consent !== true) throw new HttpError(400, 'consent_required');
	if (!Array.isArray(b.messages) || !b.messages.length || b.messages.length > 24) throw new HttpError(400, 'bad_messages');
	const messages = b.messages.map((m, i) => {
		const role = i % 2 === 0 ? 'user' : 'assistant';
		if (!m || m.role !== role || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 2000) {
			throw new HttpError(400, 'bad_messages');
		}
		return { role, content: m.content };
	});
	if (messages[messages.length - 1].role !== 'user') throw new HttpError(400, 'bad_messages');

	const u = currentUser(req);
	if (limited('chat:' + clientIp(req), 6, 60000)) throw new HttpError(429, 'slow_down');
	const q = aiQuota(req, u);
	if (q.all.n >= AI_GLOBAL_PER_DAY) throw new HttpError(429, 'ai_busy');
	if (q.mine.n >= q.max) throw new HttpError(429, isPremium(u) ? 'ai_limit_premium' : 'ai_limit_free');
	q.mine.n++;
	q.all.n++;
	save();

	res.writeHead(200, {
		'Content-Type': 'text/event-stream; charset=utf-8',
		'Cache-Control': 'no-store',
		'X-Accel-Buffering': 'no'
	});
	const emit = (obj) => res.write('data: ' + JSON.stringify(obj) + '\n\n');
	const weekday = new Intl.DateTimeFormat('de-AT', { timeZone: TZ, weekday: 'long' }).format(new Date());

	try {
		const stream = anthropic.beta.messages.stream({
			model: AI_MODEL,
			max_tokens: 4000,
			// Kurze Auskuenfte: wenig Denkaufwand reicht und haelt die Antwort schnell.
			output_config: { effort: 'low' },
			// Lehnt das Modell eine Anfrage ab, uebernimmt automatisch ein Ersatzmodell.
			betas: ['server-side-fallback-2026-07-01'],
			fallbacks: 'default',
			system: [
				{ type: 'text', text: AI_SYSTEM, cache_control: { type: 'ephemeral' } },
				{ type: 'text', text: `Heute ist ${weekday}, der ${today()} (Zeitzone Wien). Vergangene Events empfiehlst du nicht.` }
			],
			messages
		});
		res.on('close', () => {
			if (!res.writableEnded) stream.abort();
		});
		for await (const event of stream) {
			if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') emit({ t: event.delta.text });
		}
		const final = await stream.finalMessage();
		if (final.stop_reason === 'refusal') emit({ error: 'ai_refused' });
		else if (final.stop_reason === 'max_tokens') emit({ t: ' …' });
		emit({ done: true, left: Math.max(0, q.max - q.mine.n) });
	} catch (err) {
		// Fehlgeschlagene Anfragen zaehlen nicht gegen das Tageslimit
		q.mine.n = Math.max(0, q.mine.n - 1);
		q.all.n = Math.max(0, q.all.n - 1);
		let code = 'ai_error';
		if (err instanceof Anthropic.APIUserAbortError) code = null;
		else if (err instanceof Anthropic.RateLimitError) code = 'ai_busy';
		else if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) code = 'ai_not_configured';
		else if (err instanceof Anthropic.APIError && err.status >= 500) code = 'ai_busy';
		if (code) {
			console.error('KI-Anfrage fehlgeschlagen:', err.status || '', err.message);
			emit({ error: code });
		}
	}
	res.end();
}

/* ---------- Zahlung (Stripe) ---------- */
async function checkout(req, res) {
	const b = await readJsonBody(req);
	const u = needUser(req);
	if (!stripe) throw new HttpError(503, 'pay_not_configured');
	const plan = PLANS[b.plan];
	if (!plan) throw new HttpError(400, 'bad_plan');
	if (!u.adult) throw new HttpError(403, 'adults_only');
	if (b.terms !== true || b.withdrawal !== true) throw new HttpError(400, 'terms_required');
	const student = !!b.student;
	if (student && !isStudentEmail(u.email)) throw new HttpError(403, 'not_student');
	if (isPremium(u) && u.premium.renews) throw new HttpError(409, 'already_premium');
	if (limited('pay:' + u.id, 6, 10 * 60000)) throw new HttpError(429, 'slow_down');

	const recurring = plan.interval ? { recurring: { interval: plan.interval } } : {};
	const meta = { uid: u.id, plan: b.plan, student: student ? '1' : '0' };
	const session = await stripe.checkout.sessions.create({
		mode: plan.interval ? 'subscription' : 'payment',
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: 'eur',
					unit_amount: student ? plan.student : plan.cents,
					tax_behavior: 'inclusive',
					product_data: { name: plan.name + (student ? ' (Studierende)' : '') },
					...recurring
				}
			}
		],
		// Zahlungsarten (Karte, Apple Pay, Google Pay, EPS, PayPal, Klarna ...) werden im
		// Stripe-Dashboard ein- und ausgeschaltet; Stripe zeigt die passenden automatisch an.
		...(u.stripeCustomer ? { customer: u.stripeCustomer } : { customer_email: u.email }),
		...(plan.interval ? { subscription_data: { metadata: meta } } : { customer_creation: 'always' }),
		client_reference_id: u.id,
		metadata: meta,
		locale: b.lang === 'en' ? 'en' : 'de',
		success_url: BASE_URL + '/?paid=1',
		cancel_url: BASE_URL + '/?paid=0'
	});
	u.termsAt = Date.now();
	save();
	send(res, 200, { url: session.url });
}

async function billingPortal(req, res) {
	const b = await readJsonBody(req);
	const u = needUser(req);
	if (!stripe) throw new HttpError(503, 'pay_not_configured');
	if (!u.stripeCustomer) throw new HttpError(404, 'no_customer');
	const s = await stripe.billingPortal.sessions.create({
		customer: u.stripeCustomer,
		return_url: BASE_URL + '/',
		locale: b.lang === 'en' ? 'en' : 'de'
	});
	send(res, 200, { url: s.url });
}

function periodEnd(sub) {
	const end = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
	return end ? end * 1000 : Date.now();
}
function applySubscription(sub) {
	const u = db.users[sub.metadata?.uid] || Object.values(db.users).find((x) => x.stripeCustomer === sub.customer);
	if (!u) return;
	const active = sub.status === 'active' || sub.status === 'trialing';
	if (active) {
		u.premium = { plan: sub.metadata?.plan || 'month', until: periodEnd(sub), sub: sub.id, renews: !sub.cancel_at_period_end && !sub.cancel_at };
	} else if (u.premium && u.premium.sub === sub.id) {
		// gekuendigt, abgelaufen oder Zahlung gescheitert
		u.premium = { ...u.premium, until: Math.min(u.premium.until, Date.now()), renews: false };
	}
	save();
}
async function completeCheckout(session) {
	const u = db.users[session.client_reference_id];
	if (!u) return;
	if (session.customer) u.stripeCustomer = session.customer;
	if (session.mode === 'subscription' && session.subscription) {
		applySubscription(await stripe.subscriptions.retrieve(session.subscription));
	} else if (session.mode === 'payment' && session.payment_status === 'paid') {
		const plan = PLANS[session.metadata?.plan] || PLANS.week;
		const from = isPremium(u) ? u.premium.until : Date.now();
		u.premium = { plan: session.metadata?.plan || 'week', until: from + plan.days * 86400000, renews: false };
	}
	save();
}
const seenEvents = new Set();
async function stripeWebhook(req, res) {
	if (!stripe || !env.STRIPE_WEBHOOK_SECRET) throw new HttpError(503, 'pay_not_configured');
	const raw = await readBody(req, 1024 * 1024);
	let event;
	try {
		event = stripe.webhooks.constructEvent(raw, req.headers['stripe-signature'], env.STRIPE_WEBHOOK_SECRET);
	} catch {
		throw new HttpError(400, 'bad_signature');
	}
	if (seenEvents.has(event.id)) return send(res, 200, { received: true });
	const obj = event.data.object;
	switch (event.type) {
		case 'checkout.session.completed':
		case 'checkout.session.async_payment_succeeded':
			await completeCheckout(obj);
			break;
		case 'customer.subscription.created':
		case 'customer.subscription.updated':
		case 'customer.subscription.deleted':
			applySubscription(obj);
			break;
		case 'invoice.paid': {
			const subId = obj.subscription || obj.parent?.subscription_details?.subscription;
			if (subId) applySubscription(await stripe.subscriptions.retrieve(typeof subId === 'string' ? subId : subId.id));
			break;
		}
	}
	seenEvents.add(event.id);
	if (seenEvents.size > 5000) seenEvents.clear();
	send(res, 200, { received: true });
}

/* ---------- Statische Dateien ---------- */
const TYPES = {
	'.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
	'.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.webmanifest': 'application/manifest+json'
};
const SECURITY_HEADERS = {
	'Content-Security-Policy':
		"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'",
	'X-Content-Type-Options': 'nosniff',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
	...(SECURE ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' } : {})
};
function serveStatic(req, res, pathname) {
	let rel = decodeURIComponent(pathname);
	if (rel === '/' || !path.extname(rel)) rel = '/index.html';
	const file = path.join(PUBLIC_DIR, path.normalize(rel));
	if (!file.startsWith(PUBLIC_DIR + path.sep)) return send(res, 403, 'Forbidden');
	fs.readFile(file, (err, data) => {
		if (err) return send(res, 404, 'Nicht gefunden');
		const ext = path.extname(file);
		res.writeHead(200, {
			'Content-Type': TYPES[ext] || 'application/octet-stream',
			'Cache-Control': ext === '.woff2' ? 'public, max-age=31536000, immutable' : 'no-cache',
			...SECURITY_HEADERS
		});
		res.end(req.method === 'HEAD' ? undefined : data);
	});
}

/* ---------- Routen ---------- */
const ROUTES = {
	'GET /api/data': (req, res) => send(res, 200, dataPayload(currentUser(req))),
	'POST /api/auth/start': authStart,
	'POST /api/auth/confirm': authConfirm,
	'POST /api/auth/logout': logout,
	'GET /api/me/export': exportData,
	'POST /api/me/delete': deleteAccount,
	'POST /api/going': setGoing,
	'POST /api/report': setReport,
	'POST /api/reminder': setReminder,
	'POST /api/chat': chat,
	'POST /api/checkout': checkout,
	'POST /api/billing': billingPortal,
	'POST /api/stripe/webhook': stripeWebhook
};

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url, BASE_URL);
	try {
		const route = ROUTES[req.method + ' ' + url.pathname];
		if (route) return await route(req, res);
		if (url.pathname.startsWith('/api/')) throw new HttpError(404, 'not_found');
		if (req.method !== 'GET' && req.method !== 'HEAD') throw new HttpError(405, 'method_not_allowed');
		serveStatic(req, res, url.pathname);
	} catch (err) {
		if (res.headersSent) return res.end();
		if (err instanceof HttpError) return send(res, err.status, { error: err.code });
		console.error(err);
		send(res, 500, { error: 'server_error' });
	}
});

server.listen(PORT, () => {
	console.log(`Nightstamp läuft auf ${BASE_URL}`);
	console.log(`  Clubs: ${VENUES.size}, Events: ${EVENTS.size} (Stand ${EVENT_DATA.updated})`);
	console.log(`  KI-Assistent:  ${anthropic ? 'an (' + AI_MODEL + ')' : 'AUS – ANTHROPIC_API_KEY fehlt'}`);
	console.log(`  Zahlung:       ${stripe ? (env.STRIPE_WEBHOOK_SECRET ? 'an' : 'Checkout an, aber STRIPE_WEBHOOK_SECRET fehlt – Premium wird nicht freigeschaltet') : 'AUS – STRIPE_SECRET_KEY fehlt'}`);
	console.log(`  E-Mail:        ${mailer ? 'an' : PROD ? 'AUS – SMTP_URL fehlt, Anmeldung nicht möglich' : 'aus – Anmeldelinks erscheinen hier im Log (nur Entwicklung)'}`);
	if (!OPERATOR.name) console.log('  Hinweis: OPERATOR_* fehlt – Impressum und Datenschutz zeigen Platzhalter.');
	housekeeping().catch((err) => console.error(err));
});

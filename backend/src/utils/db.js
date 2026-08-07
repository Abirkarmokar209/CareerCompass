/**
 * db.js
 * ------------------------------------------------------------------
 * Minimal, dependency-free JSON-file datastore.
 * CareerCompass uses this instead of a full DBMS so the project can
 * run anywhere with zero external services. Swapping this module for
 * a real MongoDB/Postgres layer later only requires changing this file
 * since every model talks to the app through the same interface.
 * ------------------------------------------------------------------
 */
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const DEFAULT_SHAPE = {
  users: [],
  roadmapTemplates: [],
  userRoadmaps: [],
};

function ensureFile() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_SHAPE, null, 2));
  }
}

function readDB() {
  ensureFile();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (err) {
    return { ...DEFAULT_SHAPE };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

/** Generic collection helpers */
const collection = (name) => ({
  all() {
    const db = readDB();
    return db[name] || [];
  },
  find(predicate) {
    return this.all().find(predicate);
  },
  filter(predicate) {
    return this.all().filter(predicate);
  },
  insert(record) {
    const db = readDB();
    db[name] = db[name] || [];
    db[name].push(record);
    writeDB(db);
    return record;
  },
  update(id, patch) {
    const db = readDB();
    const list = db[name] || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch };
    db[name] = list;
    writeDB(db);
    return list[idx];
  },
  replace(id, record) {
    const db = readDB();
    const list = db[name] || [];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx] = record;
    db[name] = list;
    writeDB(db);
    return record;
  },
  remove(id) {
    const db = readDB();
    const list = db[name] || [];
    const next = list.filter((r) => r.id !== id);
    const removed = next.length !== list.length;
    db[name] = next;
    writeDB(db);
    return removed;
  },
});

module.exports = { readDB, writeDB, collection };

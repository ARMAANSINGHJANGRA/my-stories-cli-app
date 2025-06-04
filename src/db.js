import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const DB_Path = fileURLToPath(new URL("../db.json", import.meta.url));

export const getDB = async () => {
  const db = await fs.readFile(DB_Path, "utf-8");
  return JSON.parse(db);
};

export const saveDB = async (db) => {
  await fs.writeFile(DB_Path, JSON.stringify(db, null, 2));
  return db;
};

export const insert = async (data) => {
  const db = await getDB();
  db.stories.push(data);
  await saveDB(db);
  return data;
};

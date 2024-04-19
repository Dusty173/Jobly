"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");
const dotenv = require("dotenv");

let db;

dotenv.config({ path: "./.env" });
if (process.env.NODE_ENV === "production") {
  db = new Client({
    password: "password",
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new Client({
    password: "password",
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
}

db.connect();

module.exports = db;
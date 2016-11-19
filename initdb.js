var fs = require("fs");
var file = "translate.db";
var exists = fs.existsSync(file);
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

db.serialize(() => {
  if (!exists) {
    db.run("CREATE TABLE croatian (id Integer PRIMARY KEY AUTOINCREMENT, word TEXT)")
    db.run("CREATE TABLE slovenian (id Integer PRIMARY KEY AUTOINCREMENT, word TEXT)")
    db.run("CREATE TABLE translation (slovenianid INT, croatianid INT, PRIMARY KEY (slovenianid, croatianid))")
  }
});
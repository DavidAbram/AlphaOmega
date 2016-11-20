var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('translate.db');
var async = require('async');

function addWord(word, lang, callback) {

    db.get(`SELECT * FROM ${lang} WHERE word == '${word}'`
        , (err, result) => {
            if (err == null) {

                if (result == undefined) {
                    db.run(`INSERT INTO ${lang} (word)
                         VALUES ('${word}')`
                        , function (err) {
                            if (err == null) {
                                callback(null, { id: this.lastID, lang: lang })
                            } else {
                                callback(err)
                            }
                        });

                } else {
                    callback(null, { id: result.id, lang: lang })
                }
            } else {
                callback(err);
            }
        })

}

module.exports = {
    translate: (word, langFrom, langTo, callback) => {
        result = JSON.parse(`{ "${langFrom}": "${word}", "${langTo}": [] }`);

        db.each(`SELECT ${langTo}.word FROM ${langFrom} 
                JOIN translation ON ${langFrom}.id == translation.${langFrom}id 
                JOIN ${langTo} ON ${langTo}.id == translation.${langTo}id 
                WHERE ${langFrom}.word == '${word}'`
            , (err, row) => {
                if (err == null) {
                    result[`${langTo}`].push(row.word);
                } else {
                    callback(err);
                }
            }, (err) => {
                if (err == null) {
                    callback(null, result);
                } else {
                    callback(err);
                }
            });
    },
    addTranslation: (word, translation, langFrom, langTo, callback) => {
        async.parallel([
            (sync) => {
                addWord(word, langFrom, sync);
            },
            (sync) => {
                addWord(translation, langTo, sync);
            }
        ], function (err, results) {

            db.get(`SELECT * FROM translation WHERE ${results[0].lang}id == '${results[0].id}' AND ${results[1].lang}id == '${results[1].id}'`, (err, result) => {
                if (err == null) {
                    if (result == undefined) {
                        db.get(`INSERT INTO translation (${results[0].lang}id, ${results[1].lang}id) VALUES ('${results[0].id}', ${results[1].id})`
                            , (err, result) => {
                                if (err == null) {
                                    callback(null);
                                } else {
                                    callback(err);
                                }
                            });
                    } else {
                        callback(null)
                    }
                } else {
                    callback(err);
                }
            });

            /*var a = `INSERT INTO translation (${results[0].lang}id, ${results[1].lang}id) VALUES ('${results[0].id}', ${results[1].id})`;

            db.get(`INSERT INTO translation (${results[0].lang}id, ${results[1].lang}id) VALUES ('${results[0].id}', ${results[1].id})`
            , (err, result) =>{
                if(err == null){
                    callback(null, result);
                } else {
                    callback(err);
                }
            });

            callback(err, results);*/
        });

    }
}
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('translate.db');

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

        db.get(`SELECT COUNT(*) AS count FROM ${langFrom} 
                WHERE word == '${word}'`
            , (err, result) => {
                console.log(err, result)
            })
            
    }
}
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('translate.db');

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({ message: 'AΩ' })
});

app.get('/translate/:lang1/to/:lang2', (req, res) => {

    try {

        let lang1 = req.params.lang1;
        let lang2 = req.params.lang2;
        let word = req.query.word;

        if (lang1 == undefined || lang2 == undefined || word == undefined) {
            res.status(500).send('');
        }

        //console.log("SELECT croatianid, slovenianid, slovenian.word from croatian JOIN translation ON croatian.id == translation.croatianid JOIN slovenian ON slovenian.id == translation.slovenianid");
        //console.log(`SELECT ${lang1}id, ${lang2}id, ${lang2}.word from ${lang1} JOIN translation ON ${lang1}.id == translation.${lang1}id JOIN ${lang2} ON ${lang2}.id == translation.${lang2}id`);

        result = JSON.parse(`{ "${lang1}": "${word}", "${lang2}": [] }`);

        console.log(result);

        db.each(`SELECT ${lang2}.word from ${lang1} 
                JOIN translation ON ${lang1}.id == translation.${lang1}id 
                JOIN ${lang2} ON ${lang2}.id == translation.${lang2}id 
                WHERE ${lang1}.word == '${word}'`
                , function (err, row) {
            
            if (err == null) {
                result[`${lang2}`].push(row.word);
            } else {
                throw err;
            }

        }, function (err) {
            if (err == null) {
                res.json(result);
            } else {


                throw err;
            }
        });

    } catch (ex) {
        console.log(ex);
        res.status(500).send('');

    }

});

app.post('/translate', (req, res) => {


    res.json(req.body)


});

app.put('/translate', (req, res) => {
    res.json(req.body)
});

app.delete('/translate', (req, res) => {
    res.js0on(req.body)
});

app.listen(port);

console.log('Magic happens on port ' + port);
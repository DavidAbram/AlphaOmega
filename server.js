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

app.get('/translate/:langFrom/to/:langTo', (req, res) => {

    try {

        let langFrom = req.params.langFrom;
        let langTo = req.params.langTo;
        let word = req.query.word;

        if (langFrom == undefined || langTo == undefined || word == undefined) {
            res.status(500).send('');
        }

        result = JSON.parse(`{ "${langFrom}": "${word}", "${langTo}": [] }`);

        db.each(`SELECT ${langTo}.word from ${langFrom} 
                JOIN translation ON ${langFrom}.id == translation.${langFrom}id 
                JOIN ${langTo} ON ${langTo}.id == translation.${langTo}id 
                WHERE ${langFrom}.word == '${word}'`
                , function (err, row) {
            
            if (err == null) {
                result[`${langTo}`].push(row.word);
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
    res.json(req.body)
});

app.listen(port);

console.log('Magic happens on port ' + port);
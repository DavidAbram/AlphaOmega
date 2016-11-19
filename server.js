var express = require('express')
var bodyParser = require('body-parser')
var morgan = require('morgan')

var translator = require('./translator')
var config = require('./config')

var app = express()
app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({ message: 'AΩ' })
});

app.get('/translate/:langFrom/to/:langTo', (req, res) => {

    try {

        let langFrom = req.params.langFrom
        let langTo = req.params.langTo
        let word = req.query.word

        if (!config.langs.includes(langFrom) || !config.langs.includes(langTo) || langFrom == undefined || langTo == undefined || word == undefined) {
            res.status(500).send('')
        } else {
            translator.translate(word, langFrom, langTo, (err, result) => {
                if (err == null) {
                    res.json(result)
                } else {
                    throw err
                }
            })
        }
    } catch (ex) {
        console.log(ex);
        res.status(500).send('')

    }

})

app.post('/translate', (req, res) => {

    let langFrom = req.body.langFrom
    let langTo = req.body.langTo
    let word = req.body.word
    let translation = req.body.translation

    if (!config.langs.includes(langFrom) || !config.langs.includes(langTo) || langFrom == undefined || langTo == undefined || word == undefined || translation == undefined) {
        res.status(500).send('')
    } else {
        res.json(req.body)
    }
})

app.delete('/translate', (req, res) => {
    res.json(req.body)
});

app.listen(port);

console.log('Magic happens on port ' + port);
const express = require('express');
const app = express();
const uuid  = require('uuid').v4;

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log('Server is running.');
});

/*  GET
    path: /api/quotes/random
*/
app.get('/api/quotes/random', (req, res) => {
    const quote = getRandomElement(quotes);
    res.status(200).send({quote: quote});
});


/*  GET
    paths:  /api/quotes
            or
            /api/quotes?person=${author}
*/
app.get('/api/quotes', (req, res, next) => {
    const author = req.query.person;
    const quoteArrayByAuthor = [];

    if (author){
        quotes.forEach((quote) => {
            if (quote.person === author){
                quoteArrayByAuthor.push(quote);
            }
        });

        if (quoteArrayByAuthor.length > 0){
            res.status(202).send({quotes: quoteArrayByAuthor});
        }
        else{
            res.send(quoteArrayByAuthor);
        }
    }
    else {
        res.status(200).send({quotes: quotes});
    }
});


/*  GET
    path: /api/quotes?quote=${quote}&person=${person}
*/
app.post('/api/quotes', (req, res) => {
    const { quote, person, year } = req.query;

    if (quote && person){
        const newQuote = {
            id: uuid(),
            quote: quote,
            person: person,
            year: year
        }

        quotes.push(newQuote);

        res.status(201).send({quote: newQuote});
    }
    else{
        res.status(400).send();
    }
});


/*  PUT
    path: /api/quotes?id=$(id)&person=$(person)&quote=$(quote)&year=$(year)
*/
app.put('/api/quotes', (req, res) => {
    const { id, person, quote, year } = req.query;
    let index = undefined;

    if (id, person, quote, year){
        index = quotes.findIndex(quote => {
            return quote.id === id;
        })

        if (index !== -1){
            quotes[index] = {
                id: id,
                person: person,
                quote: quote,
                year: year
            };

            res.send(200).send({
                id: id,
                person: person,
                quote: quote
            });
        }
    }
    else{
        res.status(404).send();
    }
});


/*  DELETE
    path: /api/quotes/:id
*/
app.delete('/api/quotes/:id', (req, res) => {
    const index = quotes.findIndex(quote => {
        return quote.id === req.params.id;
    })

    if (index !== -1){
        quotes.splice(index, 1);
        res.status(202).send();
    }
    else{
        res.status(404).send();
    }
});
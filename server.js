const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const fs = require('fs');

app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    return res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = (req.body);
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    notes.push(newNote)
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) =>
        err ? console.log(err) : console.log('db.json updated')
    )
    // return res.json(notes)
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
);

const express = require('express');
const path = require('path');
const app = express();
const { v4: uuidv4 } = require('uuid');
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
    newNote.id = uuidv4()
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    notes.push(newNote)
    fs.writeFile('db/db.json', JSON.stringify(notes, null, 4), (err) =>
        err ? console.log(err) : console.log('db.json updated')
    )
    res.json(newNote)
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    notes = notes.filter((note) => note.id !== id)

    fs.writeFile('db/db.json', JSON.stringify(notes, null, 4), (err) =>
        err ? console.log(err) : console.log('db.json updated')
    )
    console.log('Note deleted');
    res.json(notes)
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
);

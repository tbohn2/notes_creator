// Imports used packages
const express = require('express');
const path = require('path');
const app = express();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Port at available port or default to 3001
const PORT = process.env.PORT || 3001;

// Allows access to 'public' file
app.use(express.static('public'));
// Accepts incoming json from requests
app.use(express.json());

// Allows request to made from any origin (used when run from local files for development)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Sends notes.html file when a GET request is made at /notes
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html')));

// Returns JSON file containing the notes when GET request is made to /api/notes
app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    return res.json(notes);
});

// Adds a new note to the JSON file containing current notes
app.post('/api/notes', (req, res) => {
    const newNote = (req.body);
    // Creates a random id for the newNote
    newNote.id = uuidv4()
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    // Addes the newNote to the array in the JSON file
    notes.push(newNote)
    // Rewrites the JSON file with the updated array of notes
    fs.writeFile('db/db.json', JSON.stringify(notes, null, 4), (err) =>
        err ? console.log(err) : console.log('db.json updated')
    )
    res.json(newNote)
});

// Deletes a note with a specified id when a DELETE request is made
app.delete('/api/notes/:id', (req, res) => {
    // Defines id using the parameters of the request
    const id = req.params.id
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    // Filters array, removing the note that has an id matching the id specified in the fetch parameters
    notes = notes.filter((note) => note.id !== id)
    // Rewrites the JSON file with the updated array of notes
    fs.writeFile('db/db.json', JSON.stringify(notes, null, 4), (err) =>
        err ? console.log(err) : console.log('db.json updated')
    )
    console.log('Note deleted');
    res.json(notes)
});

// Creates a path for any requests that are not defined above and returns index.html 
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')));

// Server listens for requests
app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`)
);

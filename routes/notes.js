const notes = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


// GET request for notes
notes.get('/', (req, res) => {
    // Send a message to the client
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
          res.json(parsedNotes);  
        }
    });   

    // Log our request to the terminal
    console.info(`${req.method} request received to get notes`);
});

// POST request to add a note
notes.post('/', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new note
                parsedNotes.push(newNote);

                // Write updated notes back to the file
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 3),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

// DELETE request to delete a note
notes.delete('/:id', (req, res) => {
    // Log that a DELETE request was received
    console.info(`${req.method} request received to delete a note`);

    // Get the ID of the note to be deleted from the request parameters
    const noteId = req.params.id;

    // Read the existing notes from the JSON file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);

            // Find the index of the note to be deleted
            const noteIndex = parsedNotes.findIndex(note => note.id === noteId);

            if (noteIndex !== -1) {
                // Remove the note from the array
                parsedNotes.splice(noteIndex, 1);

                // Write updated notes back to the file
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 3),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully deleted note!')
                );

                const response = {
                    status: 'deleted',
                    body: noteIndex,
                };
                
                console.log(response);
                res.status(201).json(response);
            } else {
                res.status(404).json('Note not found');
            }
        }
    });
});



module.exports = notes;
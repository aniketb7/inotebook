const express = require('express')
const Note = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const router = express.Router()


//Route 1; get all notes . Login is required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    }
    catch (error) {
        res.status(500).send("Internal server error")
    }
})

// Router2 : Add a new note using post. Login is required
router.post('/addnote',
    fetchuser,
    [
        body('title', 'Enter a valid title').isLength(3),
        body('description', 'description must be of atleast 5 characters').isLength({ min: 5 }),
    ],
    async (req, res) => {

        try {
            const { title, description, tag } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // creating note object  new and .save() can be used as well
            const note = await Note.create({
                title,
                description,
                tag,
                user: req.user.id
            })
            res.json(note)

        }
        catch (error) {
            res.status(500).send("Internal server error")
        }
    })



// Route 3 : update an exisiting note. Login is required

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body
    try {
        // Create a new note object
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }
        console.log(newNote)

        /// find the note to be updated and find it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("not found")
        }

        console.log(note.user)
        console.log(req.user.id)
        // check if the user is allowed to update the current node
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })

        res.json(note)
    }

    catch (error) {
        res.status(500).send("Internal server error")
    }
})

// Route 4 : delete the given note by id. Login is required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        /// find the note to be deleted and find it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("not found")
        }

        // check if the user is allowed to update the current node
        if (note.user.toString() != req.user.id) {
            return res.status(401).send("Not allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id,)
        res.json({ "success": "Note has been deleted" })
    }
    catch (error) {
        res.status(500).send("Internal server error")
    }

})

module.exports = router

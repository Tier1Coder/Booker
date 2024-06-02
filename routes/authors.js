import Author from '../models/Author.js';
import express from 'express';


const router = express.Router();


router.get('/authors', async (req, res) => {
    try {
        const authors = await Author.find();
        res.render('authors', { authors: authors });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/authors/add', async (req, res) => {
    const author = new Author(req.body);
    try {
        await author.save();
        res.redirect('/authors');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/authors/edit/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).send("Nie znaleziono autora o podanym ID.");
        }
        res.render('edit_author', { author: author });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/authors/edit/:id', async (req, res) => {
    try {
        const author = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!author) {
            return res.status(404).send("Nie znaleziono autora o podanym ID.");
        }
        res.redirect('/authors');
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/authors/delete/:id', async (req, res) => {
    try {
        const author = await Author.findByIdAndDelete(req.params.id);
        if (!author) {
            return res.status(404).send("Nie znaleziono autora o podanym ID.");
        }
        res.redirect('/authors/');
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;

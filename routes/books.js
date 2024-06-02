import Book from '../models/Book.js';
import Author from '../models/Author.js';
import express from 'express';


const router = express.Router();

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find().populate('author');
        const authors = await Author.find();
        res.render('books', { books: books, authors: authors });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/books/add', async (req, res) => {
    const book = new Book(req.body);
    try {
        await book.save();
        res.redirect('/books');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/books/edit/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author');
        const authors = await Author.find();
        if (!book) {
            return res.status(404).send("Nie znaleziono książki o podanym ID.");
        }
        res.render('edit_book', { book: book, authors: authors });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/books/edit/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) {
            return res.status(404).send("Nie znaleziono książki o podanym ID.");
        }
        res.redirect('/books');
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/books/delete/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).send("Nie znaleziono książki o podanym ID.");
        }
        res.redirect('/books');
    } catch (error) {
        res.status(500).send(error);
    }
});


export default router;

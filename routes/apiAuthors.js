import Author from '../models/Author.js';
import express from 'express';
import Book from '../models/Book.js';  



const router = express.Router();


/**
 * @swagger
 * /api/authors:
 *   get:
 *     summary: Retrieve a list of authors
 *     description: Retrieve a list of all authors from the database.
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: A list of authors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */
router.get('/api/authors', async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/authors/{id}:
 *   get:
 *     summary: Retrieve a single author
 *     description: Retrieve a single author by ID from the database.
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the author to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single author.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 */
router.get('/api/authors/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (author) {
            res.json(author);
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Add a single author
 *     description: Add a single author to the database.
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       201:
 *         description: Successfully added a new author.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Error occurred
 */

router.post('/api/authors', async (req, res) => {
    const author = new Author(req.body);
    try {
        await author.save();
        res.status(201).json(author);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   put:
 *     summary: Update an author
 *     description: Update details of an existing author by ID.
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the author to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Author'
 *     responses:
 *       200:
 *         description: Author updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found.
 *       400:
 *         description: Invalid request data.
 */
router.put('/api/authors/:id', async (req, res) => {
    try {
        const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedAuthor) {
            res.json(updatedAuthor);
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     description: Remove an existing author by ID from the database.
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the author to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Author deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Author deleted successfully.
 *       404:
 *         description: Author not found.
 *       500:
 *         description: Server error.
 */

router.delete('/api/authors/:id', async (req, res) => {
    const authorId = req.params.id;
    const books = await Book.find({ author: authorId });
    if (books.length > 0) {
        return res.status(400).send('Cannot delete author with books assigned.');
    }

    try {
        const deletedAuthor = await Author.findByIdAndDelete(authorId);
        if (deletedAuthor) {
            res.json(deletedAuthor);
        } else {
            res.status(404).json({ message: 'Author not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
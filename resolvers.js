const Author = require('./models/Author.js');
const Book = require('./models/Book.js');

const resolvers = {
    Query: {
        // Returns all books
        books: async () => {
            return await Book.find().populate('author');
        },
        // Returns a single book found by ID
        book: async (_, { id }) => {
            return await Book.findById(id).populate('author');
        },
        // Returns all authors
        authors: async () => {
            return await Author.find();
        },
        // Returns a single author found by ID
        author: async (_, { id }) => {
            return await Author.findById(id);
        }
    },
    Mutation: {
        // Adds a book
        addBook: async (_, { title, authorId }) => {
            const newBook = new Book({ title, author: authorId });
            await newBook.save();
            return newBook.populate('author');
        },
        // Updates a book
        updateBook: async (_, { id, title, authorId }) => {
            const updatedBook = await Book.findByIdAndUpdate(id, { title, author: authorId }, { new: true });
            return updatedBook.populate('author');
        },
        // Deletes book
        deleteBook: async (_, { id }) => {
            return await Book.findByIdAndDelete(id);
        },
        // Adds a new author
        addAuthor: async (_, { name }) => {
            const newAuthor = new Author({ name });
            await newAuthor.save();
            return newAuthor;
        },
        // Updates an author
        updateAuthor: async (_, { id, name }) => {
            const updatedAuthor = await Author.findByIdAndUpdate(id, { name }, { new: true });
            return updatedAuthor;
        },
        // Deletes an author
        deleteAuthor: async (_, { id }) => {
            const books = await Book.find({ author: id });
            if (books.length > 0) {
              throw new Error("Cannot delete an author with books assigned.");
            }
            return await Author.findByIdAndDelete(id);
          }
    },
    Author: {
        // Returns author's books
        books: async (author) => {
            return await Book.find({ author: author._id });
        }
    },
    Book: {
        // Returns author of a book
        author: async (book) => {
            return await Author.findById(book.author);
        }
    }
};

module.exports = resolvers;

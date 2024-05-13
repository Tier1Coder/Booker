const Author = require('./models/Author');
const Book = require('./models/Book');

const resolvers = {
    Query: {
        // Pobieranie wszystkich książek
        books: async () => {
            return await Book.find().populate('author');
        },
        // Pobieranie pojedynczej książki po ID
        book: async (_, { id }) => {
            return await Book.findById(id).populate('author');
        },
        // Pobieranie wszystkich autorów
        authors: async () => {
            return await Author.find();
        },
        // Pobieranie pojedynczego autora po ID
        author: async (_, { id }) => {
            return await Author.findById(id);
        }
    },
    Mutation: {
        // Dodawanie książki
        addBook: async (_, { title, authorId }) => {
            const newBook = new Book({ title, author: authorId });
            await newBook.save();
            return newBook.populate('author');
        },
        // Aktualizacja książki
        updateBook: async (_, { id, title, authorId }) => {
            const updatedBook = await Book.findByIdAndUpdate(id, { title, author: authorId }, { new: true });
            return updatedBook.populate('author');
        },
        // Usuwanie książki
        deleteBook: async (_, { id }) => {
            return await Book.findByIdAndDelete(id);
        },
        // Dodawanie autora
        addAuthor: async (_, { name }) => {
            const newAuthor = new Author({ name });
            await newAuthor.save();
            return newAuthor;
        },
        // Aktualizacja autora
        updateAuthor: async (_, { id, name }) => {
            const updatedAuthor = await Author.findByIdAndUpdate(id, { name }, { new: true });
            return updatedAuthor;
        },
        // Usuwanie autora
        deleteAuthor: async (_, { id }) => {
            return await Author.findByIdAndDelete(id);
        }
    },
    Author: {
        // Zwracanie książek danego autora
        books: async (author) => {
            return await Book.find({ author: author._id });
        }
    },
    Book: {
        // Zwracanie autora danej książki
        author: async (book) => {
            return await Author.findById(book.author);
        }
    }
};

module.exports = resolvers;

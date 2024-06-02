/*

Prerequisites:
1) Install Node.js and npm
2) Install MongoDB
3) Run MongoDB on: localhost:27017
4) Install required modules: npm install



To run this application, in terminal, write: npm start.

*/


import express from 'express';
import mongoose from 'mongoose';

// GraphQL
import { ApolloServer } from 'apollo-server-express';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';

// Swagger
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// local
import swaggerOptions from './swaggerConfig.js';
import resolvers from './resolvers.js';
import booksRouter from './routes/books.js';
import authorsRouter from './routes/authors.js';
import apiBooksRouter from './routes/apiBooks.js';
import apiAuthorsRouter from './routes/apiAuthors.js';


const swaggerSpec = swaggerJsdoc(swaggerOptions);


const schema = loadSchemaSync('./schema.graphql', { loaders: [new GraphQLFileLoader()] });
const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});

const app = express();

app.set('view engine', 'ejs');

const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json())

const server = new ApolloServer({ schema: schemaWithResolvers });

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });
}

startServer();


// Trasa główna
app.get('/', (req, res) => {
    res.render('index');
});


app.use('/', booksRouter);
app.use('/', authorsRouter);
app.use('/', apiBooksRouter);
app.use('/', apiAuthorsRouter);



// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/bookerDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
}).catch(err => console.log(err));


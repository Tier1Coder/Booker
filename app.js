import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { addResolversToSchema } from '@graphql-tools/schema';
import resolvers from './resolvers';
import booksRouter from './routes/books';
import authorsRouter from './routes/authors';
import apiBooksRouter from './routes/apiBooks';
import apiAuthorsRouter from './routes/apiAuthors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerOptions from './swaggerConfig';

const swaggerSpec = swaggerJsdoc(swaggerOptions);


const schema = loadSchemaSync('./schema.graphql', { loaders: [new GraphQLFileLoader()] });
const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers
});

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


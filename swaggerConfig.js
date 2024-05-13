const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple API to manage authors and books',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
        schemas: {
            Author: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: {
                      type: 'string',
                      description: 'Name of the author',
                    },
                    books: {
                        type: 'array',
                        items: {
                            type: 'string',
                            description: 'List of books of an author'
                        }
                    }
                }
            },
            Book: {
              type: 'object',
              required: ['title', 'author'],
              properties: {
                title: {
                  type: 'string',
                  description: 'Title of the book'
                },
                author: {
                  type: 'string',
                  description: 'Author of the book'
                }
              }
            }
        }
    }
  };
  
  const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
  };
  
  export default options;
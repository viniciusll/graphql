const { ApolloServer, gql } = require('apollo-server');
const Movie = require('./models/movie.model');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

async function main() {
    const typeDefs = gql`
        type Movie {
            title: String
            description: String
            image: String
            year: Int
        }

        type Query {
            movies: [Movie],
        }

        type Mutation {
            createMovie(title: String!, year: Int!, image: String!, description: String!): Movie!
        }
    `;

    const resolvers = {
        Query: {
            movies: async () => await Movie.find()
        },
        Mutation: {
            createMovie: async (title, year, image, description) => [{ title, year, image, description }]
        }
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
        plugins: [
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],
    });

    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
};

(async () => {
  await main();
})()
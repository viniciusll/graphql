const { ApolloServer, gql } = require('apollo-server');
const Movie = require('./models/movie.model');
const {
  ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

async function main() {
    const typeDefs = gql`
        type Movie {
            id: ID
            title: String
            description: String
            image: String
            year: Int
        }

        type Query {
            movies: [Movie],
            getMoviesByName(title: String!): [Movie],
            getMoviesByYear(year: Int!): [Movie],
            getMoviesByYearRange(startYear: Int!, endYear: Int!): [Movie]
        }

        type Mutation {
            createMovie(title: String!, year: Int!, image: String!, description: String!): Movie!,
            updateMovie(id: ID!, title: String, year: Int, image: String, description: String): Movie!,
            deleteMovie(id: ID!): Movie!,
        }
    `;

    const resolvers = {
        Query: {
            movies: async () => await Movie.find(),
            async getMoviesByName(_, { title }) {
                const movies = await Movie.find({ title: { $regex: '.*' + title + '.*' } });

                return movies.map(movie => ({ ...movie._doc, id: movie._id.toJSON() })) ?? [];
            },
            async getMoviesByYear(_, { year }) {
                const movies = await Movie.find({ year });

                return movies.map(movie => ({ ...movie._doc, id: movie._id.toJSON() })) ?? [];
            },
            async getMoviesByYearRange(_, { startYear, endYear }) {
                const movies = await Movie.find({ year: { $gte: startYear, $lte: endYear } });

                return movies.map(movie => ({ ...movie._doc, id: movie._id.toJSON() })) ?? [];
            }
        },
        Mutation: {
            async createMovie(_, { title, year, image, description }) {
                const movie = await Movie.create({ title, year, image, description });
                return {
                    id: movie._id.toJSON(),
                    title: movie.title,
                    description: movie.description,
                    image: movie.image,
                    year: movie.year
                }
            },
            async updateMovie(_, { id, title, year, image, description }) {
                const movie = await Movie.findById(id);

                movie.title = title ?? movie.title;
                movie.year = year ?? movie.year;
                movie.image = image ?? movie.image;
                movie.description = description ?? movie.description;
                await movie.save();

                return {
                    id: movie._id.toJSON(),
                    title: movie.title,
                    description: movie.description,
                    image: movie.image,
                    year: movie.year
                }
            },
            async deleteMovie(_, { id }) {
                const movie = await Movie.findByIdAndDelete(id);
                return {
                    id: movie._id.toJSON(),
                    title: movie.title,
                    description: movie.description,
                    image: movie.image,
                    year: movie.year
                }
            }
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
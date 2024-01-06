import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { context, MyContext } from './context.js'
import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  range,
  stringLength,
  pattern,
  ValidateDirectiveVisitor,
  applyDirectivesToSchema,
} from "@profusion/apollo-validation-directives";
import { ref } from './_db.js';
import * as commands from './commands.js';
import { resolvers } from './resolvers.js';

const schema = applyDirectivesToSchema(
    [range],
    makeExecutableSchema({
      typeDefs: [
        typeDefs,
        ...ValidateDirectiveVisitor.getMissingCommonTypeDefs(),
        ...range.getTypeDefs(),
        ...stringLength.getTypeDefs(),
        ...pattern.getTypeDefs()
      ],
      resolvers,
    })
  );


const server = new ApolloServer<MyContext>({
    schema
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context 
});


console.log(`Server ready at ${url}`);

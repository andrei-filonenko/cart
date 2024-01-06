import { GraphQLError } from "graphql";

export const makeValidationError = (msg: string) => {
  return new GraphQLError(msg, {
    extensions: {
      code: "BAD_USER_INPUT",
      http: {
        status: 400,
      },
    },
  });
};

export const makeConflictError = (msg: string) => {
  return new GraphQLError(msg, {
    extensions: {
      code: "CONFLICT",
      http: {
        status: 409,
      },
    },
  });
};

export const missingError = (msg: string) => {
  return new GraphQLError(msg, {
    extensions: {
      code: "NOT_FOUND",
      http: {
        status: 404,
      },
    },
  });
};


import gql from "graphql-tag";

export const typeDefs = gql`
  type Product {
    displayName: String! @stringLength(min: 3, max: 30)
    sku: String! @pattern(regexp: "^[a-z0-9]{10,20}$", flags: "i")
    amount: Int!
    unitPrice: Int! @range(min: 0, max: 1000)
    selected: Boolean
  }

  type Cart {
    products: [Product]
    discountPercentage: Int!
  }

  type Query {
    cart: Cart
    catalog: [Product]
    promcode: Int
    discountPercentage: Int
  }

  type PromcodeResponse {
    promcode: String
    discountPercentage: Int
  }

  type Mutation {
    updatePromcode(code: String): PromcodeResponse
    addProducts(skus: [String]): [Product]
    removeProducts(skus: [String]): [Product]
    incrementAmount(sku: String, incrementBy: Int): Product
    checkout: [Product]
    clearCart: [Product]
  }

`;

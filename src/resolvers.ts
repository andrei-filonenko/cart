import { MyContext } from "./context.js";
import { IncrementSpec, Product } from "./_db.js";

export const resolvers = {
  Query: {
    catalog: (_: any, __: any, { data }: MyContext) => data().catalog,
    cart: (_: any, __: any, { data }: MyContext) => data().cart,
    promcode: (_: any, __: any, { data }: MyContext) => data().promcode,
  },
  Mutation: {
    updatePromcode: (_: any, args: { 'code': string }, { commands }: MyContext) =>
      commands.updatePromcode(args.code),
    addProducts: (_: any, { skus }: { 'skus': string[] }, { commands }: MyContext) =>
      commands.addProducts(skus),
    removeProducts: (_: any, { skus }: { 'skus': string[] }, { commands }: MyContext) =>
      commands.removeProducts(skus),
    incrementAmount: (_: any, params: IncrementSpec, { commands }: MyContext) =>
      commands.incrementAmount(params),
    checkout: (_: any, params: IncrementSpec, { commands }: MyContext) =>
      commands.checkout(),
    clearCart: (_: any, params: IncrementSpec, { commands }: MyContext) =>
      commands.clearCart(),
  },
};
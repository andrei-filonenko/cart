import { ref, EventType, State, runCommand, IncrementSpec } from "./_db.js";
import { makeValidationError, missingError } from "./util.js";

export function addProducts(skus: string[]) {
  return runCommand(EventType.AddProducts, skus).snapshot.cart.products;
}

export function removeProducts(skus: string[]) {
  return runCommand(EventType.RemoveProducts, skus).snapshot.cart.products;
}

export function updatePromcode(code: string) {
  const {
    promcode,
    cart: { discountPercentage },
  } = runCommand(EventType.UpdatePromcode, code).snapshot;
  return { promcode, discountPercentage };
}

export function incrementAmount({ sku, incrementBy }: IncrementSpec) {
  // schema validation can't check post-conditions
  // so checkng here
  const product = ref().snapshot.cart.products.find((x) => (x.sku === sku));
  if (!product) {
    throw missingError(`Product with SKU ${sku} not found`);
  }
  const newValue = product.amount + incrementBy;
  if (newValue < 0 || newValue > 1000) {
    throw makeValidationError(
      `for product with SKU ${sku} the value ${newValue} is out of range`
    );
  }
  // if we decrement to 0, we remove an item from a card
  if (newValue === 0) {
    return removeProducts([sku]);
  }
  runCommand(EventType.ChangeProduct, {...product, amount: newValue });
  return product;
}

export function checkout() {
  const prevProducts = ref().snapshot.cart.products;
  runCommand(EventType.Checkout, {});
  return prevProducts;
}

export function clearCart() {
  const prevProducts = ref().snapshot.cart.products;
  runCommand(EventType.ClearCart , {});
  return prevProducts;
}

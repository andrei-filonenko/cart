import { produce } from "immer";
import { products } from "./_mock_data.js";

export enum EventType {
  UpdatePromcode = "UpdatePromcode",
  AddProducts = "AddOrRemoveProducts",
  RemoveProducts = "RemoveProducts",
  ChangeProduct = "ChangeProduct",
  ClearCart = "ClearCart",
  Checkout = "Checkout",
}

export type Event<Payload> = {
  eventType: EventType;
  timestamp: string;
  payload: Payload;
};

export type Product = {
  displayName: string;
  sku: string;
  amount: number;
  unitPrice: number;
  retract?: boolean;
  selected: boolean
};


export type Cart = {
  complete: boolean;
  products: Product[];
  discountPercentage: Number;
};

export type IncrementSpec = {
    sku: string,
    incrementBy: number
}

type UpdatePromcode = Event<string>;
type AddProducts = Event<Product[]>;
type RemoveProducts = Event<Product[]>;
type ChangeProduct = Event<Product>
type ClearCart = Event<{}>;
type Checkout = Event<{}>;

type Action =
  | UpdatePromcode
  | AddProducts
  | RemoveProducts
  | ChangeProduct
  | ClearCart
  | Checkout

type Snapshot = {
  promcode?: string;
  catalog: Product[];
  cart: Cart;
};

export type WriteAheadLog = Action[];

export type State = {
  writeAheadLog: WriteAheadLog;
  snapshot: Snapshot;
};

export const initialState: State = {
  writeAheadLog: [],
  snapshot: {
    catalog: products.map(p => ({...p, selected: false})),
    cart: {
      complete: false,
      products: [] as Product[],
      discountPercentage: 15,
    },
  },
};

export const ref = (() => {
  let state = initialState;
  return (newVal?: State) => {
    if (newVal) {
        state = newVal;
        return newVal
    }
    return state;
  }
})()


function setSelected(state: State, sku: string, val: boolean) {
    const index = state.snapshot.catalog.findIndex(
      p => p.sku === sku
    );
    const p = state.snapshot.catalog[index];
    p.selected = val;
    state.snapshot.catalog[index] = p;
}

const reducerMap = {
  // random
  [EventType.UpdatePromcode]: (s: State, event: Action) => {
    s.snapshot.cart.discountPercentage = Math.floor(Math.random() * 6) + 15;
    s.snapshot.promcode = (event as UpdatePromcode).payload;
    return s;
  },
  // idempotent
  [EventType.AddProducts]: (s: State, event: Action) => {
    const delta = ((event.payload as string[]) || []).filter((sku) =>
      !s.snapshot.cart.products.some((x) => x.sku === sku)
    );
    delta.forEach(sku => setSelected(s, sku, true))
    const p = s.snapshot.catalog.filter(c => delta.includes(c.sku));
    s.snapshot.cart.products = s.snapshot.cart.products.concat(p);
    return s;
  },
  // idempotent
  [EventType.RemoveProducts]: (s: State, event: Action) => {
    // intersection of items to delete and items in a cart
    const skus = (event.payload as string[]) || [];
    s.snapshot.cart.products = s.snapshot.cart.products.filter(
      x => !skus.includes(x.sku)
    )
    return s;
  },
  [EventType.ClearCart]: (s: State, _: Action) => {
    s.snapshot.cart.products = [];
    return s;
  },
  [EventType.Checkout]: (s: State, _: Action) => {
    s.snapshot.cart.products = [];
    s.snapshot.cart.complete = true;
    return s;
  },
  [EventType.ChangeProduct]: (s: State, event: Action) => {
    const p = (event.payload as Product)
    const index = s.snapshot.cart.products.findIndex(
      ({ sku }) => sku === p.sku
    );
    s.snapshot.cart.products[index] = p
    return s;
  },
};


export function nextState<T>(event: Event<T>) {
  ref(produce<State>(ref(), (draft) => {
    draft.writeAheadLog.push(event as Action);
    return reducerMap[event.eventType](draft, event as Action);
  }));
  return ref();
}

export function runCommand<T>(eventType: EventType, payload: T) {
  return nextState({
    eventType,
    payload: payload,
    timestamp: new Date().toUTCString(),
  });
}


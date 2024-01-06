## A GraphQL API for a service

`yarn`
`yarn startserver`

Visit `localhost:4000` to interact with server.

Example queries:

```GraphQL
query Data {
  cart {
    products {
      displayName
      amount
      sku
    }
    discountPercentage
  }
  catalog {
    displayName
    selected
    sku
  }
}

mutation UpdatePromcode($code: String!) {
  updatePromcode(code: $code) {
    promcode
  }
}

mutation AddProducts($skus: [String]) {
  addProducts(skus: $skus) {
    sku,
    displayName
  }
}

mutation IncrementAmount($sku: String, $incrementBy: Int) {
  incrementAmount(sku: $sku, incrementBy: $incrementBy) {
    sku,
    displayName,
    amount
  }
}

mutation RemoveProducts($skus: [String]) {
  removeProducts(skus: $skus) {
    sku,
    displayName
  }
}

mutation Checkout {
   checkout {
     displayName
     sku
     unitPrice
     amount
   }
}

mutation ClearCart {
   clearCart {
     displayName
     sku
     unitPrice
     amount
   }
}
```

Example Test Data:


```json
{
   "skus":[
      "FP-23456",
   ],
   "sku": "FP-23456",
   "code": "3jffj",
   "incrementBy": 10
}
```

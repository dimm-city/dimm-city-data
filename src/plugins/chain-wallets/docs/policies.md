# Chain Wallet Policies

## Token Exists

This policy ensures that the token specified in the route has been minted.

```javascript
{
    method: "GET",
    path: "/metadata/:contract/:tokenId",
    handler: "chain-metadata.getTokenMetadata",
    config: {
        policies: ["token-exists"],
    },
},
```

## Owns Token

This policy ensures that the current user owns the token specified in the route.

# Lifecycle

There are several hooks that exist to allow for better integration between token data and entity data. This is can be done by adding functions to your entity service or configuring model lifecycle hooks depending on your needs.

## Service Functions

### initializeEntity

```javascript

 async initializeEntity(token){
    console.log('initializing entity from token...');
  },

  ```

### extendTokenMetadata

```javascript
  async extendTokenMetadata(token, entity) {
    if (!entity) {
      let entity = await super.find({
        filters: {
          token: {
            id: token.id,
          },
        },
      });

      if (entity?.results.length > 0) {
        entity = entity.results.at(0);
      }
    }
    token = mergeMetadata(token, entity);
    return token;
  },

```

## Model Lifecycle

### beforeCreate

If you would like to leverage token metadata when an entity is being created, you can simply use the built in lifecycle hooks of Strapi. This allows you to import token metadata as default entity field values. The following code sets the eyes field to the metadata value from a token when the entity is created:

```javascript
module.exports = {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    
    //Example of how to do something with the associated token before creating the entity
    const svc = strapi.service("plugin::chain-wallets.chain-token");

    if (data.token.connect.length > 0) {
      const token = await svc.findOne(data.token.connect[0]?.id);

      data.eyes = token.metadata.attributes.find(
        (v) => v.trait_type == "Eyes"
      ).value;
    }
  },
};
```



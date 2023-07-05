'use strict';
const faction = require('./faction/schema.json');
const world = require('./world/schema.json');
module.exports = {

"faction": {
  schema: faction,
},
"world": {
    schema: world,
  }
};

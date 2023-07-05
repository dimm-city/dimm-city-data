'use strict';
const faction = require('./faction/schema.json');
const world = require('./world/schema.json');
const race = require('./race/schema.json');
module.exports = {

"faction": {
  schema: faction,
},
"race": {
    schema: race,
  },
"world": {
    schema: world,
  }
};

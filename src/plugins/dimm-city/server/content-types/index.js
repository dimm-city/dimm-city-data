'use strict';
const faction = require('./faction/schema.json');
const world = require('./world/schema.json');
const race = require('./race/schema.json');
const location = require('./location/schema.json');

module.exports = {

"faction": {
  schema: faction,
},
"location": {
    schema: location,
},
"race": {
    schema: race,
  },
"world": {
    schema: world,
  }
};

const archives = require("./archives");
const stats = require("./stats");
const ability = require("./ability");
const character = require("./character");
const characterRelease = require("./character-release");
const faction = require("./faction");
const historicalEvent = require("./historical-event");
const item = require("./item");
const journalEntry = require("./journal-entry");
const location = require("./location");
const payment = require("./payment");
const profile = require("./profile");
const race = require("./race");
const skillTree = require("./skill-tree");
const specialty = require("./specialty");
const spore = require("./spore");
const story = require("./story");
const world = require("./world");
const galleryItem = require("./gallery-item");

module.exports = {
  stats,
  archives,
  ability,
  character,
  "character-release": characterRelease,
  cybernetic: require("./cybernetic"),
  faction,
  "gallery-item": galleryItem,
  "historical-event": historicalEvent,
  item,
  "journal-entry": journalEntry,
  location,
  page: require("./page"),
  payment,
  profile,
  race,
  script: require("./script"),
  "skill-tree": skillTree,
  specialty,
  spore,
  story,
  term: require("./term"),
  world,
};

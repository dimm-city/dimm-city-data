const archive = require("./archive");
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
const race = require("./race");
const skillTree = require("./skill-tree");
const specialty = require("./specialty");
const spore = require("./spore");
const story = require("./story");
const world = require("./world");
const page = require("./page");
const profile = require("./profile");
const galleryItem = require("./gallery-item");
const terms = require("./term");
const cybernetic = require("./cybernetic");
const script = require("./script");

module.exports = {
  "content-api": {
    type: "content-api",
    routes: [
      ...ability,
      ...character,
      ...characterRelease,
      ...cybernetic,
      ...faction,
      ...galleryItem,
      ...historicalEvent,
      ...item,
      ...journalEntry,
      ...location,
      ...page,
      ...payment,
      ...profile,
      ...race,
      ...skillTree,
      ...specialty,
      ...spore,
      ...story,
      ...world,
      ...archive,
      ...terms,
      ...script,
      ...stats,
    ],
  },
};

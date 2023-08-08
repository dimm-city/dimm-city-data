const ability = require("./ability");
const character = require("./character/character");
const dcs1r1Contract = require("./character/dcs1r1-contract");
const dcs1r1 = require("./character/dcs1r1");
const dcs2r1 = require("./character/dcs2r1");
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

module.exports = {
  ability,
  character,
  "dcs1r1-contract": dcs1r1Contract,
  dcs1r1,
  dcs2r1,
  "character-release": characterRelease,
  faction,
  "historical-event": historicalEvent,
  "gallery-item": require("./gallery-item"),
  item,
  "journal-entry": journalEntry,
  location,
  payment,
  profile,
  race,
  "skill-tree": skillTree,
  specialty,
  spore,
  story,
  world,
};

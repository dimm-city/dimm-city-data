"use strict";
const availableTypes = [
  { key: "location", value: "api::location.location" },
  { key: "specialty", value: "api::specialty.specialty" },
  { key: "journalEntry", value: "api::journal-entry.journal-entry" },
  { key: "citizen", value: "api::character.character" },
  { key: "item", value: "api::item.item" },
];
const { version } = require("../../package.json");

module.exports = {
  // GET /stats
  getStats: async (ctx) => {
    const contentTypes = [
      "api::character.character",
      "api::location.location",
      "api::specialty.specialty",
      "api::journal-entry.journal-entry",
      "api::item.item",
    ]; 

    const result = {version};
    for (let contentType of contentTypes) {
      const repository = strapi.query(contentType);
      if (!repository) {
        console.error(`Invalid content type: ${contentType}`);
        continue;
      }
      const count = await repository.count();
      result[contentType.split(".").at(-1)] = count;
    }

    ctx.send(result);
  },
};

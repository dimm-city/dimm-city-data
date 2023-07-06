"use strict";
const availableTypes = [
  { key: "location", value: "plugin::dimm-city.location" },
  { key: "specialty", value: "plugin::dimm-city.specialty" },
  { key: "journalEntry", value: "plugin::dimm-city.journal-entry" },
  { key: "citizen", value: "plugin::dimm-city.character" },
  { key: "item", value: "plugin::dimm-city.item" },
];
const { version } = require("../../package.json");

module.exports = {
  // GET /stats
  getStats: async (ctx) => {
    const contentTypes = [
      "plugin::dimm-city.character",
      "plugin::dimm-city.location",
      "plugin::dimm-city.specialty",
      "plugin::dimm-city.journal-entry",
      "plugin::dimm-city.item",
    ]; 

    const result = {version};
    for (let contentType of contentTypes) {
      const entities = await strapi.entityService.findMany(contentType, {
        fields: ['id'], 
        publicationState: 'live',
      });
      if (!entities) {
        console.error(`Invalid content type: ${contentType}`);
        continue;
      }
      const count = await entities.length;
      result[contentType.split(".").at(-1)] = count;
    }

    ctx.send(result);
  },
};

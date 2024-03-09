/**
 * Module dependencies
 */
const { sanitizeEntity } = require("@strapi/utils");
const { sanitize } = require("@strapi/utils");
const { contentAPI } = sanitize;

const availableTypes = [
  { key: "location", value: "plugin::dimm-city.location" },
  { key: "specialty", value: "plugin::dimm-city.specialty" },
  { key: "journalEntry", value: "plugin::dimm-city.journal-entry" },
  { key: "citizen", value: "plugin::dimm-city.character" },
  { key: "item", value: "plugin::dimm-city.item" },
  { key: "page", value: "plugin::dimm-city.page" },
  { key: "race", value: "plugin::dimm-city.race" },
  { key: "ability", value: "plugin::dimm-city.ability" },
];

// Parsing strategies
const strategies = {
  citizen: (entity) => {
    return {
      id: entity.id,
      type: "citizen",
      name: entity.name || "",
      description: entity.description || entity.backstory || "",
    };
  },
};

/**
 * Parse and sanitize an entity.
 *
 * @param {Object} entity - The entity to parse.
 * @param {string} type - The type of the entity.
 * @param {Object} strategies - The parsing strategies.
 *
 * @return {Object} The parsed and sanitized entity.
 */
function parseEntity(entity, type, auth) {
  let parsedEntity;

  // If a strategy is provided for the entity's type, use it
  if (strategies[type.key]) {
    parsedEntity = strategies[type.key](entity);
  } else {
    // Default implementation
    parsedEntity = {
      id: entity.id,
      type: type.key,
      name: entity.name || "",
      description: entity.description || "",
    };
  }

  return parsedEntity;
  return contentAPI.output(parsedEntity, strapi.contentType(type.value)); //, { model: strapi.models[type.value] });
}

/**
 * Public Archives control interface
 */

module.exports = {
  async getItemTypes() {
    return availableTypes;
  },
  /**
   * Search multiple content types.
   *
   * @param {Object} ctx - The request context.
   *
   * @return {Array} An array of items.
   */
  async search(ctx) {
    const params = ctx.request.body;
    // Get the list of types to search from the request
    let requestedTypes = params.types;

    // Filter out any types that are not available
    let typesToSearch = availableTypes.filter((type) =>
      requestedTypes.includes(type.key)
    );
    if (typesToSearch.length === 0) typesToSearch = availableTypes;

    // Query parameter
    const query = params.query;

    const { page = 1, pageSize = 10 } = params.pagination ?? {
      page: 1,
      pageSize: 10,
    };
    const start = (page - 1) * pageSize;

    // Initialize results array
    let results = [];

    // Loop through each type and perform the search
    for (const type of typesToSearch) {
      try {
        const service = strapi.services[type.value];
        if (!service) {
          continue;
        }

        const entities = await strapi.entityService.findMany(type.value, {
          filters: {
            $or: [
              { name: { $containsi: query } },
              { description: { $containsi: query } }],
          },
          sort: ["name"],
          start: start,
          limit: pageSize,
        });

        // Loop through each entity and add it to the results
        for (const entity of entities) {
          const parsedEntity = parseEntity(entity, type, ctx.state.auth);
          results.push(parsedEntity);
        }
      } catch (error) {
        console.log(error);
        strapi.log.error(
          `Error searching in type ${type.key}: ${error.message}`
        );
      }
    }

    // Sort the results by type and then by name
    // results.sort(
    //   (a, b) => a.type?.localeCompare(b.type) || a.name.localeCompare(b.name)
    // );

    return results;
  },
};

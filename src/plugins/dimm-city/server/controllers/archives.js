/**
 * Module dependencies
 */
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

// Table and column mappings for natural language search
const searchConfigurations = [
  {
    key: "character",
    tableName: "dc_characters",
    searchableColumns: ["name", "backstory"], // These should have FULLTEXT indexes
    resultColumns: [
      "id",
      "token_id as slug",
      "'character' as type",
      "name",
      "backstory as description",
    ],
  },
  {
    key: "item",
    tableName: "dc_items",
    searchableColumns: ["name", "description", "tags", "short_description"],
    resultColumns: ["id", "slug", "'item' as type", "name", "description"],
  },
  {
    key: "location",
    tableName: "dc_locations",
    searchableColumns: ["name", "description", "tags", "short_description"],
    resultColumns: ["id", "slug", "'location' as type", "name", "description"],
  },
  {
    key: "race",
    tableName: "dc_races",
    searchableColumns: ["name", "description", "tags", "short_description"],
    resultColumns: ["id", "slug", "'race' as type", "name", "description"],
  },
  {
    key: "specialty",
    tableName: "dc_specialties",
    searchableColumns: ["name", "description", "tags", "short_description"],
    resultColumns: ["id", "slug", "'specialty' as type", "name", "description"],
  },
  {
    key: "journalEntry",
    tableName: "dc_journal_entries",
    searchableColumns: ["name", "description", "tags", "short_description"],
    resultColumns: [
      "id",
      "slug",
      "'journalEntry' as type",
      "name",
      "description",
    ],
  },
  {
    key: "page",
    tableName: "dc_pages",
    searchableColumns: ["title", "description", "tags", "content"],
    resultColumns: ["id", "slug", "'page' as type", "title as name", "content as description"],
  },
  {
    key: "ability",
    tableName: "dc_abilities",
    searchableColumns: ["name", "description", "short_description"],
    resultColumns: ["id", "slug", "'ability' as type", "name", "description"],
  },
];



/**
 * Public Archives control interface
 */

module.exports = {
  async getItemTypes() {
    return searchConfigurations.map((config) => config.key);
  },
  /**
   * Search multiple content types.
   *
   * @param {Object} ctx - The request context.
   *
   * @return {Array} An array of items.
   */
  async search(ctx) {
    try {
      const params = ctx.request.body;
      // Get the list of types to search from the request
      let requestedTypes = params.types || [];

      let typesToSearch = searchConfigurations;

      // Filter out any types that are not available
      if (requestedTypes.length > 0) {
        typesToSearch = searchConfigurations.filter((type) =>
          requestedTypes.includes(type.key)
        );
      }

      // Query parameter
      const query = params.query;

      const { page = 1, pageSize = 10 } = params.pagination ?? {
        page: 1,
        pageSize: 10,
      };

      const start = (page - 1) * pageSize;

      // Building individual FULLTEXT search queries
      const queries = typesToSearch.map((config) => {
        const matchColumns = config.searchableColumns.join(", ");
        const selectColumns = config.resultColumns.join(", ");
        return `SELECT ${selectColumns} FROM ${config.tableName} `
        + `WHERE published_at IS NOT NULL AND MATCH(${matchColumns}) AGAINST(? IN NATURAL LANGUAGE MODE)`;
      });

      // Combining queries with UNION
      const finalQuery = queries.join(" UNION ");

      // Execute the queries, be sure to pass the queries as an array of strings
      const results = await strapi.db.connection.raw(finalQuery,
        Array.from({length: typesToSearch.length}).map(() => query));

      return results?.at(0).slice(start, start + pageSize);

    } catch (error) {
      console.log(error);
      strapi.log.error(`Error searching archives: ${error.message}`);
    }
  },
};

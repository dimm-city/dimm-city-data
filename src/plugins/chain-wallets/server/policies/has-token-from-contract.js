module.exports = async (policyContext, config, { strapi }) => {
  // Check if a session is open
  if (policyContext.state.user) {
    // Get the user's id
    const userId = policyContext.state.user.id;

    // Get the entity name and the id of the entity record from the API parameters
    const entityName = policyContext.request.route.controller;
    const entityId = policyContext.params.id;

    // Query the entity table for the record with the given id
    const entity = await strapi.query(entityName).findOne({ id: entityId });

    // Get the value of the policy_string field
    const contractSlug = entity.policy_string;

    // Query the wallets, tokens, and contracts tables in a single operation
    const wallets = await strapi.query("wallet").find({
      "user.id": userId,
      "tokens.contract.slug": contractSlug,
    });

    // If a wallet is found that satisfies the conditions, allow the request to proceed
    if (wallets.length > 0) {
      return true;
    }
  }

  // If no session is open, or the user doesn't have a wallet with a token belonging to a contract with a slug equal to "test", block the request
  return false;
};

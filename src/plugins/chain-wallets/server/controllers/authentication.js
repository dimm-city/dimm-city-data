const { TYPE_AUTHENTICATION } = require("../consts");

module.exports = {
  async login(ctx) {
    const { network, signature, address } = ctx.request.body;

    const data = strapi.services[TYPE_AUTHENTICATION].login(
      network,
      signature,
      address
    );

    if (data.error) {
      ctx.unauthorized(data.error);
    }
    return data;
  },
  getVerificationMessage() {
    return strapi.services[TYPE_AUTHENTICATION].getVerificationMessage();
  },
};

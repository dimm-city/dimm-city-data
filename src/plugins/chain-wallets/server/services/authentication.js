const { TYPE_WALLET } = require("../consts");

const { sanitize } = require("@strapi/utils");

function getVerificationMessage() {
  return (
    strapi.plugin("chain-wallets").config("verificationMessage") ??
    "Sign this message to login"
  );
}
async function login(network, signature, address) {
  const walletSvc = strapi.service(TYPE_WALLET);

  const signer = walletSvc.getSigner(getVerificationMessage(), signature);

  if (!signer || signer !== address) {
    throw new Error("Invalid signature");
  }

  const wallet = await walletSvc.getOrCreateWallet(network, address);

  if (!wallet.user) {
    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });
    const settings = await pluginStore.get({ key: "advanced" });
    if (!settings.allow_register) {
      ctx.send({
        success: false,
        error: "Register action is currently disabled",
      });
      return;
    }
    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: settings.default_role } });

    const data = {
      username: address,
      email: `${address}@chain-wallets.strapi.io`,
      confirmed: true,
      blocked: false,
      role: role.id,
    };
    const newUser = await strapi
      .query("plugin::users-permissions.user")
      .create({
        data,
      });


    await walletSvc.attachUserWallet(wallet, newUser);
    wallet.user = newUser;
  }

  const { jwt: jwtService } = strapi.plugins["users-permissions"].services;
  const userSchema = strapi.getModel("plugin::users-permissions.user");
  const sanitizedUserInfo = await sanitize.sanitizers.defaultSanitizeOutput(
    userSchema,
    wallet.user
  );

  return {
    jwt: jwtService.issue({ id: wallet.user.id }),
    user: sanitizedUserInfo,
  };
}
module.exports = {
  login,
  getVerificationMessage,
};

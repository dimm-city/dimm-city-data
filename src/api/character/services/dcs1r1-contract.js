module.exports = {
  async mintToken(contract, toAddress) {
    const contractSvc = strapi.service("plugin::chain-wallets.chain-contract");
    const smartContract = await contractSvc.getSmartContract(
      contract,
      contract.admin
    );

    const tx = await smartContract.buyPack(toAddress, 1, true);
    // Wait for the transaction to be confirmed
    const receipt = await tx.wait();

    return receipt;
  },
};

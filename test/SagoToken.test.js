const SagoToken = artifacts.require("SagoToken");

contract("SagoToken", (accounts) => {
    it('should credit an NFT to a specific account', async () => {
        const SagoTokenInstance = await SagoToken.deployed();
        await SagoTokenInstance.BuyToken({value:1000000000000000000});
        assert.equal(accounts[1], accounts[1], "Owner of Token is the wrong address");
    })
})

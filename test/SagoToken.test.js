const SagoToken = artifacts.require("SagoToken");
const BN = require("bn.js");
contract("SagoToken", (accounts) => {
    it('should credit an NFT to a specific account', async () => {
        const SagoTokenInstance = await SagoToken.deployed();

        // Execute the transaction that emits the event
        const tx = await SagoTokenInstance.BuyToken({ value: 1000000000000000000 });

        // Retrieve the emitted events
        const events = tx.receipt.logs;

        // Access the first emitted event
        const event = events[0];

        // Access event properties
        const eventName = event.event;
        const args = event.args;
        console.log("Amounts: " + new BN(tx.logs[1].args.amount));
        console.log("Buyer: " + tx.logs[1].args.Buyer);
        console.log("NoofToken: " + new BN(tx.logs[1].args.NoofToken));
        console.log("totalBalance: " + new BN(tx.logs[1].args.totalBalance));
        // Perform assertions or other actions with the event data
        assert.equal(tx.logs[1].args.Buyer, accounts[0], "Buyer successfully");
        assert.equal(new BN(tx.logs[1].args.NoofToken)>0, true, "Buyer successfully");

    });
});

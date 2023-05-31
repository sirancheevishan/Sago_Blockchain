const SagoToken = artifacts.require("SagoToken");
const BN = require("bn.js");
const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

contract("SagoToken", (accounts) => {
    // Buy 
    it('Token Bought successfully', async () => {
        const SagoTokenInstance = await SagoToken.deployed();
        const tx = await SagoTokenInstance.BuyToken({ from: accounts[0], value: 1000000000000000000 });
        console.log("Amounts: " + new BN(tx.logs[1].args.amount));
        console.log("Buyer: " + tx.logs[1].args.Buyer);
        console.log("NoofToken: " + new BN(tx.logs[1].args.NoofToken));
        console.log("totalBalance: " + new BN(tx.logs[1].args.totalBalance));
        // Perform assertions or other actions with the event data
        assert.equal(new BN(tx.logs[1].args.NoofToken)>0, true, "Token Bought successfully");

    });

    //Check the balance
    it('Should view balance', async () => {
        const SagoTokenInstance = await SagoToken.deployed();

        // Execute the transaction that emits the event
        const tx = await SagoTokenInstance.getWalletBalance();

        console.log("Amounts: " + new BN(tx));
        assert.equal(new BN(tx)>0, true, "Token Bought successfully");

    });

    //Sell Token
    it('should sell tokens ', async () => {
        const SagoTokenInstance = await SagoToken.deployed();

        const tokenToSell = 1; // Adjust the value as needed
        
        await SagoTokenInstance.BuyToken({ from: accounts[0], value: 1000000000000000000 });
        const tx = await SagoTokenInstance.SellToken(tokenToSell, { from:accounts[0]});
        console.log("********************From amount transfer********************")
        console.log(tx);
        assert.equal(tx.receipt.status, true, "Token Bought successfully");

    });

    //Transfer tokens
    it('should transfer the tokens to someone address ', async () => {
        const SagoTokenInstance = await SagoToken.deployed();
        const tokenToSell = 1; // Adjust the value as needed
        await SagoTokenInstance.BuyToken({ from: accounts[0], value: 1000000000000000000 });
        const tx = await SagoTokenInstance.TranferToken(accounts[1],tokenToSell, { from:accounts[0]});
        assert.equal(tx.receipt.status, true, "Token transferred successfully");

    });
});

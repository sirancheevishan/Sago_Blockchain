const SagoToken = artifacts.require("SagoToken");

module.exports = function(deployer) {
    deployer.deploy(SagoToken);
} 
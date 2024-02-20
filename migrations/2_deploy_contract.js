var myContract = artifacts.require("DAO");

module.exports = function(deployer){
  deployer.deploy(myContract);
}
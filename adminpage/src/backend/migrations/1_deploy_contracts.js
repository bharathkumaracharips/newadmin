const FacultyRegistry = artifacts.require("FacultyRegistry");

module.exports = function (deployer) {
  deployer.deploy(FacultyRegistry);
};

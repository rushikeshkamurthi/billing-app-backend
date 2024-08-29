const { authJwt } = require("../middleware");
const controller = require("../controllers/account.controller");

module.exports = function (app) {
  app.post(
    "/api/accounts",
    [authJwt.verifyToken, authJwt.isAdmin], // only admins can create accounts
    controller.createAccount
  );
  app.get(
    "/api/accounts",
    [authJwt.verifyToken, authJwt.isAdmin], // Only admins can view all accounts
    controller.getAllAccounts
  );
  app.get(
    "/api/accounts/:id",
    [authJwt.verifyToken, authJwt.checkAccountOwnership],
    controller.getAccount
  );

  app.put(
    "/api/accounts/:id",
    [authJwt.verifyToken, authJwt.checkAccountOwnership],
    controller.updateAccount
  );

  app.delete(
    "/api/accounts/:id",
    [
      authJwt.verifyToken,
      authJwt.isExternalAdmin,
      authJwt.checkAccountOwnership,
    ],
    controller.deleteAccount
  );
};

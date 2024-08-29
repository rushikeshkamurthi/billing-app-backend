const { authJwt } = require("../middleware");
const controller = require("../controllers/shop.controller");

module.exports = function (app) {
  app.post(
    "/api/shops",
    [
      authJwt.verifyToken,
      authJwt.isExternalAdmin,
      authJwt.checkAccountOwnership,
    ],
    controller.createShop
  );

  app.get(
    "/api/shops/:id",
    [authJwt.verifyToken, authJwt.checkShopOwnership],
    controller.getShop
  );

  app.put(
    "/api/shops/:id",
    [authJwt.verifyToken, authJwt.checkShopOwnership],
    controller.updateShop
  );

  app.delete(
    "/api/shops/:id",
    [authJwt.verifyToken, authJwt.isExternalAdmin, authJwt.checkShopOwnership],
    controller.deleteShop
  );
};

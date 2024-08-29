const { authJwt } = require("../middleware");
const controller = require("../controllers/product.controller");

module.exports = function (app) {
  app.post(
    "/api/products",
    [authJwt.verifyToken, authJwt.isExternalAdmin, authJwt.checkShopOwnership],
    controller.createProduct
  );
  app.get(
    "/api/products",
    [authJwt.verifyToken, authJwt.isExternalAdmin, authJwt.checkShopOwnership],
    controller.getAllProduct
  );
  app.get(
    "/api/products/:id",
    [authJwt.verifyToken, authJwt.checkShopOwnership],
    controller.getProduct
  );

  app.put(
    "/api/products/:id",
    [authJwt.verifyToken, authJwt.checkShopOwnership],
    controller.updateProduct
  );

  app.delete(
    "/api/products/:id",
    [authJwt.verifyToken, authJwt.isExternalAdmin, authJwt.checkShopOwnership],
    controller.deleteProduct
  );
};

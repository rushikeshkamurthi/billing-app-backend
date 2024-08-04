const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // User CRUD routes
  app.post(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createUser
  );
  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAllUsers
  );
  app.get(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findOneUser
  );
  app.put(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateUser
  );
  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );
  app.delete(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteAllUsers
  );
};

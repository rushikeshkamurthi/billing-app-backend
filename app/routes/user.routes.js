/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for a user
 *           example: 1
 *         username:
 *           type: string
 *           description: The user's username
 *           example: "john_doe"
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: "john_doe@example.com"
 *         accountId:
 *           type: integer
 *           description: The account ID to which the user belongs
 *           example: 123
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: Roles assigned to the user
 *           example: ["admin", "user"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created
 *           example: "2024-12-15T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was last updated
 *           example: "2024-12-15T12:00:00Z"
 *       required:
 *         - username
 *         - email
 *         - accountId
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   name: Users
 *   description: User management and administration
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * @swagger
   * /api/test/all:
   *   get:
   *     summary: Public access endpoint
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Public content
   */
  app.get("/api/test/all", controller.allAccess);

  /**
   * @swagger
   * /api/test/user:
   *   get:
   *     summary: Access endpoint for logged-in users
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User content
   */
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  /**
   * @swagger
   * /api/test/mod:
   *   get:
   *     summary: Access endpoint for moderators
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Moderator content
   */
  app.get("/api/test/mod", [authJwt.verifyToken], controller.moderatorBoard);

  /**
   * @swagger
   * /api/test/admin:
   *   get:
   *     summary: Access endpoint for admins
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Admin content
   */
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  /**
   * @swagger
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               accountId:
   *                 type: integer
   *     responses:
   *       201:
   *         description: User created successfully
   */
  app.post(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    authController.signup
  );

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Retrieve all users
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   */
  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findAllUsers
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Retrieve a user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the user to retrieve
   *     responses:
   *       200:
   *         description: User details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   */
  app.get(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.findOneUser
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update a user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the user to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: User updated successfully
   */
  app.put(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateUser
  );

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the user to delete
   *     responses:
   *       200:
   *         description: User deleted successfully
   */
  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );

  /**
   * @swagger
   * /api/users:
   *   delete:
   *     summary: Delete all users
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: All users deleted successfully
   */
  app.delete(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteAllUsers
  );
};

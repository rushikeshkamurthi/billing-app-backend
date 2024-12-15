/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related operations
 */

const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

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
   * /api/auth/signup:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 description: The username of the new user
   *               email:
   *                 type: string
   *                 description: The email of the new user
   *               password:
   *                 type: string
   *                 description: The password of the new user
   *               accountId:
   *                 type: integer
   *                 description: The account ID associated with the user
   *               role:
   *                 type: string
   *                 description: The role to assign to the user (optional)
   *     responses:
   *       200:
   *         description: User successfully registered
   *       400:
   *         description: Bad request, validation failed
   *       500:
   *         description: Server error
   */

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  /**
   * @swagger
   * /api/auth/signin:
   *   post:
   *     summary: Sign in an existing user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 description: The username of the user trying to sign in
   *               password:
   *                 type: string
   *                 description: The password of the user trying to sign in
   *     responses:
   *       200:
   *         description: Successfully signed in, returns access token and refresh token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   description: User ID
   *                 username:
   *                   type: string
   *                   description: Username of the user
   *                 email:
   *                   type: string
   *                   description: Email of the user
   *                 roles:
   *                   type: array
   *                   items:
   *                     type: string
   *                   description: Roles assigned to the user
   *                 accessToken:
   *                   type: string
   *                   description: JWT access token
   *                 refreshToken:
   *                   type: string
   *                   description: Refresh token
   *       400:
   *         description: Invalid credentials
   *       404:
   *         description: User not found
   *       500:
   *         description: Server error
   */

  app.post("/api/auth/signin", controller.signin);

  /**
   * @swagger
   * /api/auth/refreshtoken:
   *   post:
   *     summary: Refresh the JWT access token using the refresh token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *                 description: The refresh token to use for generating a new access token
   *     responses:
   *       200:
   *         description: Successfully refreshed the access token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                   description: New access token
   *                 refreshToken:
   *                   type: string
   *                   description: Same refresh token
   *       400:
   *         description: Refresh token missing or invalid
   *       403:
   *         description: Refresh token expired or invalid
   *       500:
   *         description: Server error
   */
  app.post("/api/auth/refreshtoken", controller.refreshToken);
};

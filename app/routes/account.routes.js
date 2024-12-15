/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: API for managing accounts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The account ID
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the account
 *           example: "My Account"
 *       required:
 *         - name
 */

const { authJwt } = require("../middleware");
const controller = require("../controllers/account.controller");

module.exports = function (app) {
  /**
   * @swagger
   * /api/accounts:
   *   post:
   *     summary: Create a new account
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Account'
   *     responses:
   *       201:
   *         description: Account created successfully
   *       400:
   *         description: Invalid request
   */
  app.post(
    "/api/accounts",
    [authJwt.verifyToken, authJwt.isAdmin], // only admins can create accounts
    controller.createAccount
  );

  /**
   * @swagger
   * /api/accounts:
   *   get:
   *     summary: Retrieve all accounts
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: A list of accounts
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Account'
   */
  app.get(
    "/api/accounts",
    [authJwt.verifyToken, authJwt.isAdmin], // Only admins can view all accounts
    controller.getAllAccounts
  );

  /**
   * @swagger
   * /api/accounts/{id}:
   *   get:
   *     summary: Retrieve a single account by ID
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The account ID
   *     responses:
   *       200:
   *         description: Account details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Account'
   *       404:
   *         description: Account not found
   */
  app.get(
    "/api/accounts/:id",
    [authJwt.verifyToken, authJwt.checkAccountOwnership],
    controller.getAccount
  );

  /**
   * @swagger
   * /api/accounts/{id}:
   *   put:
   *     summary: Update an account by ID
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The account ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Account'
   *     responses:
   *       200:
   *         description: Account updated successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Account not found
   */
  app.put(
    "/api/accounts/:id",
    [authJwt.verifyToken, authJwt.checkAccountOwnership],
    controller.updateAccount
  );

  /**
   * @swagger
   * /api/accounts/{id}:
   *   delete:
   *     summary: Delete an account by ID
   *     tags: [Accounts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The account ID
   *     responses:
   *       200:
   *         description: Account deleted successfully
   *       404:
   *         description: Account not found
   */
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

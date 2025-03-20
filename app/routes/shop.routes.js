/**
 * @swagger
 * tags:
 *   name: Shops
 *   description: API for managing shops
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Shop:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The shop ID
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the shop
 *           example: "My Shop"
 *         accountId:
 *           type: integer
 *           description: The ID of the account the shop belongs to
 *           example: 1
 *       required:
 *         - name
 *         - accountId
 */
const { authJwt } = require("../middleware");
const controller = require("../controllers/shop.controller");

module.exports = function (app) {
  /**
   * @swagger
   * /api/shops:
   *   post:
   *     summary: Create a new shop
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - accountId
   *             properties:
   *               name:
   *                 type: string
   *                 description: The name of the shop
   *               accountId:
   *                 type: integer
   *                 description: The ID of the account the shop belongs to
   *     responses:
   *       201:
   *         description: Shop created successfully
   *       400:
   *         description: Invalid request
   */
  app.post(
    "/api/shops",
    [
      authJwt.verifyToken,
      authJwt.isExternalAdmin,
      authJwt.checkAccountOwnership,
    ],
    controller.createShop
  );

  /**
   * @swagger
   * /api/shops/{id}:
   *   get:
   *     summary: Retrieve a shop by ID
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The shop ID
   *     responses:
   *       200:
   *         description: Shop details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                 name:
   *                   type: string
   *                 accountId:
   *                   type: integer
   *       404:
   *         description: Shop not found
   */
  app.get(
    "/api/shops/:id",
    [authJwt.verifyToken, authJwt.checkShopOwnership],
    controller.getShop
  );

  /**
   * @swagger
   * /api/shops/{id}:
   *   put:
   *     summary: Update a shop by ID
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The shop ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The updated name of the shop
   *               accountId:
   *                 type: integer
   *                 description: The updated account ID the shop belongs to
   *     responses:
   *       200:
   *         description: Shop updated successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Shop not found
   */
  app.put(
    "/api/shops/:id",
    [authJwt.verifyToken, authJwt.checkShopOwnership],
    controller.updateShop
  );

  /**
   * @swagger
   * /api/shops/{id}/soft-delete:
   *   patch:
   *     summary: Soft delete a shop by ID
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The shop ID
   *     responses:
   *       200:
   *         description: Shop soft deleted successfully
   *       404:
   *         description: Shop not found
   */
  app.patch(
    "/api/shops/:id/soft-delete",
    [authJwt.verifyToken, authJwt.isExternalAdmin, authJwt.checkShopOwnership],
    controller.softDeleteShop
  );

  /**
   * @swagger
   * /api/shops:
   *   get:
   *     summary: Retrieve all shops
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: accountId
   *         schema:
   *           type: integer
   *         description: Filter by account ID
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Number of records per page
   *     responses:
   *       200:
   *         description: A list of shops
   */
  app.get("/api/shops", [authJwt.verifyToken], controller.getAllShops);

  /**
   * @swagger
   * /api/accounts/{accountId}/shops:
   *   get:
   *     summary: Retrieve all shops under a specific account
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: accountId
   *         schema:
   *           type: integer
   *         required: true
   *         description: The account ID
   *     responses:
   *       200:
   *         description: A list of shops under the account
   */
  app.get(
    "/api/accounts/:accountId/shops",
    [authJwt.verifyToken, authJwt.checkAccountOwnership],
    controller.getShopsByAccount
  );

  /**
   * @swagger
   * /api/shops/{id}/restore:
   *   patch:
   *     summary: Restore a soft deleted shop by ID
   *     tags: [Shops]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: The shop ID
   *     responses:
   *       200:
   *         description: Shop restored successfully
   *       404:
   *         description: Shop not found
   */
  app.patch(
    "/api/shops/:id/restore",
    [authJwt.verifyToken, authJwt.isExternalAdmin, authJwt.checkShopOwnership],
    controller.restoreShop
  );
};

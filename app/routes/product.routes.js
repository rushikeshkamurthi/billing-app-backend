const { authJwt } = require("../middleware");
const controller = require("../controllers/product.controller");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - subcategory
 *         - type
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: The product's unique identifier
 *           example: 1
 *         name:
 *           type: string
 *           description: The name of the product
 *           example: "Product Name"
 *         category:
 *           type: string
 *           description: The category of the product
 *           example: "Electronics"
 *         subcategory:
 *           type: string
 *           description: The subcategory of the product
 *           example: "Mobile Phones"
 *         type:
 *           type: string
 *           description: The type of the product
 *           example: "Smartphone"
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the product
 *           example: 299.99
 *         shopId:
 *           type: integer
 *           description: The ID of the shop the product belongs to
 *           example: 1
 */
module.exports = function (app) {
  /**
   * @swagger
   * /api/products:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       201:
   *         description: Product created successfully
   *       400:
   *         description: Invalid request
   */
  app.post(
    "/api/products",
    [authJwt.verifyToken, authJwt.isExternalAdmin, authJwt.checkShopOwnership],
    controller.createProduct
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     summary: Retrieve a single product by ID
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The product ID
   *     responses:
   *       200:
   *         description: Product details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       404:
   *         description: Product not found
   */
  app.get(
    "/api/products/:id",
    [authJwt.verifyToken, authJwt.checkShopOwnership],
    controller.getProduct
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     summary: Update a product by ID
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The product ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Product updated successfully
   *       400:
   *         description: Invalid request
   *       404:
   *         description: Product not found
   */
  app.put(
    "/api/products/:id",
    [authJwt.verifyToken, authJwt.checkShopOwnership],
    controller.updateProduct
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Delete a product by ID
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The product ID
   *     responses:
   *       200:
   *         description: Product deleted successfully
   *       404:
   *         description: Product not found
   */
  app.delete(
    "/api/products/:id",
    [authJwt.verifyToken, authJwt.isExternalAdmin, authJwt.checkShopOwnership],
    controller.deleteProduct
  );
};

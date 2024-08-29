const db = require("../models");
const Product = db.product;

exports.createProduct = (req, res) => {
  Product.create({
    name: req.body.name,
    category: req.body.category,
    subcategory: req.body.subcategory,
    type: req.body.type,
    price: req.body.price,
    shopId: req.body.shopId,
  })
    .then((product) => {
      res.status(201).send(product);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getProduct = (req, res) => {
  const productId = req.params.id;

  Product.findByPk(productId)
    .then((product) => {
      if (!product) {
        return res.status(404).send({ message: "Product Not Found" });
      }
      res.status(200).send(product);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateProduct = (req, res) => {
  const productId = req.params.id;

  Product.update(req.body, {
    where: { id: productId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Product was updated successfully." });
      } else {
        res.send({
          message: `Cannot update Product with id=${productId}. Maybe Product was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating Product with id=" + productId });
    });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  Product.destroy({
    where: { id: productId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Product was deleted successfully!" });
      } else {
        res.send({
          message: `Cannot delete Product with id=${productId}. Maybe Product was not found!`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not delete Product with id=" + productId });
    });
};

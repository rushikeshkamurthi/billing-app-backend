const db = require("../models");
const Shop = db.shop;

exports.createShop = (req, res) => {
  Shop.create({
    name: req.body.name,
    accountId: req.body.accountId,
  })
    .then((shop) => {
      res.status(201).send(shop);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getShop = (req, res) => {
  const shopId = req.params.id;

  Shop.findByPk(shopId)
    .then((shop) => {
      if (!shop) {
        return res.status(404).send({ message: "Shop Not Found" });
      }
      res.status(200).send(shop);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateShop = (req, res) => {
  const shopId = req.params.id;

  Shop.update(req.body, {
    where: { id: shopId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Shop was updated successfully." });
      } else {
        res.send({
          message: `Cannot update Shop with id=${shopId}. Maybe Shop was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating Shop with id=" + shopId });
    });
};

exports.deleteShop = (req, res) => {
  const shopId = req.params.id;

  Shop.destroy({
    where: { id: shopId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Shop was deleted successfully!" });
      } else {
        res.send({
          message: `Cannot delete Shop with id=${shopId}. Maybe Shop was not found!`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not delete Shop with id=" + shopId });
    });
};

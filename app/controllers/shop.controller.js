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
  console.log("shopId", shopId);

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

exports.getShopsByAccount = (req, res) => {
  const accountId = req.params.accountId;

  Shop.findAll({ where: { accountId } })
    .then((shops) => res.status(200).send(shops))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.softDeleteShop = (req, res) => {
  const shopId = req.params.id;

  Shop.update({ isDeleted: true }, { where: { id: shopId } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Shop was soft deleted successfully!" });
      } else {
        res.send({
          message: `Cannot soft delete Shop with id=${shopId}. Maybe Shop was not found!`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not soft delete Shop with id=" + shopId });
    });
};

exports.restoreShop = (req, res) => {
  const shopId = req.params.id;

  Shop.update({ isDeleted: false }, { where: { id: shopId } })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Shop was restored successfully!" });
      } else {
        res.send({
          message: `Cannot restore Shop with id=${shopId}. Maybe it was not found!`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not restore Shop with id=" + shopId });
    });
};

exports.getAllShops = (req, res) => {
  const { accountId, page = 1, limit = 10 } = req.query;
  let whereClause = {};

  if (accountId) {
    whereClause.accountId = accountId;
  }

  Shop.findAndCountAll({
    where: whereClause,
    limit: parseInt(limit),
    offset: (page - 1) * limit,
  })
    .then((result) => {
      res.status(200).send({
        total: result.count,
        shops: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

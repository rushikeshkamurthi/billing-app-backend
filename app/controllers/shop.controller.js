const db = require("../models");
const Shop = db.shop;
const User = db.user;

exports.createShop = (req, res) => {
  console.log("Creating shop with data:", req.body);

  Shop.create({
    name: req.body.name,
    accountId: req.body.accountId,
  })
    .then((shop) => {
      console.log("Shop created successfully:", shop);
      res.status(201).send(shop);
    })
    .catch((err) => {
      console.error("Error creating shop:", err);
      res.status(500).send({ message: err.message });
    });
};

exports.getShop = (req, res) => {
  const shopId = req.params.id;
  console.log("Fetching shop with ID:", shopId);

  Shop.findByPk(shopId)
    .then((shop) => {
      if (!shop) {
        console.log(`Shop with ID ${shopId} not found.`);
        return res.status(404).send({ message: "Shop Not Found" });
      }
      console.log("Shop fetched successfully:", shop);
      res.status(200).send(shop);
    })
    .catch((err) => {
      console.error("Error fetching shop:", err);
      res.status(500).send({ message: err.message });
    });
};

exports.updateShop = (req, res) => {
  const shopId = req.params.id;
  console.log("Updating shop with ID:", shopId, "Data:", req.body);

  Shop.update(req.body, { where: { id: shopId } })
    .then((num) => {
      if (num == 1) {
        console.log("Shop updated successfully:", shopId);
        res.send({ message: "Shop was updated successfully." });
      } else {
        console.log(
          `Cannot update Shop with ID ${shopId}. Maybe it was not found or request body is empty.`
        );
        res.send({
          message: `Cannot update Shop with ID=${shopId}. Maybe Shop was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      console.error("Error updating shop:", err);
      res
        .status(500)
        .send({ message: "Error updating Shop with ID=" + shopId });
    });
};

exports.deleteShop = (req, res) => {
  const shopId = req.params.id;
  console.log("Deleting shop with ID:", shopId);

  Shop.destroy({ where: { id: shopId } })
    .then((num) => {
      if (num == 1) {
        console.log("Shop deleted successfully:", shopId);
        res.send({ message: "Shop was deleted successfully!" });
      } else {
        console.log(
          `Cannot delete Shop with ID ${shopId}. Maybe it was not found.`
        );
        res.send({
          message: `Cannot delete Shop with ID=${shopId}. Maybe Shop was not found!`,
        });
      }
    })
    .catch((err) => {
      console.error("Error deleting shop:", err);
      res
        .status(500)
        .send({ message: "Could not delete Shop with ID=" + shopId });
    });
};

exports.getShopsByAccount = (req, res) => {
  const accountId = req.params.accountId;
  console.log("Fetching shops for account ID:", accountId);

  Shop.findAll({ where: { accountId } })
    .then((shops) => {
      console.log(`Found ${shops.length} shops for account ID ${accountId}`);
      res.status(200).send(shops);
    })
    .catch((err) => {
      console.error("Error fetching shops by account ID:", err);
      res.status(500).send({ message: err.message });
    });
};

exports.softDeleteShop = (req, res) => {
  const shopId = req.params.id;
  console.log("Soft deleting shop with ID:", shopId);

  Shop.update({ isDeleted: true }, { where: { id: shopId } })
    .then((num) => {
      if (num == 1) {
        console.log("Shop soft deleted successfully:", shopId);
        res.send({ message: "Shop was soft deleted successfully!" });
      } else {
        console.log(
          `Cannot soft delete Shop with ID ${shopId}. Maybe it was not found.`
        );
        res.send({
          message: `Cannot soft delete Shop with ID=${shopId}. Maybe Shop was not found!`,
        });
      }
    })
    .catch((err) => {
      console.error("Error soft deleting shop:", err);
      res
        .status(500)
        .send({ message: "Could not soft delete Shop with ID=" + shopId });
    });
};

exports.restoreShop = (req, res) => {
  const shopId = req.params.id;
  console.log("Restoring shop with ID:", shopId);

  Shop.update({ isDeleted: false }, { where: { id: shopId } })
    .then((num) => {
      if (num == 1) {
        console.log("Shop restored successfully:", shopId);
        res.send({ message: "Shop was restored successfully!" });
      } else {
        console.log(
          `Cannot restore Shop with ID ${shopId}. Maybe it was not found.`
        );
        res.send({
          message: `Cannot restore Shop with ID=${shopId}. Maybe it was not found!`,
        });
      }
    })
    .catch((err) => {
      console.error("Error restoring shop:", err);
      res
        .status(500)
        .send({ message: "Could not restore Shop with ID=" + shopId });
    });
};

exports.getAllShops = async (req, res) => {
  try {
    console.log("getAllShops req.userId", req.userId);

    // Fetch the user's accountId from the database
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const { page = 1, limit = 10 } = req.query;

    console.log("Fetching all shops for account:", user.accountId);

    const result = await Shop.findAndCountAll({
      where: { accountId: user.accountId, isDeleted: false }, // Only fetch shops linked to the user's account
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    console.log(
      `Total shops found: ${result.count}, Returning ${result.rows.length} shops`
    );

    res.status(200).send({
      total: result.count,
      shops: result.rows,
    });
  } catch (err) {
    console.error("Error fetching shops:", err);
    res.status(500).send({ message: err.message });
  }
};

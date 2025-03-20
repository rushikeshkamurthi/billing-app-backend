const db = require("../models");
const Account = db.account;
const User = db.user;

exports.createAccount = (req, res) => {
  Account.create({
    name: req.body.name,
  })
    .then((account) => {
      res.status(201).send(account);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAllAccounts = (req, res) => {
  Account.findAll({
    include: [
      {
        model: db.shop,
        as: "shops",
        where: { isDeleted: false }, // Exclude soft-deleted shops
        required: false, // Ensures accounts without shops are still returned
      },
      "users",
    ],
  })
    .then((accounts) => {
      res.status(200).send(accounts);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.getAccount = (req, res) => {
  const accountId = req.params.id;

  Account.findByPk(accountId, {
    include: [
      {
        model: db.shop,
        as: "shops",
        where: { isDeleted: false },
        required: false,
      },
    ],
  })
    .then((account) => {
      if (!account) {
        return res.status(404).send({ message: "Account Not Found" });
      }
      res.status(200).send(account);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateAccount = (req, res) => {
  const accountId = req.params.id;

  Account.update(req.body, {
    where: { id: accountId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Account was updated successfully." });
      } else {
        res.send({
          message: `Cannot update Account with id=${accountId}. Maybe Account was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error updating Account with id=" + accountId });
    });
};

exports.deleteAccount = (req, res) => {
  const accountId = req.params.id;

  Account.destroy({
    where: { id: accountId },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Account was deleted successfully!" });
      } else {
        res.send({
          message: `Cannot delete Account with id=${accountId}. Maybe Account was not found!`,
        });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Could not delete Account with id=" + accountId });
    });
};

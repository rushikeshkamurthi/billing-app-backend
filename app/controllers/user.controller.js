const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");

// Helper function to fetch user roles
const getUserRoles = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: Role,
        as: "roles",
        attributes: ["name"],
        through: { attributes: [] },
      },
    ],
  });

  return user ? user.roles.map((role) => role.name) : [];
};

// Create and Save a new User
exports.createUser = async (req, res) => {
  try {
    console.log("req.body", req.body);

    // Get the authenticated user's details along with roles
    const requestingUser = await User.findByPk(req.userId);
    if (!requestingUser) {
      return res.status(403).send({ message: "Unauthorized user." });
    }

    const userRoles = await getUserRoles(req.userId);
    const isAdmin = userRoles.includes("external_admin");

    if (!isAdmin) {
      return res
        .status(403)
        .send({ message: "Forbidden: Admin access required." });
    }

    // Ensure the user is creating accounts only under their own account
    if (requestingUser.accountId !== req.body.accountId) {
      return res
        .status(403)
        .send({ message: "Cannot create users outside your account." });
    }

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      accountId: req.body.accountId,
    });

    if (req.body.roleIds && req.body.roleIds.length > 0) {
      const roles = await Role.findAll({ where: { id: req.body.roleIds } });
      await user.setRoles(roles);
    }

    res.status(201).send({ message: "User created successfully!", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res
      .status(500)
      .send({ message: "Some error occurred while creating the User." });
  }
};

// Retrieve all Users from the database.
exports.findAllUsers = async (req, res) => {
  try {
    const requestingUser = await User.findByPk(req.userId);
    if (!requestingUser) {
      return res.status(403).send({ message: "Unauthorized user." });
    }

    const users = await User.findAll({
      where: { accountId: requestingUser.accountId },
      include: [
        {
          model: Role,
          as: "roles",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    res.send(users);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving users." });
  }
};

// Find a single User with an id
exports.findOneUser = async (req, res) => {
  const id = req.params.id;

  try {
    const requestingUser = await User.findByPk(req.userId);
    const targetUser = await User.findByPk(id);

    if (!requestingUser || !targetUser) {
      return res.status(404).send({ message: "User not found." });
    }

    if (requestingUser.accountId !== targetUser.accountId) {
      return res
        .status(403)
        .send({ message: "Forbidden: You do not have access to this user." });
    }

    res.send(targetUser);
  } catch (err) {
    res.status(500).send({ message: "Error retrieving User." });
  }
};

// Update a User by the id in the request
exports.updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const requestingUser = await User.findByPk(req.userId);
    const targetUser = await User.findByPk(id);

    if (!requestingUser || !targetUser) {
      return res.status(404).send({ message: "User not found." });
    }

    const userRoles = await getUserRoles(req.userId);
    const isAdmin = userRoles.includes("external_admin");

    if (!isAdmin || requestingUser.accountId !== targetUser.accountId) {
      return res
        .status(403)
        .send({ message: "Forbidden: Admin access required." });
    }

    await User.update(req.body, { where: { id } });

    res.send({ message: "User was updated successfully." });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send({ message: "Error updating User." });
  }
};

// Delete a User with the specified id in the request
exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const requestingUser = await User.findByPk(req.userId);
    const targetUser = await User.findByPk(id);

    if (!requestingUser || !targetUser) {
      return res.status(404).send({ message: "User not found." });
    }

    const userRoles = await getUserRoles(req.userId);
    const isAdmin = userRoles.includes("external_admin");

    if (!isAdmin || requestingUser.accountId !== targetUser.accountId) {
      return res
        .status(403)
        .send({ message: "Forbidden: Admin access required." });
    }

    await User.destroy({ where: { id } });

    res.send({ message: "User was deleted successfully!" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send({ message: "Could not delete User." });
  }
};

// Delete all Users from the database.
exports.deleteAllUsers = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

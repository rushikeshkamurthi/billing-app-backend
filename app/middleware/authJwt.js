const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Shop = db.shop;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin" || roles[i].name === "internal_admin") {
            req.isAdmin = true; // Mark the user as an admin
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require Admin Role!" });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

isExternalAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (
            roles[i].name === "external_admin" ||
            roles[i].name === "admin" ||
            roles[i].name === "internal_admin"
          ) {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require External Admin Role!" });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

isExternalSubAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "external_sub_admin") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require External Sub Admin Role!" });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

isExternalUser = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "external_user") {
            next();
            return;
          }
        }
        res.status(403).send({ message: "Require External User Role!" });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Allow Admins to bypass ownership checks
checkAccountOwnership = (req, res, next) => {
  console.log("Entering checkAccountOwnership middleware");

  User.findByPk(req.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return user.getRoles().then((roles) => {
        const isAdmin = roles.some(
          (role) => role.name === "admin" || role.name === "internal_admin"
        );

        if (isAdmin) {
          console.log("Admin detected, bypassing account ownership check.");
          return next();
        }

        const resourceAccountId = req.body.accountId || req.params.id;
        if (user.accountId != resourceAccountId) {
          return res.status(403).send({
            message: "Access Denied: Not within your account hierarchy!",
          });
        }

        next();
      });
    })
    .catch((err) => {
      console.error("Error fetching user:", err.message);
      res.status(500).send({ message: err.message });
    });
};

// Allow Admins to bypass shop ownership checks
checkShopOwnership = (req, res, next) => {
  console.log("Entering checkShopOwnership middleware", req);

  const resourceShopId = req.body.shopId || req.params.id;
  console.log("resourceShopId", resourceShopId);

  if (!resourceShopId) {
    return res.status(400).send({ message: "Shop ID is required" });
  }

  // Find the user by their ID
  User.findByPk(req.userId, { include: ["roles"] })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not Found" });
      }

      // Check if user is admin and bypass ownership check
      const isAdmin = user.roles.some(
        (role) => role.name === "admin" || role.name === "internal_admin"
      );

      if (isAdmin) {
        console.log("Admin detected, bypassing shop ownership check.");
        return next();
      }

      // Fetch the shop and check if it belongs to the user's account
      Shop.findByPk(resourceShopId)
        .then((shop) => {
          if (!shop) {
            return res.status(404).send({ message: "Shop Not Found" });
          }

          // Ensure the shop's accountId matches the user's accountId
          if (shop.accountId !== user.accountId) {
            return res.status(403).send({
              message: "Access Denied: Not within your account hierarchy!",
            });
          }

          next();
        })
        .catch((err) => {
          console.error("Error fetching shop:", err.message);
          res.status(500).send({ message: err.message });
        });
    })
    .catch((err) => {
      console.error("Error fetching user:", err.message);
      res.status(500).send({ message: err.message });
    });
};

// ✅ New isAdminOrExternalAdmin middleware
isAdminOrExternalAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      user.getRoles().then((roles) => {
        const hasPermission = roles.some((role) =>
          ["admin", "internal_admin", "external_admin"].includes(role.name)
        );

        if (hasPermission) {
          next();
          return;
        }

        res
          .status(403)
          .send({ message: "Require Admin or External Admin Role!" });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isExternalAdmin,
  isAdminOrExternalAdmin,
  isExternalSubAdmin,
  isExternalUser,
  checkAccountOwnership,
  checkShopOwnership,
};

module.exports = authJwt;

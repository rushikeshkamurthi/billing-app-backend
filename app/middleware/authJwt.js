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
          if (roles[i].name === "admin") {
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
          if (roles[i].name === "external_admin") {
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

// Hierarchy Checks
// checkAccountOwnership = (req, res, next) => {
//   const resourceAccountId = req.body.accountId || req.params.id;

//   User.findByPk(req.userId)
//     .then((user) => {
//       if (user.accountId !== resourceAccountId) {
//         return res.status(403).send({
//           message: "Access Denied: Not within your account hierarchy!",
//         });
//       }
//       next();
//     })
//     .catch((err) => {
//       res.status(500).send({ message: err.message });
//     });
// };

checkAccountOwnership = (req, res, next) => {
  console.log("Entering checkAccountOwnership middleware");

  // Use req.params.id to get the account ID from the URL
  const resourceAccountId = req.body.accountId || req.params.id;
  console.log(`Resource Account ID from request: ${resourceAccountId}`);

  User.findByPk(req.userId)
    .then((user) => {
      console.log(`User fetched: ${user ? user.id : "User not found"}`);
      console.log(`User Account ID: ${user ? user.accountId : "N/A"}`);

      if (!user) {
        console.log("User not found, sending 404 response");
        return res.status(404).send({
          message: "User not found",
        });
      }

      if (user.accountId != resourceAccountId) {
        console.log("Account ID mismatch detected. Access denied.");
        console.log(
          `User's Account ID: ${user.accountId}, Resource's Account ID: ${resourceAccountId}`
        );
        return res.status(403).send({
          message: "Access Denied: Not within your account hierarchy!",
        });
      }

      console.log("Account ID match confirmed. Proceeding to next middleware.");
      next();
    })
    .catch((err) => {
      console.error("Error fetching user:", err.message);
      res.status(500).send({ message: err.message });
    });
};

checkShopOwnership = (req, res, next) => {
  const resourceShopId = req.body.shopId || req.params.shopId;

  // First, find the shop by its ID
  Shop.findByPk(resourceShopId)
    .then((shop) => {
      if (!shop) {
        return res.status(404).send({ message: "Shop Not Found" });
      }

      // If shop exists, find the user by their ID
      User.findByPk(req.userId)
        .then((user) => {
          if (!user) {
            return res.status(404).send({ message: "User Not Found" });
          }

          // Check if the user's accountId matches the shop's accountId
          if (shop.accountId !== user.accountId) {
            return res.status(403).send({
              message: "Access Denied: Not within your account hierarchy!",
            });
          }

          // If everything is fine, proceed to the next middleware or route handler
          next();
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
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
  isExternalSubAdmin,
  isExternalUser,
  checkAccountOwnership,
  checkShopOwnership,
};
module.exports = authJwt;

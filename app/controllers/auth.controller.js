const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

// Generate a new refresh token and save it to the database
const generateRefreshToken = async (user) => {
  let expiryDate = new Date();
  expiryDate.setSeconds(expiryDate.getSeconds() + config.jwtRefreshExpiration);

  let token = uuidv4();

  return await RefreshToken.create({
    token: token,
    userId: user.id,
    expiryDate: expiryDate.getTime(),
  });
};

exports.signup = (req, res) => {
  console.log("Signup request received");
  console.log("Request body:", req.body);

  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      console.log("User created:", user);

      if (req.body.role) {
        console.log("Role provided:", req.body.role);

        Role.findOne({
          where: {
            name: req.body.role,
          },
        })
          .then((role) => {
            if (!role) {
              console.error("Role not found:", req.body.role);
              return res.status(404).send({ message: "Role not found." });
            }

            console.log("Role found:", role);
            user.setRoles([role.id]).then(() => {
              console.log("Role assigned to user:", role.name);
              res.send({ message: "User registered successfully!" });
            });
          })
          .catch((err) => {
            console.error("Error finding role:", err.message);
            res.status(500).send({ message: err.message });
          });
      } else {
        console.log("No role provided, assigning default role (USER_ROLE)");

        user.setRoles([1]).then(() => {
          console.log("Default role assigned to user");
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch((err) => {
      console.error("Error creating user:", err.message);
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: config.jwtExpiration, // Use config for token expiration
      });

      const refreshToken = await generateRefreshToken(user);

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
          refreshToken: refreshToken.token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  RefreshToken.findOne({ where: { token: requestToken } })
    .then((token) => {
      if (!token) {
        return res.status(403).json({ message: "Refresh token not found." });
      }

      if (token.expiryDate.getTime() < new Date().getTime()) {
        RefreshToken.destroy({ where: { id: token.id } });
        return res
          .status(403)
          .json({ message: "Refresh token expired. Please sign in again." });
      }

      const newAccessToken = jwt.sign({ id: token.userId }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: config.jwtExpiration,
      });

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: token.token,
      });
    })
    .catch((err) => {
      return res.status(500).send({ message: err.message });
    });
};

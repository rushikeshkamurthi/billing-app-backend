const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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

// exports.signup = (req, res) => {
//   // Save User to Database
//   User.create({
//     username: req.body.username,
//     email: req.body.email,
//     password: bcrypt.hashSync(req.body.password, 8)
//   })
//     .then(user => {
//       if (req.body.roles) {
//         Role.findAll({
//           where: {
//             name: {
//               [Op.or]: req.body.roles
//             }
//           }
//         }).then(roles => {
//           user.setRoles(roles).then(() => {
//             res.send({ message: "User registered successfully!" });
//           });
//         });
//       } else {
//         // user role = 1
//         user.setRoles([1]).then(() => {
//           res.send({ message: "User registered successfully!" });
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({ message: err.message });
//     });
// };

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
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
        expiresIn: 86400, // 24 hours
      });

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
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

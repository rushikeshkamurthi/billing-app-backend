module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    accountId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  User.associate = function (models) {
    User.belongsTo(models.account, {
      foreignKey: "accountId",
      as: "account",
    });

    User.belongsToMany(models.role, {
      through: "user_roles",
      foreignKey: "userId",
      otherKey: "roleId",
    });
  };

  return User;
};

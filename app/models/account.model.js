module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define("accounts", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  Account.associate = function (models) {
    Account.hasMany(models.shop, {
      foreignKey: "accountId",
      as: "shops",
      scope: {
        isDeleted: false, // Exclude soft-deleted shops by default
      },
    });
  };

  return Account;
};
